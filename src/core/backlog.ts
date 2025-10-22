import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import { load as parse } from 'js-yaml';
import type { Task, TaskData, TaskFilters, Config, ChangelogEntry } from '../types';
import { getCurrentTimestamp } from '../utils/date';

export class Backlog {
  private rootPath: string;
  private backlogPath: string;
  private config: Config;

  private constructor(rootPath: string, config: Config) {
    this.rootPath = rootPath;
    this.backlogPath = path.join(rootPath, 'backlog');
    this.config = config;
  }

  static async load(cwd: string = process.cwd()): Promise<Backlog> {
    const configPath = path.join(cwd, 'backlog', 'config.yml');

    try {
      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = parse(configContent) as Config;
      return new Backlog(cwd, config);
    } catch (error) {
      throw new Error('Backlog not initialized. Run ' + '`backmark init`' + ' first.');
    }
  }

  async createTask(data: TaskData, user?: string): Promise<Task> {
    const id = await this.getNextTaskId();
    const fileName = this.sanitizeFileName(`task-${this.formatId(id)} - ${data.title}.md`);
    const filePath = path.join(this.backlogPath, fileName);

    const now = getCurrentTimestamp();

    const task: Task = {
      id,
      title: data.title,
      description: data.description || '',

      // Dates manuelles
      start_date: data.start_date,
      end_date: data.end_date,
      release_date: data.release_date,

      // Dates automatiques
      created_date: now,
      updated_date: now,

      // Organisation
      status: data.status || 'To Do',
      priority: data.priority || 'medium',
      keywords: data.keywords || [],
      milestone: data.milestone,

      // Personnes et labels
      assignees: data.assignees || [],
      labels: [],

      // Hiérarchie
      parent_task: data.parent_task,
      subtasks: [],
      dependencies: data.dependencies || [],
      blocked_by: [],

      // Historique
      changelog: [
        {
          timestamp: now,
          action: 'created',
          details: 'Task created',
          user: user || 'system',
        },
      ],

      // Critères d'acceptation
      acceptance_criteria: [],

      // Métadonnées système
      filePath,
    };

    // Si c'est une sous-tâche, mettre à jour le parent
    if (data.parent_task) {
      await this.addSubtaskToParent(data.parent_task, id);
    }

    // Si la tâche a des dépendances, mettre à jour les blocked_by
    if (data.dependencies && data.dependencies.length > 0) {
      await this.updateBlockedByRelations(id, [], data.dependencies);
    }

    const content = this.serializeTask(task);
    await fs.writeFile(filePath, content, 'utf-8');

    return task;
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

    return tasks.sort((a, b) => a.id - b.id); // Sort by ID ascending (oldest first)
  }

  async getTaskById(id: number): Promise<Task | null> {
    const tasks = await this.getTasks();
    return tasks.find((t) => t.id === id) || null;
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return this.getTasks({ status });
  }

  async updateTask(id: number, updates: Partial<Task>, user?: string): Promise<Task> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error(`Task #${id} not found`);
    }

    const now = getCurrentTimestamp();

    // Détecter les changements pour le changelog
    const changes: string[] = [];
    if (updates.status && updates.status !== task.status) {
      changes.push(`status: ${task.status} → ${updates.status}`);
      // Si la tâche passe à "Done", ajouter closed_date
      if (updates.status === 'Done') {
        updates.closed_date = now;
      }
    }
    if (updates.priority && updates.priority !== task.priority) {
      changes.push(`priority: ${task.priority} → ${updates.priority}`);
    }
    if (updates.milestone && updates.milestone !== task.milestone) {
      changes.push(`milestone: ${task.milestone || 'none'} → ${updates.milestone}`);
    }

    // Si les dépendances changent, mettre à jour blocked_by
    if (updates.dependencies && JSON.stringify(updates.dependencies) !== JSON.stringify(task.dependencies)) {
      await this.updateBlockedByRelations(id, task.dependencies, updates.dependencies);
      changes.push(`dependencies updated`);
    }

    // Mettre à jour le changelog
    const newChangelog: ChangelogEntry = {
      timestamp: now,
      action: changes.length > 0 ? 'updated' : 'modified',
      details: changes.join(', ') || 'Task updated',
      user: user || 'system',
    };

    const updatedTask: Task = {
      ...task,
      ...updates,
      updated_date: now,
      changelog: [...task.changelog, newChangelog],
    };

    // Sauvegarder
    const content = this.serializeTask(updatedTask);
    await fs.writeFile(task.filePath, content, 'utf-8');

    return updatedTask;
  }

  async addAIPlan(id: number, plan: string, user: string = 'AI'): Promise<Task> {
    return this.updateTask(
      id,
      { ai_plan: plan },
      user
    );
  }

  async addAINote(id: number, note: string, user: string = 'AI'): Promise<Task> {
    const task = await this.getTaskById(id);
    if (!task) throw new Error(`Task #${id} not found`);

    const timestamp = getCurrentTimestamp();
    const timestampedNote = `**${timestamp}** - ${note}\n`;
    const existingNotes = task.ai_notes || '';
    const newNotes = existingNotes + timestampedNote;

    return this.updateTask(id, { ai_notes: newNotes }, user);
  }

  async addAIDocumentation(id: number, doc: string, user: string = 'AI'): Promise<Task> {
    return this.updateTask(id, { ai_documentation: doc }, user);
  }

  async addAIReview(id: number, review: string, user: string = 'AI'): Promise<Task> {
    return this.updateTask(id, { ai_review: review }, user);
  }

  async getSubtasks(parentId: number): Promise<Task[]> {
    return this.getTasks({ parent: parentId });
  }

  async getBlockedTasks(): Promise<Task[]> {
    const allTasks = await this.getTasks();
    return allTasks.filter((t) => t.blocked_by.length > 0);
  }

  getConfig<T = unknown>(key: string): T {
    return key.split('.').reduce((obj, k) => obj?.[k], this.config as never) as T;
  }

  private async addSubtaskToParent(parentId: number, subtaskId: number): Promise<void> {
    const parent = await this.getTaskById(parentId);
    if (!parent) {
      throw new Error(`Parent task #${parentId} not found`);
    }

    if (!parent.subtasks.includes(subtaskId)) {
      parent.subtasks.push(subtaskId);
      const content = this.serializeTask(parent);
      await fs.writeFile(parent.filePath, content, 'utf-8');
    }
  }

  /**
   * Met à jour les relations blocked_by quand les dépendances changent
   * @param taskId - ID de la tâche dont les dépendances changent
   * @param oldDeps - Anciennes dépendances
   * @param newDeps - Nouvelles dépendances
   */
  private async updateBlockedByRelations(
    taskId: number,
    oldDeps: number[],
    newDeps: number[]
  ): Promise<void> {
    // Trouver les dépendances ajoutées et supprimées
    const added = newDeps.filter(d => !oldDeps.includes(d));
    const removed = oldDeps.filter(d => !newDeps.includes(d));

    // Pour chaque dépendance ajoutée, ajouter taskId à son blocked_by
    for (const depId of added) {
      const depTask = await this.getTaskById(depId);
      if (depTask && !depTask.blocked_by.includes(taskId)) {
        depTask.blocked_by.push(taskId);
        const content = this.serializeTask(depTask);
        await fs.writeFile(depTask.filePath, content, 'utf-8');
      }
    }

    // Pour chaque dépendance supprimée, retirer taskId de son blocked_by
    for (const depId of removed) {
      const depTask = await this.getTaskById(depId);
      if (depTask) {
        depTask.blocked_by = depTask.blocked_by.filter(id => id !== taskId);
        const content = this.serializeTask(depTask);
        await fs.writeFile(depTask.filePath, content, 'utf-8');
      }
    }
  }

  private parseTask(content: string, filePath: string): Task {
    const { data, content: body } = matter(content);

    return {
      ...data,
      description: body.trim(),
      filePath,
      keywords: data.keywords || [],
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

  private async getNextTaskId(): Promise<number> {
    const tasks = await this.getTasks();
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map((t) => t.id)) + 1;
  }

  private formatId(id: number): string {
    return this.config.display.zeroPaddedIds ? String(id).padStart(3, '0') : String(id);
  }

  private sanitizeFileName(name: string): string {
    // Normaliser les caractères Unicode (décomposition)
    // puis supprimer uniquement les caractères vraiment problématiques pour les systèmes de fichiers
    return name
      .normalize('NFD') // Décompose les caractères accentués (é -> e + ´)
      .replace(/[\u0300-\u036f]/g, '') // Supprime les marques diacritiques
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, '') // Supprime les caractères interdits dans les noms de fichiers
      .replace(/\s+/g, ' ') // Normalise les espaces
      .trim();
  }

  private matchesFilters(task: Task, filters?: TaskFilters): boolean {
    if (!filters) return true;

    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assignee && !task.assignees.includes(filters.assignee)) return false;
    if (filters.label && !task.labels.some((l) => l === filters.label)) return false;
    if (filters.keyword && !task.keywords.some((k) => k === filters.keyword)) return false;
    if (filters.milestone && task.milestone !== filters.milestone) return false;
    if (filters.parent !== undefined && task.parent_task !== filters.parent) return false;

    return true;
  }
}
