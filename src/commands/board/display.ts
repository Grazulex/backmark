import chalk from 'chalk';
import Table from 'cli-table3';
import { Backlog } from '../../core/backlog';
import type { ProjectConfig } from '../../types';
import {
  colorizePriority,
  colorizeStatus,
  formatKeywords,
  formatTaskId,
  icons,
} from '../../utils/colors';
import { logger } from '../../utils/logger';

interface DisplayBoardOptions {
  watch?: boolean;
}

export async function displayBoard(options: DisplayBoardOptions = {}) {
  try {
    const backlog = await Backlog.load();

    async function render() {
      const columns = backlog.getConfig<string[]>('board.columns');

      // Clear screen
      if (options.watch) {
        console.clear();
      }

      // Header
      const project = backlog.getConfig<ProjectConfig>('project');
      console.log(`\n${chalk.bold.cyan('═'.repeat(100))}`);
      console.log(
        chalk.bold.blue(`${icons.task} Backmark Kanban Board`) +
          chalk.gray(' │ ') +
          chalk.white(project?.name || 'Unknown Project')
      );
      console.log(`${chalk.bold.cyan('═'.repeat(100))}\n`);

      // Get max number of tasks in any column
      const columnTasks = await Promise.all(columns.map((col) => backlog.getTasksByStatus(col)));

      // Create table
      const table = new Table({
        head: columns.map((col, i) => {
          return chalk.bold(col) + chalk.gray(` (${columnTasks[i].length})`);
        }),
        style: {
          head: [],
          border: ['gray'],
        },
        colWidths: columns.map(() => Math.floor(100 / columns.length)),
        wordWrap: true,
        chars: {
          top: '─',
          'top-mid': '┬',
          'top-left': '┌',
          'top-right': '┐',
          bottom: '─',
          'bottom-mid': '┴',
          'bottom-left': '└',
          'bottom-right': '┘',
          left: '│',
          'left-mid': '├',
          mid: '─',
          'mid-mid': '┼',
          right: '│',
          'right-mid': '┤',
          middle: '│',
        },
      });

      const maxTasks = Math.max(...columnTasks.map((tasks) => tasks.length), 1);

      // Build rows
      for (let i = 0; i < maxTasks; i++) {
        const row = columns.map((_, colIndex) => {
          const tasks = columnTasks[colIndex];
          const task = tasks[i];

          if (!task) return '';

          // Format task card
          const lines: string[] = [];
          lines.push(`${formatTaskId(task.id, true)} ${colorizePriority(task.priority)}`);
          lines.push(chalk.white(truncate(task.title, 20)));

          if (task.assignees.length > 0) {
            const assignee = task.assignees[0];
            const isAI =
              assignee.toLowerCase().includes('ai') || assignee.toLowerCase().includes('claude');
            const icon = isAI ? '🤖' : '👤';
            const color = isAI ? chalk.magenta : chalk.white;
            lines.push(icon + color(truncate(assignee, 15)));
          }

          if (task.milestone) {
            lines.push(chalk.yellow(`🎯 ${truncate(task.milestone, 12)}`));
          }

          if (task.keywords.length > 0) {
            lines.push(formatKeywords(task.keywords, 18));
          }

          if (task.acceptance_criteria.length > 0) {
            const checked = task.acceptance_criteria.filter((c) => c.checked).length;
            lines.push(chalk.gray(`✓ ${checked}/${task.acceptance_criteria.length}`));
          }

          return lines.join('\n');
        });

        table.push(row);
      }

      console.log(table.toString());

      // Footer stats
      console.log(`\n${chalk.bold.cyan('─'.repeat(100))}`);

      const allTasks = await backlog.getTasks();
      const statusCounts = columnTasks.map((tasks, i) => {
        return `${colorizeStatus(columns[i])}: ${chalk.bold(tasks.length)}`;
      });

      console.log(chalk.bold('Summary: '), statusCounts.join('  |  '));

      const aiTasks = allTasks.filter((t) =>
        t.assignees.some(
          (a) =>
            a.toLowerCase().includes('ai') ||
            a.toLowerCase().includes('claude') ||
            a.toLowerCase().includes('gpt')
        )
      );

      if (aiTasks.length > 0) {
        console.log(chalk.magenta(`${icons.ai} AI tasks: ${chalk.bold(aiTasks.length)}`));
      }

      console.log(chalk.bold.cyan('─'.repeat(100)));

      if (options.watch) {
        console.log(
          chalk.gray(
            `\nAuto-refresh: 3s  |  Press Ctrl+C to quit  |  Last update: ${new Date().toLocaleTimeString()}`
          )
        );
      }

      console.log();
    }

    // Initial render
    await render();

    // Watch mode
    if (options.watch) {
      setInterval(async () => {
        await render();
      }, 3000);
    }
  } catch (error) {
    logger.error((error as Error).message);
    process.exit(1);
  }
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}
