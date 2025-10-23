import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { Backlog } from '../../core/backlog';
import type { Task, TaskPriority, TaskStatus } from '../../types';
import { colorizePriority, colorizeStatus, formatTaskId, icons } from '../../utils/colors';
import { logger } from '../../utils/logger';
import {
	DEFAULT_VALIDATION_CONFIG,
	TaskValidator,
	formatSuggestions,
	formatValidationResult,
	formatWarnings,
	type ValidationConfig,
} from '../../utils/validators';

interface EditTaskOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  milestone?: string;
  start?: string;
  end?: string;
  release?: string;
  addLabel?: string;
  removeLabel?: string;
  addDependency?: string;
  removeDependency?: string;
}

export async function editTask(taskId: string, options: EditTaskOptions) {
  const spinner = ora('Updating task...').start();
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      spinner.fail('Invalid task ID');
      process.exit(1);
    }

    const task = await backlog.getTaskById(id);
    if (!task) {
      spinner.fail(`Task ${formatTaskId(id, true)} not found`);
      process.exit(1);
    }

    const updates: Partial<Task> = {};

    // Simple field updates
    if (options.status) updates.status = options.status;
    if (options.priority) updates.priority = options.priority;
    if (options.milestone) updates.milestone = options.milestone;
    if (options.start) updates.start_date = options.start;
    if (options.end) updates.end_date = options.end;
    if (options.release) updates.release_date = options.release;

    // Labels management
    if (options.addLabel) {
      const labels = [...task.labels, ...options.addLabel.split(',').map((l) => l.trim())];
      updates.labels = [...new Set(labels)]; // Remove duplicates
    }
    if (options.removeLabel) {
      const toRemove = options.removeLabel.split(',').map((l) => l.trim());
      updates.labels = task.labels.filter((l) => !toRemove.includes(l));
    }

    // Dependencies management
    if (options.addDependency) {
      const deps = options.addDependency.split(',').map((d) => Number.parseInt(d.trim(), 10));
      const newDeps = [...task.dependencies, ...deps];
      updates.dependencies = [...new Set(newDeps)]; // Remove duplicates
    }
    if (options.removeDependency) {
      const toRemove = options.removeDependency
        .split(',')
        .map((d) => Number.parseInt(d.trim(), 10));
      updates.dependencies = task.dependencies.filter((d) => !toRemove.includes(d));
    }

    if (Object.keys(updates).length === 0) {
      spinner.warn('No changes specified');
      return;
    }

    const updatedTask = await backlog.updateTask(id, updates, 'user');

    spinner.succeed(chalk.green('Task updated successfully!'));

    // Display changes
    console.log(`\n${chalk.bold.cyan('Updated:')}`);
    if (options.status) {
      console.log(`  ${icons.status} Status: ${colorizeStatus(updatedTask.status)}`);
    }
    if (options.priority) {
      console.log(`  ${icons.priority} Priority: ${colorizePriority(updatedTask.priority)}`);
    }
    if (options.milestone) {
      console.log(`  ${icons.milestone} Milestone: ${chalk.yellow(updatedTask.milestone)}`);
    }
    if (options.addLabel || options.removeLabel) {
      console.log(
        `  ${icons.label} Labels: ${updatedTask.labels.map((l) => chalk.cyan(`[${l}]`)).join(' ')}`
      );
    }
    if (options.addDependency || options.removeDependency) {
      console.log(
        `  ${icons.dependency} Dependencies: ${updatedTask.dependencies.map((d) => formatTaskId(d, true)).join(', ')}`
      );
    }

    console.log();
  } catch (error) {
    spinner.fail(chalk.red('Failed to update task'));
    logger.error((error as Error).message);
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}

export async function assignTask(taskId: string, assignees: string) {
  const spinner = ora('Assigning task...').start();
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      spinner.fail('Invalid task ID');
      process.exit(1);
    }

    const assigneeList = assignees.split(',').map((a) => a.trim());
    const _updatedTask = await backlog.updateTask(id, { assignees: assigneeList }, 'user');

    spinner.succeed(chalk.green('Task assigned successfully!'));
    console.log(
      `\n${icons.user} Assignees: `,
      assigneeList
        .map((a) =>
          a.toLowerCase().includes('ai') || a.toLowerCase().includes('claude')
            ? chalk.magenta(a)
            : chalk.white(a)
        )
        .join(', '),
      '\n'
    );
  } catch (error) {
    spinner.fail(chalk.red('Failed to assign task'));
    logger.error((error as Error).message);
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}

interface CloseTaskOptions {
	force?: boolean;
}

export async function closeTask(taskId: string, options?: CloseTaskOptions) {
	const spinner = ora('Validating task...').start();
	let backlog: Backlog | null = null;

	try {
		backlog = await Backlog.load();
		const id = Number.parseInt(taskId, 10);

		if (Number.isNaN(id)) {
			spinner.fail('Invalid task ID');
			process.exit(1);
		}

		const task = await backlog.getTaskById(id);
		if (!task) {
			spinner.fail(`Task ${formatTaskId(id, true)} not found`);
			process.exit(1);
		}

		// Get validation config from backlog config
		const config = backlog.getConfig();
		const validationConfig: ValidationConfig = {
			...DEFAULT_VALIDATION_CONFIG,
			...(config.validations?.close || {}),
		};

		// Create validator
		const validator = new TaskValidator(validationConfig);

		// Get all tasks for validation
		const allTasks = await backlog.getTasks({});

		// Validate close
		const validationResult = validator.validateClose(task, allTasks, options?.force || false);

		spinner.stop();

		// If validation failed
		if (!validationResult.valid) {
			const errorMessage = formatValidationResult(validationResult, task.id, task.title);
			console.log(errorMessage);
			process.exit(1);
		}

		// Show warnings if any
		if (validationResult.warnings.length > 0) {
			console.log(formatWarnings(validationResult.warnings));

			// Ask for confirmation
			const { confirm } = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'confirm',
					message: 'Continue closing this task?',
					default: true,
				},
			]);

			if (!confirm) {
				console.log(chalk.yellow('\nTask close cancelled'));
				return;
			}
		}

		// Close the task
		spinner.start('Closing task...');
		await backlog.updateTask(id, { status: 'Done' }, 'user');
		spinner.succeed(chalk.green('Task closed successfully!'));

		console.log(
			chalk.green(
				`\n${icons.done} Task ${formatTaskId(id, true)} marked as Done${options?.force ? ' (forced)' : ''}\n`,
			),
		);

		// Get and show suggestions
		const suggestions = validator.getSuggestionsAfterClose(task, allTasks);
		if (suggestions.length > 0) {
			console.log(formatSuggestions(suggestions));
		}
	} catch (error) {
		spinner.fail(chalk.red('Failed to close task'));
		logger.error((error as Error).message);
		process.exit(1);
	} finally {
		await backlog?.close();
	}
}
