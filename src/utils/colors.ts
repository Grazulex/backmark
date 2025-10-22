import chalk from 'chalk';
import type { TaskPriority, TaskStatus } from '../types';

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
  return colorMap[priority](priority);
}

export function formatTaskId(id: number, zeroPadded = true): string {
  const formatted = zeroPadded ? String(id).padStart(3, '0') : String(id);
  return chalk.bold.cyan(`#${formatted}`);
}

export function formatDate(date: string | undefined, format: 'short' | 'long' = 'short'): string {
  if (!date) return chalk.gray('—');

  const d = new Date(date);
  if (format === 'short') {
    return chalk.gray(d.toISOString().split('T')[0]);
  }
  return chalk.gray(d.toLocaleString());
}

export function formatKeywords(keywords: string[], maxLength?: number): string {
  if (keywords.length === 0) return chalk.gray('—');

  const formatted = keywords.map((k) => chalk.blue(`#${k}`)).join(' ');

  // Si trop long, on tronque et on affiche juste le nombre
  if (maxLength && keywords.join(' ').length > maxLength) {
    const firstKeyword = chalk.blue(`#${keywords[0]}`);
    const remaining = keywords.length - 1;
    return remaining > 0 ? `${firstKeyword} ${chalk.gray(`+${remaining}`)}` : firstKeyword;
  }

  return formatted;
}

export function formatLabels(labels: string[]): string {
  if (labels.length === 0) return chalk.gray('—');
  return labels.map((l) => chalk.cyan(`[${l}]`)).join(' ');
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
  keyword: '🏷️',
  dependency: '🔗',
  blocked: '🚫',
  done: '✓',
  pending: '○',
  inProgress: '●',
};
