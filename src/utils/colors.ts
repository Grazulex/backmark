import chalk from 'chalk';
import type { Backlog } from '../core/backlog';
import type { TaskPriority, TaskStatus } from '../types';
import { formatDateWithPattern } from './date';

export const colors = {
  primary: chalk.blue,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  info: chalk.cyan,
  muted: chalk.gray,
  bold: chalk.bold,
  ai: chalk.magenta, // Couleur spéciale pour l'IA
};

export function colorizeStatus(status: TaskStatus): string {
  const colorMap: Record<string, typeof chalk> = {
    'To Do': chalk.gray,
    'In Progress': chalk.yellow,
    Review: chalk.cyan,
    Done: chalk.green,
    Blocked: chalk.red,
  };
  const colorFn = colorMap[status] || chalk.white;
  return colorFn(status);
}

export function colorizePriority(priority: TaskPriority): string {
  const colorMap: Record<TaskPriority, typeof chalk> = {
    low: chalk.blue,
    medium: chalk.yellow,
    high: chalk.red,
    critical: chalk.bgRed.white.bold,
  };
  const colorFn = colorMap[priority] || chalk.white;
  return colorFn(priority);
}

export function formatTaskId(id: number, zeroPadded = true): string {
  const formatted = zeroPadded ? String(id).padStart(3, '0') : String(id);
  return chalk.bold.cyan(`#${formatted}`);
}

export function formatDate(
  date: string | undefined,
  format: 'short' | 'long' = 'short',
  backlog?: Backlog
): string {
  if (!date) return chalk.gray('—');

  // Get date format from config if backlog is provided
  let pattern: string;
  if (backlog) {
    const configFormat = backlog.getConfig<string>('display.dateFormat');
    pattern = format === 'short' ? configFormat.split(' ')[0] : configFormat;
  } else {
    // Fallback to default formats
    pattern = format === 'short' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm';
  }

  return chalk.gray(formatDateWithPattern(date, pattern));
}

export function formatLabels(labels: string[], maxLength?: number): string {
  if (labels.length === 0) return chalk.gray('—');

  const formatted = labels.map((l) => chalk.cyan(`[${l}]`)).join(' ');

  // Si trop long, on tronque et on affiche juste le nombre
  if (maxLength && labels.join(' ').length > maxLength) {
    const firstLabel = chalk.cyan(`[${labels[0]}]`);
    const remaining = labels.length - 1;
    return remaining > 0 ? `${firstLabel} ${chalk.gray(`+${remaining}`)}` : firstLabel;
  }

  return formatted;
}

export function formatAssignees(assignees: string[]): string {
  if (assignees.length === 0) return chalk.gray('—');
  return assignees
    .map((a) => {
      // Coloration spéciale pour les IA
      if (
        a.toLowerCase().includes('ai') ||
        a.toLowerCase().includes('claude') ||
        a.toLowerCase().includes('gpt')
      ) {
        return chalk.magenta(a);
      }
      return chalk.white(a);
    })
    .join(', ');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}

// Icônes pour une meilleure UX
export const icons = {
  task: '📋',
  subtask: '  ├─',
  lastSubtask: '  └─',
  milestone: '🎯',
  ai: '🤖',
  user: '👤',
  date: '📅',
  priority: '⚡',
  status: '▶',
  label: '🏷️',
  dependency: '🔗',
  blocked: '🚫',
  done: '✓',
  pending: '○',
  inProgress: '●',
  error: '✗',
  warning: '⚠',
};
