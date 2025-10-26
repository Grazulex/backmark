import chalk from 'chalk';
import type { Config } from '../types/config';

export class ValidationError extends Error {
  public readonly suggestions: string[];

  constructor(message: string, suggestions: string[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.suggestions = suggestions;
  }
}

export class TaskValidator {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  /**
   * Valide que le status est dans la liste des colonnes autorisées
   */
  validateStatus(status: string | undefined): void {
    if (!status) {
      throw new ValidationError('Status is required', [
        `Use one of: ${this.config.board.columns.join(', ')}`,
      ]);
    }

    const validStatuses = this.config.board.columns;
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status "${chalk.red(status)}"`, [
        chalk.bold('Allowed statuses:'),
        ...validStatuses.map((s) => `  ${chalk.green('•')} ${chalk.cyan(s)}`),
        '',
        chalk.dim('Tip: Use'),
        chalk.cyan('  backmark config list-statuses'),
        chalk.dim('to see all available statuses'),
      ]);
    }
  }

  /**
   * Valide que la priority est dans la liste des priorités autorisées
   */
  validatePriority(priority: string | undefined): void {
    if (!priority) {
      throw new ValidationError('Priority is required', [
        `Use one of: ${this.config.board.priorities.join(', ')}`,
      ]);
    }

    const validPriorities = this.config.board.priorities;
    if (!validPriorities.includes(priority)) {
      throw new ValidationError(`Invalid priority "${chalk.red(priority)}"`, [
        chalk.bold('Allowed priorities:'),
        ...validPriorities.map((p) => `  ${chalk.green('•')} ${chalk.cyan(p)}`),
        '',
        chalk.dim('Tip: Use'),
        chalk.cyan('  backmark config list-priorities'),
        chalk.dim('to see all available priorities'),
      ]);
    }
  }

  /**
   * Valide les données d'une tâche lors de la création
   */
  validateTaskData(data: { status?: string; priority?: string }): void {
    // Valider le status (ou utiliser la valeur par défaut)
    const status = data.status || this.config.board.columns[0];
    this.validateStatus(status);

    // Valider la priority (ou utiliser la valeur par défaut)
    const priority = data.priority || 'medium';
    this.validatePriority(priority);
  }

  /**
   * Valide les mises à jour d'une tâche
   */
  validateTaskUpdates(updates: { status?: string; priority?: string }): void {
    if (updates.status !== undefined) {
      this.validateStatus(updates.status);
    }
    if (updates.priority !== undefined) {
      this.validatePriority(updates.priority);
    }
  }

  /**
   * Retourne les statuses valides
   */
  getValidStatuses(): string[] {
    return [...this.config.board.columns];
  }

  /**
   * Retourne les priorités valides
   */
  getValidPriorities(): string[] {
    return [...this.config.board.priorities];
  }
}
