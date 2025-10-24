import chalk from 'chalk';

export interface ErrorContext {
  command?: string;
  taskId?: number;
  suggestion?: string;
  example?: string;
}

/**
 * Format a user-friendly error message with helpful context
 */
export function formatError(message: string, context?: ErrorContext): string {
  let output = chalk.red(`✗ ${message}`);

  if (context?.suggestion) {
    output += `\n${chalk.yellow('💡 Suggestion:')} ${context.suggestion}`;
  }

  if (context?.example) {
    output += `\n${chalk.gray('Example:')} ${chalk.cyan(context.example)}`;
  }

  return output;
}

/**
 * Common error messages with helpful context
 */
export const Errors = {
  backlogNotInitialized: () =>
    formatError('Backlog not initialized in this directory', {
      suggestion: 'Initialize a new backlog first',
      example: 'backmark init "My Project"',
    }),

  taskNotFound: (id: number) =>
    formatError(`Task #${id} not found`, {
      suggestion: 'Check that the task ID exists',
      example: 'backmark task list',
    }),

  invalidTaskId: (value: string) =>
    formatError(`Invalid task ID: "${value}"`, {
      suggestion: 'Task ID must be a positive number',
      example: 'backmark task view 1',
    }),

  invalidCriterionIndex: (index: number, max: number) =>
    formatError(`Criterion index ${index} out of range`, {
      suggestion: `Index must be between 0 and ${max}`,
      example: 'backmark task check list 1',
    }),

  parentTaskNotFound: (parentId: number) =>
    formatError(`Parent task #${parentId} not found`, {
      suggestion: 'Create the parent task first, or use a different parent ID',
      example: 'backmark task list',
    }),

  invalidStatus: (status: string, validStatuses: string[]) =>
    formatError(`Invalid status: "${status}"`, {
      suggestion: `Valid statuses: ${validStatuses.join(', ')}`,
      example: `backmark task edit 1 --status "${validStatuses[0]}"`,
    }),

  invalidPriority: (priority: string) =>
    formatError(`Invalid priority: "${priority}"`, {
      suggestion: 'Valid priorities: low, medium, high, critical',
      example: 'backmark task edit 1 --priority high',
    }),

  noTasksFound: (filters?: string) =>
    formatError(
      filters ? `No tasks found matching: ${filters}` : 'No tasks found',
      {
        suggestion: filters
          ? 'Try removing some filters or create a new task'
          : 'Create your first task',
        example: 'backmark task create "My first task"',
      }
    ),

  commandFailed: (command: string, error: Error) => {
    const baseMessage = formatError(`Failed to ${command}`, {
      suggestion: 'Check the error details below',
    });
    return `${baseMessage}\n${chalk.dim(error.message)}`;
  },

  circularDependency: (taskId: number, dependencyId: number) =>
    formatError(
      `Circular dependency detected between tasks #${taskId} and #${dependencyId}`,
      {
        suggestion:
          'Remove one of the dependencies to break the circular reference',
        example: 'backmark task deps 1',
      }
    ),

  boardRequiresTTY: () =>
    formatError('Interactive board requires a TTY terminal', {
      suggestion:
        'This command cannot be run from non-interactive environments. Try using board export instead.',
      example: 'backmark board export',
    }),

  fileSystemError: (operation: string, path: string, error: Error) =>
    formatError(`Failed to ${operation}: ${path}`, {
      suggestion: 'Check file permissions and disk space',
    }) + `\n${chalk.dim(error.message)}`,
};

/**
 * Validate task ID and return parsed number or throw formatted error
 */
export function validateTaskId(value: string | number): number {
  const id = typeof value === 'string' ? Number.parseInt(value, 10) : value;

  if (Number.isNaN(id) || id <= 0) {
    throw new Error(Errors.invalidTaskId(String(value)));
  }

  return id;
}

/**
 * Validate criterion index
 */
export function validateCriterionIndex(
  index: string | number,
  maxIndex: number
): number {
  const idx = typeof index === 'string' ? Number.parseInt(index, 10) : index;

  if (Number.isNaN(idx) || idx < 0 || idx > maxIndex) {
    throw new Error(Errors.invalidCriterionIndex(idx, maxIndex));
  }

  return idx;
}

/**
 * Validate status against valid options
 */
export function validateStatus(status: string, validStatuses: string[]): void {
  if (!validStatuses.includes(status)) {
    throw new Error(Errors.invalidStatus(status, validStatuses));
  }
}

/**
 * Validate priority
 */
export function validatePriority(priority: string): void {
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  if (!validPriorities.includes(priority.toLowerCase())) {
    throw new Error(Errors.invalidPriority(priority));
  }
}
