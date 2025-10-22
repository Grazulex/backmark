import chalk from 'chalk';
import Table from 'cli-table3';
import { Backlog } from '../core/backlog';
import { searchTasks } from '../utils/fuzzy-search';
import {
  colorizeStatus,
  colorizePriority,
  formatTaskId,
  formatKeywords,
  truncate,
  icons,
} from '../utils/colors';
import { logger } from '../utils/logger';
import type { TaskFilters } from '../types';

interface SearchOptions {
  status?: string;
  priority?: string;
  assignee?: string;
  milestone?: string;
  keyword?: string;
  label?: string;
}

export async function searchCommand(query: string, options: SearchOptions) {
  try {
    const backlog = await Backlog.load();

    // Get all tasks (or filtered tasks)
    const filters: TaskFilters = {
      status: options.status,
      priority: options.priority as any,
      assignee: options.assignee,
      milestone: options.milestone,
      keyword: options.keyword,
      label: options.label,
    };

    const allTasks = await backlog.getTasks(filters);

    // Fuzzy search
    const results = searchTasks(allTasks, query, {
      threshold: 0.3,
      maxResults: 50,
    });

    if (results.length === 0) {
      console.log(chalk.yellow(`\n🔍 No results found for: "${query}"\n`));
      return;
    }

    // Display search info
    console.log();
    console.log(chalk.bold.cyan(`🔍 Search results for: "${chalk.white(query)}"`));

    if (Object.values(options).some((v) => v)) {
      const activeFilters: string[] = [];
      if (options.status) activeFilters.push(`status=${chalk.cyan(options.status)}`);
      if (options.priority) activeFilters.push(`priority=${chalk.cyan(options.priority)}`);
      if (options.assignee) activeFilters.push(`assignee=${chalk.cyan(options.assignee)}`);
      if (options.milestone) activeFilters.push(`milestone=${chalk.cyan(options.milestone)}`);
      if (options.keyword) activeFilters.push(`keyword=${chalk.cyan(options.keyword)}`);
      if (options.label) activeFilters.push(`label=${chalk.cyan(options.label)}`);

      console.log(chalk.gray('Filters: ') + activeFilters.join(', '));
    }

    console.log();

    // Create table
    const table = new Table({
      head: [
        chalk.bold.cyan('ID'),
        chalk.bold.cyan('Title'),
        chalk.bold.cyan('Status'),
        chalk.bold.cyan('Priority'),
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

    // Add results to table with highlighting
    for (const task of results) {
      // Highlight matching text in title
      const titleLower = task.title.toLowerCase();
      const queryLower = query.toLowerCase();
      let displayTitle = task.title;

      if (titleLower.includes(queryLower)) {
        const index = titleLower.indexOf(queryLower);
        const before = task.title.substring(0, index);
        const match = task.title.substring(index, index + query.length);
        const after = task.title.substring(index + query.length);
        displayTitle = before + chalk.bgYellow.black(match) + after;
      }

      const row = [
        formatTaskId(task.id, true),
        truncate(displayTitle, 35),
        colorizeStatus(task.status),
        colorizePriority(task.priority),
        formatKeywords(task.keywords, 15),
        task.milestone ? chalk.yellow(task.milestone) : chalk.gray('—'),
      ];

      table.push(row);
    }

    console.log(table.toString());

    // Summary
    console.log();
    console.log(chalk.bold.cyan('─'.repeat(70)));
    console.log(
      chalk.bold(`${icons.task} Found: ${chalk.cyan(results.length)} task(s)`),
      '\n'
    );
  } catch (error) {
    logger.error((error as Error).message);
    process.exit(1);
  }
}
