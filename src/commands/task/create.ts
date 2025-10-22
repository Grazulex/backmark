import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { Backlog } from '../../core/backlog';
import type { TaskPriority } from '../../types';
import {
  colorizePriority,
  colorizeStatus,
  formatDate,
  formatKeywords,
  formatLabels,
  formatTaskId,
  icons,
} from '../../utils/colors';
import { logger } from '../../utils/logger';

interface CreateTaskOptions {
  description?: string;
  status?: string;
  priority?: TaskPriority;
  assignees?: string;
  labels?: string;
  keywords?: string;
  milestone?: string;
  start?: string;
  end?: string;
  release?: string;
  parent?: number;
  dependsOn?: string;
}

export async function createTask(title: string, options: CreateTaskOptions) {
  const spinner = ora('Creating task...').start();

  try {
    const backlog = await Backlog.load();

    // Interactive prompt for description if not provided
    let description = options.description;
    if (!description) {
      spinner.stop();
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'description',
          message: 'Task description (optional):',
          default: '',
        },
      ]);
      description = answers.description;
      spinner.start('Creating task...');
    }

    // Parse arrays from comma-separated strings
    const assignees = options.assignees ? options.assignees.split(',').map((a) => a.trim()) : [];
    const labels = options.labels ? options.labels.split(',').map((l) => l.trim()) : [];
    const keywords = options.keywords ? options.keywords.split(',').map((k) => k.trim()) : [];
    const dependencies = options.dependsOn
      ? options.dependsOn.split(',').map((d) => Number.parseInt(d.trim(), 10))
      : [];

    // Validate parent task if specified
    if (options.parent) {
      const parentTask = await backlog.getTaskById(options.parent);
      if (!parentTask) {
        spinner.fail(chalk.red(`Parent task #${options.parent} not found`));
        process.exit(1);
      }
    }

    const task = await backlog.createTask({
      title,
      description,
      status: options.status,
      priority: options.priority,
      assignees,
      labels,
      keywords,
      milestone: options.milestone,
      start_date: options.start,
      end_date: options.end,
      release_date: options.release,
      parent_task: options.parent,
      dependencies,
    });

    spinner.succeed(chalk.green('Task created successfully!'));

    // Display task info with colors and icons
    console.log(`\n${chalk.bold.cyan('─'.repeat(70))}`);
    console.log(
      chalk.bold.white('Task Created:'),
      formatTaskId(task.id, true),
      chalk.white(task.title)
    );
    console.log(chalk.bold.cyan('─'.repeat(70)));

    console.log(`${icons.status} ${chalk.bold('Status:      ')}`, colorizeStatus(task.status));
    console.log(
      `${icons.priority} ${chalk.bold('Priority:    ')}`,
      colorizePriority(task.priority)
    );

    if (task.milestone) {
      console.log(
        `${icons.milestone} ${chalk.bold('Milestone:   ')}`,
        chalk.yellow(task.milestone)
      );
    }

    if (task.assignees.length > 0) {
      console.log(
        `${icons.user} ${chalk.bold('Assignees:   ')}`,
        task.assignees
          .map((a) =>
            a.toLowerCase().includes('claude') || a.toLowerCase().includes('ai')
              ? chalk.magenta(a)
              : chalk.white(a)
          )
          .join(', ')
      );
    }

    if (task.keywords.length > 0) {
      console.log(`${icons.keyword} ${chalk.bold('Keywords:    ')}`, formatKeywords(task.keywords));
    }

    if (task.labels.length > 0) {
      console.log(`   ${chalk.bold('Labels:      ')}`, formatLabels(task.labels));
    }

    // Dates
    console.log(`\n${chalk.bold.gray('Dates:')}`);
    console.log(`   ${chalk.bold('Created:     ')}`, formatDate(task.created_date, 'long'));
    if (task.start_date) {
      console.log(`${icons.date} ${chalk.bold('Start:       ')}`, formatDate(task.start_date));
    }
    if (task.end_date) {
      console.log(`${icons.date} ${chalk.bold('End:         ')}`, formatDate(task.end_date));
    }
    if (task.release_date) {
      console.log(`${icons.date} ${chalk.bold('Release:     ')}`, formatDate(task.release_date));
    }

    // Hierarchy
    if (task.parent_task) {
      console.log(
        `\n${icons.dependency} ${chalk.bold('Parent Task: ')}`,
        formatTaskId(task.parent_task, true)
      );
    }

    if (task.dependencies.length > 0) {
      console.log(
        `${icons.dependency} ${chalk.bold('Depends on:  ')}`,
        task.dependencies.map((d) => formatTaskId(d, true)).join(', ')
      );
    }

    console.log(chalk.bold.cyan('─'.repeat(70)));
    console.log(chalk.dim('File:'), chalk.cyan(task.filePath));
    console.log(`${chalk.bold.cyan('─'.repeat(70))}\n`);

    // Helpful next steps
    if (
      task.assignees.some(
        (a) => a.toLowerCase().includes('ai') || a.toLowerCase().includes('claude')
      )
    ) {
      console.log(chalk.bold.magenta(`${icons.ai} AI Workflow - Next Steps:`));
      console.log(
        chalk.magenta(`  backmark task ai-plan ${task.id} "Your implementation plan..."`)
      );
      console.log(chalk.magenta(`  backmark task view ${task.id} --ai-all\n`));
    }
  } catch (error) {
    spinner.fail(chalk.red('Failed to create task'));
    logger.error((error as Error).message);
    process.exit(1);
  }
}
