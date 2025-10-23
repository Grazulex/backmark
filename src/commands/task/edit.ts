import chalk from 'chalk';
import ora from 'ora';
import { Backlog } from '../../core/backlog';
import type { Task, TaskPriority, TaskStatus } from '../../types';
import { colorizePriority, colorizeStatus, formatTaskId, icons } from '../../utils/colors';
import { logger } from '../../utils/logger';

interface EditTaskOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  milestone?: string;
  start?: string;
  end?: string;
  release?: string;
  addKeyword?: string;
  removeKeyword?: string;
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

    // Keywords management
    if (options.addKeyword) {
      const keywords = [...task.keywords, ...options.addKeyword.split(',').map((k) => k.trim())];
      updates.keywords = [...new Set(keywords)]; // Remove duplicates
    }
    if (options.removeKeyword) {
      const toRemove = options.removeKeyword.split(',').map((k) => k.trim());
      updates.keywords = task.keywords.filter((k) => !toRemove.includes(k));
    }

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
    if (options.addKeyword || options.removeKeyword) {
      console.log(
        `  ${icons.keyword} Keywords: ${updatedTask.keywords.map((k) => chalk.blue(`#${k}`)).join(' ')}`
      );
    }
    if (options.addLabel || options.removeLabel) {
      console.log(`     Labels: ${updatedTask.labels.map((l) => chalk.cyan(`[${l}]`)).join(' ')}`);
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

export async function closeTask(taskId: string) {
  const spinner = ora('Closing task...').start();
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      spinner.fail('Invalid task ID');
      process.exit(1);
    }

    await backlog.updateTask(id, { status: 'Done' }, 'user');

    spinner.succeed(chalk.green('Task closed successfully!'));
    console.log(chalk.green(`\n${icons.done} Task ${formatTaskId(id, true)} marked as Done\n`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to close task'));
    logger.error((error as Error).message);
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}
