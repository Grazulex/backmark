import blessed from 'blessed';
import type { Widgets } from 'blessed';
import chalk from 'chalk';
import { Backlog } from '../core/backlog';
import type { Task } from '../types';

export class BoardTUI {
  private screen: Widgets.Screen;
  private backlog: Backlog;
  private columns: string[];
  private boxes: Map<string, Widgets.BoxElement>;
  private refreshInterval?: NodeJS.Timeout;

  constructor(backlog: Backlog, columns: string[]) {
    this.backlog = backlog;
    this.columns = columns;
    this.boxes = new Map();

    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Backmark Kanban Board',
      fullUnicode: true,
    });

    this.setupKeybindings();
  }

  async render() {
    // Clear screen
    this.screen.children.forEach((child) => child.destroy());
    this.boxes.clear();

    // Header
    const header = blessed.box({
      top: 0,
      left: 0,
      width: '100%',
      height: 3,
      content: this.formatHeader(),
      tags: true,
      style: {
        fg: 'cyan',
        bold: true,
      },
    });
    this.screen.append(header);

    // Calculate column widths using screen width
    const screenWidth = this.screen.width as number;
    const numCols = this.columns.length;
    const colWidth = Math.floor(screenWidth / numCols);

    // Create columns
    for (let i = 0; i < this.columns.length; i++) {
      const columnName = this.columns[i];
      const tasks = await this.backlog.getTasksByStatus(columnName);

      // Last column takes remaining width
      const width = i === numCols - 1 ? (screenWidth as number) - (i * colWidth) : colWidth;

      const box = blessed.box({
        top: 3,
        left: i * colWidth,
        width: width,
        height: '100%-4',
        border: {
          type: 'line',
        },
        label: ` ${columnName} (${tasks.length}) `,
        tags: true,
        scrollable: true,
        alwaysScroll: true,
        scrollbar: {
          ch: '█',
          style: {
            fg: 'cyan',
          },
        },
        style: {
          border: {
            fg: this.getColumnColor(columnName),
          },
          label: {
            fg: this.getColumnColor(columnName),
            bold: true,
          },
        },
      });

      // Add tasks to column
      const content = this.formatColumnTasks(tasks);
      box.setContent(content);

      this.boxes.set(columnName, box);
      this.screen.append(box);
    }

    // Footer
    const footer = blessed.box({
      bottom: 0,
      left: 0,
      width: '100%',
      height: 1,
      content: this.formatFooter(),
      tags: true,
      style: {
        fg: 'white',
        bg: 'blue',
      },
    });
    this.screen.append(footer);

    this.screen.render();
  }

  private formatHeader(): string {
    const title = '{bold}{cyan-fg}🎯 Backmark Kanban Board{/cyan-fg}{/bold}';
    const project = this.backlog.getConfig<any>('project');
    const projectName = project?.name || 'Unknown';
    return `${title}  {gray-fg}│{/gray-fg}  {white-fg}${projectName}{/white-fg}`;
  }

  private formatFooter(): string {
    return ' {bold}r{/bold}:Refresh  {bold}q{/bold}:Quit  {bold}?{/bold}:Help  {gray-fg}│{/gray-fg}  Auto-refresh: 3s';
  }

  private formatColumnTasks(tasks: Task[]): string {
    if (tasks.length === 0) {
      return '\n{center}{gray-fg}No tasks{/gray-fg}{/center}';
    }

    const lines: string[] = [];
    const maxTitleWidth = 18; // Max width for title text

    for (const task of tasks) {
      const id = `{bold}{cyan-fg}#${String(task.id).padStart(3, '0')}{/cyan-fg}{/bold}`;
      const priority = this.formatPriorityCompact(task.priority);
      const title = this.truncate(task.title, maxTitleWidth);
      const assigneesText = this.formatAssigneesCompact(task.assignees);
      const milestone = task.milestone
        ? `{yellow-fg}🎯${this.truncate(task.milestone, 6)}{/yellow-fg}`
        : '';

      lines.push('');
      lines.push(`${id} ${priority}`);
      lines.push(`{white-fg}${title}{/white-fg}`);

      if (assigneesText) {
        lines.push(assigneesText);
      }

      if (milestone) {
        lines.push(milestone);
      }

      if (task.acceptance_criteria.length > 0) {
        const checked = task.acceptance_criteria.filter((c) => c.checked).length;
        const total = task.acceptance_criteria.length;
        const progress = `{gray-fg}✓${checked}/${total}{/gray-fg}`;
        lines.push(progress);
      }

      lines.push('{gray-fg}────────────{/gray-fg}');
    }

    return lines.join('\n');
  }

  private formatPriority(priority: string): string {
    const colors: Record<string, string> = {
      low: 'blue-fg',
      medium: 'yellow-fg',
      high: 'red-fg',
      critical: 'red-bg white-fg',
    };
    const color = colors[priority] || 'white-fg';
    return `{${color}}⚡${priority}{/${color}}`;
  }

  private formatPriorityCompact(priority: string): string {
    const symbols: Record<string, string> = {
      low: '{blue-fg}⚡L{/blue-fg}',
      medium: '{yellow-fg}⚡M{/yellow-fg}',
      high: '{red-fg}⚡H{/red-fg}',
      critical: '{red-fg}⚡!{/red-fg}',
    };
    return symbols[priority] || '{white-fg}⚡{/white-fg}';
  }

  private formatAssignees(assignees: string[], maxLength: number): string {
    if (assignees.length === 0) return '';

    const formatted = assignees.map((a) => {
      const truncated = this.truncate(a, 10);
      if (a.toLowerCase().includes('ai') || a.toLowerCase().includes('claude')) {
        return `{magenta-fg}${truncated}{/magenta-fg}`;
      }
      return `{white-fg}${truncated}{/white-fg}`;
    });

    const text = formatted.join(',');
    const result = `{gray-fg}👤{/gray-fg} ${text}`;

    return this.truncate(result, maxLength);
  }

  private formatAssigneesCompact(assignees: string[]): string {
    if (assignees.length === 0) return '';

    const first = this.truncate(assignees[0], 12);
    const isAI = first.toLowerCase().includes('ai') || first.toLowerCase().includes('claude');

    if (assignees.length === 1) {
      return isAI ? `{magenta-fg}🤖${first}{/magenta-fg}` : `{gray-fg}👤{/gray-fg}{white-fg}${first}{/white-fg}`;
    }

    const icon = isAI ? '🤖' : '👤';
    const color = isAI ? 'magenta-fg' : 'white-fg';
    return `{${color}}${icon}${first}{gray-fg}+${assignees.length - 1}{/gray-fg}{/${color}}`;
  }

  private getColumnColor(column: string): string {
    const colors: Record<string, string> = {
      'To Do': 'gray',
      'In Progress': 'yellow',
      Review: 'cyan',
      Done: 'green',
      Blocked: 'red',
    };
    return colors[column] || 'white';
  }

  private truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  private setupKeybindings() {
    // Quit
    this.screen.key(['escape', 'q', 'C-c'], () => {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
      return process.exit(0);
    });

    // Refresh
    this.screen.key(['r'], async () => {
      await this.render();
    });

    // Help
    this.screen.key(['?'], () => {
      this.showHelp();
    });
  }

  private showHelp() {
    const helpBox = blessed.box({
      top: 'center',
      left: 'center',
      width: 60,
      height: 15,
      border: {
        type: 'line',
      },
      label: ' Help ',
      tags: true,
      style: {
        border: {
          fg: 'cyan',
        },
      },
      content: `
{bold}{cyan-fg}Backmark Kanban Board - Help{/cyan-fg}{/bold}

{bold}Keyboard Shortcuts:{/bold}

  {bold}r{/bold}        Refresh board manually
  {bold}q / ESC{/bold}  Quit
  {bold}?{/bold}        Show this help

{bold}Features:{/bold}

  • Auto-refresh every 3 seconds
  • Read-only view
  • Use CLI commands to modify tasks

{center}{gray-fg}Press any key to close{/gray-fg}{/center}
      `,
    });

    this.screen.append(helpBox);
    helpBox.focus();

    this.screen.onceKey(['escape', 'enter', 'space'] as any, () => {
      helpBox.destroy();
      this.screen.render();
    });

    this.screen.render();
  }

  startAutoRefresh(intervalSeconds: number = 3) {
    this.refreshInterval = setInterval(async () => {
      await this.render();
    }, intervalSeconds * 1000);
  }

  async start() {
    await this.render();
    this.startAutoRefresh(3);
    this.screen.render();
  }
}
