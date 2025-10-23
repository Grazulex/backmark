import chalk from 'chalk';
import Table from 'cli-table3';
import { Backlog } from '../../core/backlog';
import type { TaskFilters, TaskPriority } from '../../types';
import {
  colorizePriority,
  colorizeStatus,
  formatAssignees,
  formatKeywords,
  formatTaskId,
  icons,
  truncate,
} from '../../utils/colors';
import { logger } from '../../utils/logger';

interface ListTasksOptions {
  status?: string;
  priority?: string;
  assignee?: string;
  label?: string;
  keyword?: string;
  milestone?: string;
  parent?: number;
}

export async function listTasks(options: ListTasksOptions) {
  let backlog: Backlog | null = null;
  try {
    backlog = await Backlog.load();

    // Build filters
    const filters: TaskFilters = {
      status: options.status,
      priority: options.priority as TaskPriority | undefined,
      assignee: options.assignee,
      label: options.label,
      keyword: options.keyword,
      milestone: options.milestone,
      parent: options.parent,
    };

    const tasks = await backlog.getTasks(filters);

    if (tasks.length === 0) {
      console.log(chalk.yellow('\n📭 No tasks found.'));
      console.log(chalk.gray('Create your first task with:'));
      console.log(chalk.cyan('  backmark task create "My first task"\n'));
      return;
    }

    // Display filter info if any
    const activeFilters: string[] = [];
    if (options.status) activeFilters.push(`status=${chalk.cyan(options.status)}`);
    if (options.priority) activeFilters.push(`priority=${chalk.cyan(options.priority)}`);
    if (options.assignee) activeFilters.push(`assignee=${chalk.cyan(options.assignee)}`);
    if (options.keyword) activeFilters.push(`keyword=${chalk.cyan(options.keyword)}`);
    if (options.milestone) activeFilters.push(`milestone=${chalk.cyan(options.milestone)}`);
    if (options.parent !== undefined) activeFilters.push(`parent=${chalk.cyan(options.parent)}`);

    console.log();
    if (activeFilters.length > 0) {
      console.log(chalk.bold('🔍 Filters: ') + activeFilters.join(', '));
    }

    // Create table
    const table = new Table({
      head: [
        chalk.bold.cyan('ID'),
        chalk.bold.cyan('Title'),
        chalk.bold.cyan('Status'),
        chalk.bold.cyan('Priority'),
        chalk.bold.cyan('Assignees'),
        chalk.bold.cyan('Keywords'),
        chalk.bold.cyan('Milestone'),
      ],
      style: {
        head: [],
        border: ['gray'],
      },
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

    // Add tasks to table
    for (const task of tasks) {
      const row = [
        formatTaskId(task.id, true),
        truncate(task.title, 30),
        colorizeStatus(task.status),
        colorizePriority(task.priority),
        formatAssignees(task.assignees).substring(0, 15),
        formatKeywords(task.keywords, 15),
        task.milestone ? chalk.yellow(task.milestone) : chalk.gray('—'),
      ];

      table.push(row);
    }

    console.log(table.toString());

    // Summary
    console.log();
    console.log(chalk.bold.cyan('─'.repeat(70)));

    // Count by status
    const statusCounts = tasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const statusSummary = Object.entries(statusCounts)
      .map(([status, count]) => `${colorizeStatus(status)}: ${chalk.bold(count)}`)
      .join('  |  ');

    console.log(chalk.bold('Summary: '), statusSummary);
    console.log(chalk.bold.cyan('─'.repeat(70)));
    console.log(chalk.bold(`${icons.task} Total: ${chalk.cyan(tasks.length)} task(s)`), '\n');

    // AI tasks info
    const aiTasks = tasks.filter((t) =>
      t.assignees.some(
        (a) =>
          a.toLowerCase().includes('ai') ||
          a.toLowerCase().includes('claude') ||
          a.toLowerCase().includes('gpt')
      )
    );

    if (aiTasks.length > 0) {
      console.log(chalk.magenta(`${icons.ai} AI-assigned tasks: ${chalk.bold(aiTasks.length)}`));
      console.log(
        chalk.gray('  View AI details: ') + chalk.cyan('backmark task view <id> --ai-all\n')
      );
    }
  } catch (error) {
    logger.error((error as Error).message);
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}
