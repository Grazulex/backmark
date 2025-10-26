import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import chalk from 'chalk';
import { dump } from 'js-yaml';
import ora from 'ora';
import { Backlog } from '../core/backlog';
import type { Config, TaskPriority } from '../types';
import { icons } from '../utils/colors';
import { Errors } from '../utils/errors';

/**
 * List all valid statuses
 */
export async function listStatuses() {
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const statuses = backlog.getValidStatuses();

    console.log(chalk.bold.cyan('\n📋 Valid Statuses:\n'));
    for (const status of statuses) {
      console.log(`  ${chalk.green('•')} ${chalk.cyan(status)}`);
    }
    console.log(chalk.dim(`\nTotal: ${statuses.length} status(es)\n`));
  } catch (error) {
    console.error(Errors.commandFailed('list statuses', error as Error));
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}

/**
 * List all valid priorities
 */
export async function listPriorities() {
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const priorities = backlog.getValidPriorities();

    console.log(chalk.bold.cyan('\n⚡ Valid Priorities:\n'));
    for (const priority of priorities) {
      console.log(`  ${chalk.green('•')} ${chalk.cyan(priority)}`);
    }
    console.log(
      chalk.dim(`\nTotal: ${priorities.length} priorit${priorities.length > 1 ? 'ies' : 'y'}\n`)
    );
  } catch (error) {
    console.error(Errors.commandFailed('list priorities', error as Error));
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}

/**
 * Add a new status to the config
 */
export async function addStatus(status: string) {
  const spinner = ora(`Adding status "${status}"...`).start();
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const config = backlog.getConfig() as Config;

    // Check if status already exists
    if (config.board.columns.includes(status)) {
      spinner.fail(chalk.yellow(`Status "${status}" already exists`));
      process.exit(0);
    }

    // Add the new status
    config.board.columns.push(status);

    // Save the updated config
    const configPath = path.join(process.cwd(), 'backlog', 'config.yml');
    const configYaml = dump(config, { lineWidth: -1 });
    await fs.writeFile(configPath, configYaml, 'utf-8');

    spinner.succeed(chalk.green(`Status "${chalk.cyan(status)}" added successfully!`));

    console.log(chalk.dim('\nCurrent statuses:'));
    for (const s of config.board.columns) {
      console.log(`  ${chalk.green('•')} ${s === status ? chalk.cyan.bold(s) : chalk.gray(s)}`);
    }
    console.log('');
  } catch (error) {
    spinner.fail();
    console.error(Errors.commandFailed('add status', error as Error));
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}

/**
 * Remove a status from the config
 */
export async function removeStatus(status: string) {
  const spinner = ora(`Removing status "${status}"...`).start();
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const config = backlog.getConfig() as Config;

    // Check if status exists
    if (!config.board.columns.includes(status)) {
      spinner.fail(chalk.yellow(`Status "${status}" does not exist`));
      process.exit(0);
    }

    // Check if there are tasks with this status
    const tasks = await backlog.getTasks({ status });
    if (tasks.length > 0) {
      spinner.warn(chalk.yellow(`Cannot remove status "${status}"`));
      console.log(
        chalk.red(
          `\n⚠️  There ${tasks.length === 1 ? 'is' : 'are'} ${chalk.bold(tasks.length)} task${tasks.length > 1 ? 's' : ''} with this status.\n`
        )
      );
      console.log(chalk.dim('Please update or remove these tasks first:'));
      for (const task of tasks.slice(0, 5)) {
        console.log(`  ${chalk.green('•')} #${task.id} - ${task.title}`);
      }
      if (tasks.length > 5) {
        console.log(chalk.dim(`  ... and ${tasks.length - 5} more`));
      }
      console.log('');
      process.exit(1);
    }

    // Remove the status
    config.board.columns = config.board.columns.filter((s) => s !== status);

    // Save the updated config
    const configPath = path.join(process.cwd(), 'backlog', 'config.yml');
    const configYaml = dump(config, { lineWidth: -1 });
    await fs.writeFile(configPath, configYaml, 'utf-8');

    spinner.succeed(chalk.green(`Status "${chalk.cyan(status)}" removed successfully!`));

    console.log(chalk.dim('\nRemaining statuses:'));
    for (const s of config.board.columns) {
      console.log(`  ${chalk.green('•')} ${chalk.gray(s)}`);
    }
    console.log('');
  } catch (error) {
    spinner.fail();
    console.error(Errors.commandFailed('remove status', error as Error));
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}

/**
 * Add a new priority to the config
 */
export async function addPriority(priority: string) {
  const spinner = ora(`Adding priority "${priority}"...`).start();
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const config = backlog.getConfig() as Config;

    // Check if priority already exists
    if (config.board.priorities.includes(priority)) {
      spinner.fail(chalk.yellow(`Priority "${priority}" already exists`));
      process.exit(0);
    }

    // Add the new priority
    config.board.priorities.push(priority);

    // Save the updated config
    const configPath = path.join(process.cwd(), 'backlog', 'config.yml');
    const configYaml = dump(config, { lineWidth: -1 });
    await fs.writeFile(configPath, configYaml, 'utf-8');

    spinner.succeed(chalk.green(`Priority "${chalk.cyan(priority)}" added successfully!`));

    console.log(chalk.dim('\nCurrent priorities:'));
    for (const p of config.board.priorities) {
      console.log(`  ${chalk.green('•')} ${p === priority ? chalk.cyan.bold(p) : chalk.gray(p)}`);
    }
    console.log('');
  } catch (error) {
    spinner.fail();
    console.error(Errors.commandFailed('add priority', error as Error));
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}

/**
 * Remove a priority from the config
 */
export async function removePriority(priority: string) {
  const spinner = ora(`Removing priority "${priority}"...`).start();
  let backlog: Backlog | null = null;

  try {
    backlog = await Backlog.load();
    const config = backlog.getConfig() as Config;

    // Check if priority exists
    if (!config.board.priorities.includes(priority)) {
      spinner.fail(chalk.yellow(`Priority "${priority}" does not exist`));
      process.exit(0);
    }

    // Check if there are tasks with this priority
    const tasks = await backlog.getTasks({ priority: priority as TaskPriority });
    if (tasks.length > 0) {
      spinner.warn(chalk.yellow(`Cannot remove priority "${priority}"`));
      console.log(
        chalk.red(
          `\n⚠️  There ${tasks.length === 1 ? 'is' : 'are'} ${chalk.bold(tasks.length)} task${tasks.length > 1 ? 's' : ''} with this priority.\n`
        )
      );
      console.log(chalk.dim('Please update or remove these tasks first:'));
      for (const task of tasks.slice(0, 5)) {
        console.log(`  ${chalk.green('•')} #${task.id} - ${task.title}`);
      }
      if (tasks.length > 5) {
        console.log(chalk.dim(`  ... and ${tasks.length - 5} more`));
      }
      console.log('');
      process.exit(1);
    }

    // Remove the priority
    config.board.priorities = config.board.priorities.filter((p) => p !== priority);

    // Save the updated config
    const configPath = path.join(process.cwd(), 'backlog', 'config.yml');
    const configYaml = dump(config, { lineWidth: -1 });
    await fs.writeFile(configPath, configYaml, 'utf-8');

    spinner.succeed(chalk.green(`Priority "${chalk.cyan(priority)}" removed successfully!`));

    console.log(chalk.dim('\nRemaining priorities:'));
    for (const p of config.board.priorities) {
      console.log(`  ${chalk.green('•')} ${chalk.gray(p)}`);
    }
    console.log('');
  } catch (error) {
    spinner.fail();
    console.error(Errors.commandFailed('remove priority', error as Error));
    process.exit(1);
  } finally {
    await backlog?.close();
  }
}
