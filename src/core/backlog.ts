import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import matter from 'gray-matter';
import { load as parse } from 'js-yaml';
import type { ChangelogEntry, Config, Task, TaskData, TaskFilters } from '../types';
import { getCurrentTimestamp } from '../utils/date';
import { Errors } from '../utils/errors';
import { FileSystemRepository } from './repositories/FileSystemRepository';
import { LokiIndexedRepository } from './repositories/LokiIndexedRepository';
import type { TaskRepository } from './repositories/TaskRepository';
import { TaskValidator } from './validator';

export class Backlog {
  private rootPath: string;
  private backlogPath: string;
  private config: Config;
  private repository: TaskRepository;
  private validator: TaskValidator;

  private constructor(rootPath: string, config: Config, repository: TaskRepository) {
    this.rootPath = rootPath;
    this.backlogPath = path.join(rootPath, 'backlog');
    this.config = config;
    this.repository = repository;
    this.validator = new TaskValidator(config);
  }

  static async load(cwd: string = process.cwd()): Promise<Backlog> {
    const configPath = path.join(cwd, 'backlog', 'config.yml');

    try {
      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = parse(configContent) as Config;

      const backlogPath = path.join(cwd, 'backlog');

      // Auto-migrate: add performance settings if missing
      let needsSave = false;
      if (!config.performance) {
        config.performance = {
          useIndex: true,
          rebuildIndexOnStart: false,
        };
        needsSave = true;
      }

      // Auto-migrate: add validations settings if missing
      if (!config.validations) {
        config.validations = {
          close: {
            check_subtasks: true,
            check_dependencies: true,
            check_blocked_by: true,
            check_acceptance_criteria: true,
            warn_missing_ai_review: true,
            warn_early_close: true,
            warn_late_close: true,
            warn_quick_close: 300,
            suggest_parent_close: true,
            notify_unblocked: true,
            allow_force: true,
          },
        };
        needsSave = true;
      }

      // Auto-migrate: add priorities if missing
      if (!config.board.priorities) {
        config.board.priorities = ['low', 'medium', 'high', 'critical'];
        needsSave = true;
      }

      // Save updated config if needed
      if (needsSave) {
        const { dump } = await import('js-yaml');
        const updatedContent = dump(config, { lineWidth: -1 });
        await fs.writeFile(configPath, updatedContent, 'utf-8');
      }

      // Choose repository based on config
      const useIndex = config.performance?.useIndex ?? true;
      const rebuildIndex = config.performance?.rebuildIndexOnStart ?? false;

      let repository: TaskRepository;

      if (useIndex) {
        const lokiRepo = new LokiIndexedRepository(backlogPath);

        // Rebuild or sync index
        if (rebuildIndex) {
          await lokiRepo.rebuild?.();
        } else {
          await lokiRepo.sync?.();
        }

        repository = lokiRepo;
      } else {
        repository = new FileSystemRepository(backlogPath);
      }

      return new Backlog(cwd, config, repository);
    } catch (_error) {
      throw new Error(Errors.backlogNotInitialized());
    }
  }

  async createTask(data: TaskData, user?: string): Promise<Task> {
    // Validate task data before creation
    const status = data.status || this.config.board.columns[0];
    const priority = data.priority || 'medium';

    this.validator.validateStatus(status);
    this.validator.validatePriority(priority);

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
      status,
      priority,
      milestone: data.milestone,

      // Personnes et labels
      assignees: data.assignees || [],
      labels: data.labels || [],

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

    await this.repository.createTask(task);

    return task;
  }

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    return this.repository.getTasks(filters);
  }

  async getTaskById(id: number): Promise<Task | null> {
    return this.repository.getTaskById(id);
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return this.getTasks({ status });
  }

  async updateTask(id: number, updates: Partial<Task>, user?: string): Promise<Task> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error(Errors.taskNotFound(id));
    }

    // Validate updates before applying
    this.validator.validateTaskUpdates(updates);

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
    if (
      updates.dependencies &&
      JSON.stringify(updates.dependencies) !== JSON.stringify(task.dependencies)
    ) {
      await this.updateBlockedByRelations(id, task.dependencies, updates.dependencies);
      changes.push('dependencies updated');
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

    // Sauvegarder via repository
    await this.repository.updateTask(updatedTask);

    return updatedTask;
  }

  async addAIPlan(id: number, plan: string, user = 'AI'): Promise<Task> {
    return this.updateTask(id, { ai_plan: plan }, user);
  }

  async addAINote(id: number, note: string, user = 'AI'): Promise<Task> {
    const task = await this.getTaskById(id);
    if (!task) throw new Error(Errors.taskNotFound(id));

    const timestamp = getCurrentTimestamp();
    const timestampedNote = `**${timestamp}** - ${note}\n`;
    const existingNotes = task.ai_notes || '';
    const newNotes = existingNotes + timestampedNote;

    return this.updateTask(id, { ai_notes: newNotes }, user);
  }

  async addAIDocumentation(id: number, doc: string, user = 'AI'): Promise<Task> {
    return this.updateTask(id, { ai_documentation: doc }, user);
  }

  async addAIReview(id: number, review: string, user = 'AI'): Promise<Task> {
    return this.updateTask(id, { ai_review: review }, user);
  }

  async getSubtasks(parentId: number): Promise<Task[]> {
    return this.getTasks({ parent: parentId });
  }

  async getBlockedTasks(): Promise<Task[]> {
    const allTasks = await this.getTasks();
    return allTasks.filter((t) => t.blocked_by.length > 0);
  }

  getConfig(): Config;
  getConfig<T = unknown>(key: string): T;
  getConfig<T = unknown>(key?: string): T | Config {
    if (!key) {
      return this.config;
    }
    return key.split('.').reduce((obj, k) => obj?.[k], this.config as never) as T;
  }

  /**
   * Get valid statuses from config
   */
  getValidStatuses(): string[] {
    return this.validator.getValidStatuses();
  }

  /**
   * Get valid priorities from config
   */
  getValidPriorities(): string[] {
    return this.validator.getValidPriorities();
  }

  /**
   * Get the backlog directory path
   */
  getBacklogPath(): string {
    return this.backlogPath;
  }

  /**
   * Refresh the task index from the file system
   * Useful for real-time updates in interactive UIs
   */
  async refresh(): Promise<void> {
    await this.repository.sync?.();
  }

  /**
   * Close the backlog and cleanup resources
   * Important for LokiJS to stop autosave timer
   */
  async close(): Promise<void> {
    await this.repository.close?.();
  }

  private async addSubtaskToParent(parentId: number, subtaskId: number): Promise<void> {
    const parent = await this.getTaskById(parentId);
    if (!parent) {
      throw new Error(Errors.parentTaskNotFound(parentId));
    }

    if (!parent.subtasks.includes(subtaskId)) {
      parent.subtasks.push(subtaskId);
      await this.repository.updateTask(parent);
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
    const added = newDeps.filter((d) => !oldDeps.includes(d));
    const removed = oldDeps.filter((d) => !newDeps.includes(d));

    // Pour chaque dépendance ajoutée, ajouter taskId à son blocked_by
    for (const depId of added) {
      const depTask = await this.getTaskById(depId);
      if (depTask && !depTask.blocked_by.includes(taskId)) {
        depTask.blocked_by.push(taskId);
        await this.repository.updateTask(depTask);
      }
    }

    // Pour chaque dépendance supprimée, retirer taskId de son blocked_by
    for (const depId of removed) {
      const depTask = await this.getTaskById(depId);
      if (depTask) {
        depTask.blocked_by = depTask.blocked_by.filter((id) => id !== taskId);
        await this.repository.updateTask(depTask);
      }
    }
  }

  private async getNextTaskId(): Promise<number> {
    return this.repository.getNextTaskId();
  }

  private formatId(id: number): string {
    return this.config.display.zeroPaddedIds ? String(id).padStart(3, '0') : String(id);
  }

  private sanitizeFileName(name: string): string {
    // Normaliser les caractères Unicode (décomposition)
    // puis supprimer uniquement les caractères vraiment problématiques pour les systèmes de fichiers
    const normalized = name.normalize('NFD'); // Décompose les caractères accentués (é -> e + ´)
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: Intentional use to remove diacritics after NFD normalization
    const withoutDiacritics = normalized.replace(/[\u0300-\u036f]/g, ''); // Supprime les marques diacritiques
    // biome-ignore lint/suspicious/noControlCharactersInRegex: Intentional use to sanitize filenames by removing control characters
    const sanitized = withoutDiacritics.replace(/[<>:"/\\|?*\x00-\x1f]/g, ''); // Supprime les caractères interdits dans les noms de fichiers
    return sanitized.replace(/\s+/g, ' ').trim(); // Normalise les espaces
  }
}
