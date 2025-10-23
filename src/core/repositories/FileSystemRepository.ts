import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import matter from 'gray-matter';
import type { Task, TaskFilters } from '../../types';
import type { TaskRepository } from './TaskRepository';

/**
 * File system based task repository
 * Reads and parses all task files on every operation (no caching)
 */
export class FileSystemRepository implements TaskRepository {
  private backlogPath: string;

  constructor(backlogPath: string) {
    this.backlogPath = backlogPath;
  }

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const files = await fs.readdir(this.backlogPath);
    const taskFiles = files.filter((f) => f.startsWith('task-') && f.endsWith('.md'));

    const tasks: Task[] = [];
    for (const file of taskFiles) {
      const filePath = path.join(this.backlogPath, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const task = this.parseTask(content, filePath);

      if (this.matchesFilters(task, filters)) {
        tasks.push(task);
      }
    }

    return tasks.sort((a, b) => a.id - b.id);
  }

  async getTaskById(id: number): Promise<Task | null> {
    const tasks = await this.getTasks();
    return tasks.find((t) => t.id === id) || null;
  }

  async createTask(task: Task): Promise<void> {
    const content = this.serializeTask(task);
    await fs.writeFile(task.filePath, content, 'utf-8');
  }

  async updateTask(task: Task): Promise<void> {
    const content = this.serializeTask(task);
    await fs.writeFile(task.filePath, content, 'utf-8');
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.getTaskById(id);
    if (task) {
      await fs.unlink(task.filePath);
    }
  }

  async getNextTaskId(): Promise<number> {
    const tasks = await this.getTasks();
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map((t) => t.id)) + 1;
  }

  // Helper methods

  private parseTask(content: string, filePath: string): Task {
    const { data, content: body } = matter(content);

    return {
      ...data,
      description: body.trim(),
      filePath,
      assignees: data.assignees || [],
      labels: data.labels || [],
      subtasks: data.subtasks || [],
      dependencies: data.dependencies || [],
      blocked_by: data.blocked_by || [],
      changelog: data.changelog || [],
      acceptance_criteria: data.acceptance_criteria || [],
    } as Task;
  }

  private serializeTask(task: Task): string {
    const { description, filePath, ...frontmatter } = task;

    // Remove undefined values to avoid YAML serialization errors
    const cleanedFrontmatter = Object.fromEntries(
      Object.entries(frontmatter).filter(([_, v]) => v !== undefined)
    );

    return matter.stringify(description, cleanedFrontmatter);
  }

  private matchesFilters(task: Task, filters?: TaskFilters): boolean {
    if (!filters) return true;

    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assignee && !task.assignees.includes(filters.assignee)) return false;
    if (filters.label && !task.labels.some((l) => l === filters.label)) return false;
    if (filters.milestone && task.milestone !== filters.milestone) return false;
    if (filters.parent !== undefined && task.parent_task !== filters.parent) return false;

    return true;
  }
}
