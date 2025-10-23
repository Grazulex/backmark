import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import matter from 'gray-matter';
import Loki from 'lokijs';
import type { Task, TaskFilters } from '../../types';
import type { TaskRepository } from './TaskRepository';

/**
 * Task metadata stored in LokiJS index
 * Excludes description and AI fields to keep index lightweight
 */
interface TaskIndex {
  id: number;
  title: string;
  status: string;
  priority: string;
  milestone?: string;
  assignees: string[];
  labels: string[];
  parent_task?: number;
  subtasks: number[];
  dependencies: number[];
  blocked_by: number[];
  start_date?: string;
  end_date?: string;
  release_date?: string;
  created_date: string;
  updated_date: string;
  closed_date?: string;
  filePath: string;
  file_mtime: number; // File modification time for incremental sync
}

/**
 * LokiJS-based task repository with in-memory indexing
 * Provides fast queries by caching task metadata in memory
 */
export class LokiIndexedRepository implements TaskRepository {
  private backlogPath: string;
  private db: Loki;
  private tasks: Collection<TaskIndex> | null = null;
  private initialized = false;

  constructor(backlogPath: string) {
    this.backlogPath = backlogPath;
    const dbPath = path.join(backlogPath, '.cache', 'tasks.db');

    this.db = new Loki(dbPath, {
      autosave: true,
      autosaveInterval: 4000,
    });
  }

  /**
   * Initialize the database and load/create the tasks collection
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    // Ensure .cache directory exists
    const cacheDir = path.join(this.backlogPath, '.cache');
    await fs.mkdir(cacheDir, { recursive: true });

    return new Promise<void>((resolve, reject) => {
      this.db.loadDatabase({}, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Get or create tasks collection with indices
        this.tasks = this.db.getCollection('tasks');
        if (!this.tasks) {
          this.tasks = this.db.addCollection('tasks', {
            indices: ['id', 'status', 'priority', 'milestone', 'parent_task'],
          });
        }

        this.initialized = true;
        resolve();
      });
    });
  }

  /**
   * Sync the index with the file system
   * Only re-indexes files that have been modified since last sync
   */
  async sync(): Promise<void> {
    await this.initialize();

    const files = await fs.readdir(this.backlogPath);
    const taskFiles = files.filter((f) => f.startsWith('task-') && f.endsWith('.md'));

    for (const file of taskFiles) {
      const filePath = path.join(this.backlogPath, file);

      try {
        const stats = await fs.stat(filePath);
        const cached = this.tasks?.findOne({ filePath });

        // Only re-parse if file is new or has been modified
        if (!cached || stats.mtimeMs > cached.file_mtime) {
          const content = await fs.readFile(filePath, 'utf-8');
          const taskIndex = this.parseTaskIndex(content, filePath, stats.mtimeMs);

          if (cached) {
            // Update existing
            Object.assign(cached, taskIndex);
            this.tasks?.update(cached);
          } else {
            // Insert new
            this.tasks?.insert(taskIndex);
          }
        }
      } catch (error) {
        // File might have been deleted, skip
        console.error(`Error syncing ${filePath}:`, error);
      }
    }

    // Remove deleted files from index
    const indexedPaths = this.tasks?.find().map((t) => t.filePath);
    const existingPaths = taskFiles.map((f) => path.join(this.backlogPath, f));

    for (const indexedPath of indexedPaths) {
      if (!existingPaths.includes(indexedPath)) {
        this.tasks?.findAndRemove({ filePath: indexedPath });
      }
    }

    // Save database
    await new Promise<void>((resolve) => {
      this.db.saveDatabase(() => resolve());
    });
  }

  /**
   * Rebuild the entire index from scratch
   */
  async rebuild(): Promise<void> {
    await this.initialize();

    // Clear existing index
    this.tasks?.clear();

    // Rebuild from files
    await this.sync();
  }

  /**
   * Close the database and stop autosave timer
   */
  async close(): Promise<void> {
    if (!this.initialized) return;

    return new Promise<void>((resolve) => {
      this.db.close(() => {
        this.initialized = false;
        resolve();
      });
    });
  }

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    await this.initialize();

    // Build LokiJS query
    const query: Record<string, unknown> = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.priority) {
      query.priority = filters.priority;
    }

    if (filters?.milestone) {
      query.milestone = filters.milestone;
    }

    if (filters?.parent !== undefined) {
      query.parent_task = filters.parent;
    }

    // Get tasks from index
    let indexedTasks = this.tasks?.chain().find(query).simplesort('id').data();

    // Apply additional filters that require array checks
    if (filters?.assignee) {
      const assignee = filters.assignee;
      indexedTasks = indexedTasks.filter((t) => t.assignees.includes(assignee));
    }

    if (filters?.label) {
      const label = filters.label;
      indexedTasks = indexedTasks.filter((t) => t.labels.includes(label));
    }

    // Load full tasks (including description and AI fields)
    const tasks: Task[] = [];
    for (const indexed of indexedTasks) {
      try {
        const task = await this.loadFullTask(indexed);
        tasks.push(task);
      } catch (error) {
        console.error(`Error loading task ${indexed.id}:`, error);
      }
    }

    return tasks;
  }

  async getTaskById(id: number): Promise<Task | null> {
    await this.initialize();

    const indexed = this.tasks?.findOne({ id });
    if (!indexed) return null;

    return this.loadFullTask(indexed);
  }

  async createTask(task: Task): Promise<void> {
    await this.initialize();

    // Write to file system
    const content = this.serializeTask(task);
    await fs.writeFile(task.filePath, content, 'utf-8');

    // Update index
    const stats = await fs.stat(task.filePath);
    const content2 = await fs.readFile(task.filePath, 'utf-8');
    const taskIndex = this.parseTaskIndex(content2, task.filePath, stats.mtimeMs);
    this.tasks?.insert(taskIndex);

    await new Promise<void>((resolve) => {
      this.db.saveDatabase(() => resolve());
    });
  }

  async updateTask(task: Task): Promise<void> {
    await this.initialize();

    // Write to file system
    const content = this.serializeTask(task);
    await fs.writeFile(task.filePath, content, 'utf-8');

    // Update index
    const stats = await fs.stat(task.filePath);
    const content2 = await fs.readFile(task.filePath, 'utf-8');
    const taskIndex = this.parseTaskIndex(content2, task.filePath, stats.mtimeMs);

    const cached = this.tasks?.findOne({ id: task.id });
    if (cached) {
      Object.assign(cached, taskIndex);
      this.tasks?.update(cached);
    } else {
      this.tasks?.insert(taskIndex);
    }

    await new Promise<void>((resolve) => {
      this.db.saveDatabase(() => resolve());
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.initialize();

    const task = await this.getTaskById(id);
    if (!task) return;

    // Delete from file system
    await fs.unlink(task.filePath);

    // Remove from index
    this.tasks?.findAndRemove({ id });

    await new Promise<void>((resolve) => {
      this.db.saveDatabase(() => resolve());
    });
  }

  async getNextTaskId(): Promise<number> {
    await this.initialize();

    const allTasks = this.tasks?.find();
    if (allTasks.length === 0) return 1;
    return Math.max(...allTasks.map((t) => t.id)) + 1;
  }

  /**
   * Parse task file and extract only indexed fields (lightweight)
   */
  private parseTaskIndex(content: string, filePath: string, mtime: number): TaskIndex {
    const { data } = matter(content);

    return {
      id: data.id,
      title: data.title,
      status: data.status,
      priority: data.priority,
      milestone: data.milestone,
      assignees: data.assignees || [],
      labels: data.labels || [],
      parent_task: data.parent_task,
      subtasks: data.subtasks || [],
      dependencies: data.dependencies || [],
      blocked_by: data.blocked_by || [],
      start_date: data.start_date,
      end_date: data.end_date,
      release_date: data.release_date,
      created_date: data.created_date,
      updated_date: data.updated_date,
      closed_date: data.closed_date,
      filePath,
      file_mtime: mtime,
    };
  }

  /**
   * Load full task from file (including description and AI fields)
   */
  private async loadFullTask(indexed: TaskIndex): Promise<Task> {
    const content = await fs.readFile(indexed.filePath, 'utf-8');
    const { data, content: body } = matter(content);

    return {
      id: indexed.id,
      title: indexed.title,
      description: body.trim(),
      status: indexed.status,
      priority: indexed.priority,
      milestone: indexed.milestone,
      assignees: indexed.assignees,
      labels: indexed.labels,
      parent_task: indexed.parent_task,
      subtasks: indexed.subtasks,
      dependencies: indexed.dependencies,
      blocked_by: indexed.blocked_by,
      start_date: indexed.start_date,
      end_date: indexed.end_date,
      release_date: indexed.release_date,
      created_date: indexed.created_date,
      updated_date: indexed.updated_date,
      closed_date: indexed.closed_date,
      changelog: data.changelog || [],
      acceptance_criteria: data.acceptance_criteria || [],
      ai_plan: data.ai_plan,
      ai_notes: data.ai_notes,
      ai_documentation: data.ai_documentation,
      ai_review: data.ai_review,
      filePath: indexed.filePath,
    } as Task;
  }

  /**
   * Serialize task to Markdown with YAML frontmatter
   */
  private serializeTask(task: Task): string {
    const { description, filePath, ...frontmatter } = task;

    // Remove undefined values
    const cleanedFrontmatter = Object.fromEntries(
      Object.entries(frontmatter).filter(([_, v]) => v !== undefined)
    );

    return matter.stringify(description, cleanedFrontmatter);
  }
}
