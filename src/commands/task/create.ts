import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { Backlog } from '../../core/backlog';
import { ValidationError } from '../../core/validator';
import type { TaskPriority } from '../../types';
import {
  colorizePriority,
  colorizeStatus,
  formatDate,
  formatLabels,
  formatTaskId,
  icons,
} from '../../utils/colors';
import { Errors } from '../../utils/errors';
import { logger } from '../../utils/logger';
import { applyTemplate, loadTemplate } from '../../utils/templates';

interface CreateTaskOptions {
  description?: string;
  status?: string;
  priority?: TaskPriority;
  assignees?: string;
  labels?: string;
  milestone?: string;
  start?: string;
  end?: string;
  release?: string;
  parent?: number;
  dependsOn?: string;
  template?: string;
}

export async function createTask(title: string, options: CreateTaskOptions) {
  const spinner = ora('Creating task...').start();

  let backlog: Backlog | null = null;
  try {
    backlog = await Backlog.load();

    // Load template if specified
    let description = options.description;
    let templateMetadata: Record<string, unknown> = {};

    if (options.template) {
      spinner.text = `Loading template '${options.template}'...`;
      try {
        const template = await loadTemplate(options.template, backlog.getBacklogPath());
        const applied = applyTemplate(template, {
          status: options.status,
          priority: options.priority,
          labels: options.labels?.split(',').map((l) => l.trim()),
          milestone: options.milestone,
        });

        // Use template description if no description provided
        if (!description) {
          description = applied.description;
        }

        // Use template metadata (will be merged with user options)
        templateMetadata = applied.metadata;

        spinner.succeed(chalk.green(`✓ Template '${options.template}' loaded`));
        spinner.start('Creating task...');
      } catch (error) {
        spinner.fail(chalk.red(`Failed to load template '${options.template}'`));
        console.error(chalk.yellow((error as Error).message));
        console.log(
          chalk.gray('\nTip: Use'),
          chalk.cyan('backmark task templates'),
          chalk.gray('to list available templates')
        );
        process.exit(1);
      }
    }

    // Interactive prompt for description if not provided and no template
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
    // User options override template metadata
    const assignees = options.assignees ? options.assignees.split(',').map((a) => a.trim()) : [];
    const labels = options.labels
      ? options.labels.split(',').map((l) => l.trim())
      : (templateMetadata.labels as string[]) || [];
    const dependencies = options.dependsOn
      ? options.dependsOn.split(',').map((d) => Number.parseInt(d.trim(), 10))
      : [];

    // Validate parent task if specified
    if (options.parent) {
      const parentTask = await backlog.getTaskById(options.parent);
      if (!parentTask) {
        spinner.fail();
        console.error(Errors.parentTaskNotFound(options.parent));
        process.exit(1);
      }
    }

    const task = await backlog.createTask({
      title,
      description,
      status: options.status || (templateMetadata.status as string),
      priority: options.priority || (templateMetadata.priority as TaskPriority),
      assignees,
      labels,
      milestone: options.milestone || (templateMetadata.milestone as string),
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

    if (task.labels.length > 0) {
      console.log(`${icons.label} ${chalk.bold('Labels:      ')}`, formatLabels(task.labels));
    }

    // Dates
    console.log(`\n${chalk.bold.gray('Dates:')}`);
    console.log(
      `   ${chalk.bold('Created:     ')}`,
      formatDate(task.created_date, 'long', backlog)
    );
    if (task.start_date) {
      console.log(
        `${icons.date} ${chalk.bold('Start:       ')}`,
        formatDate(task.start_date, 'short', backlog)
      );
    }
    if (task.end_date) {
      console.log(
        `${icons.date} ${chalk.bold('End:         ')}`,
        formatDate(task.end_date, 'short', backlog)
      );
    }
    if (task.release_date) {
      console.log(
        `${icons.date} ${chalk.bold('Release:     ')}`,
        formatDate(task.release_date, 'short', backlog)
      );
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
    spinner.fail();

    // Handle validation errors with custom formatting
    if (error instanceof ValidationError) {
      console.error(chalk.red.bold(`\n✖ ${error.message}\n`));
      if (error.suggestions.length > 0) {
        console.error(error.suggestions.join('\n'));
        console.error('');
      }
    } else {
      console.error(Errors.commandFailed('create task', error as Error));
    }

    process.exit(1);
  } finally {
    await backlog?.close();
  }
}
