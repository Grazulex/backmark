import chalk from 'chalk';
import ora from 'ora';
import { Backlog } from '../../core/backlog';
import { formatTaskId, icons } from '../../utils/colors';
import { logger } from '../../utils/logger';

export async function checkCriterion(taskId: string, criterionIndex: string) {
  const spinner = ora('Checking criterion...').start();

  try {
    const backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);
    const index = Number.parseInt(criterionIndex, 10);

    if (Number.isNaN(id) || Number.isNaN(index)) {
      spinner.fail('Invalid task ID or criterion index');
      process.exit(1);
    }

    const task = await backlog.getTaskById(id);
    if (!task) {
      spinner.fail(`Task ${formatTaskId(id, true)} not found`);
      process.exit(1);
    }

    if (index < 0 || index >= task.acceptance_criteria.length) {
      spinner.fail(
        `Criterion index ${index} out of range (0-${task.acceptance_criteria.length - 1})`
      );
      process.exit(1);
    }

    // Update criterion
    task.acceptance_criteria[index].checked = true;

    await backlog.updateTask(
      id,
      {
        acceptance_criteria: task.acceptance_criteria,
      },
      'user'
    );

    spinner.succeed(chalk.green('Criterion checked!'));
    console.log(chalk.green(`\n${icons.done} "${task.acceptance_criteria[index].text}"\n`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to check criterion'));
    logger.error((error as Error).message);
    process.exit(1);
  }
}

export async function uncheckCriterion(taskId: string, criterionIndex: string) {
  const spinner = ora('Unchecking criterion...').start();

  try {
    const backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);
    const index = Number.parseInt(criterionIndex, 10);

    if (Number.isNaN(id) || Number.isNaN(index)) {
      spinner.fail('Invalid task ID or criterion index');
      process.exit(1);
    }

    const task = await backlog.getTaskById(id);
    if (!task) {
      spinner.fail(`Task ${formatTaskId(id, true)} not found`);
      process.exit(1);
    }

    if (index < 0 || index >= task.acceptance_criteria.length) {
      spinner.fail(
        `Criterion index ${index} out of range (0-${task.acceptance_criteria.length - 1})`
      );
      process.exit(1);
    }

    // Update criterion
    task.acceptance_criteria[index].checked = false;

    await backlog.updateTask(
      id,
      {
        acceptance_criteria: task.acceptance_criteria,
      },
      'user'
    );

    spinner.succeed(chalk.green('Criterion unchecked!'));
    console.log(chalk.gray(`\n${icons.pending} "${task.acceptance_criteria[index].text}"\n`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to uncheck criterion'));
    logger.error((error as Error).message);
    process.exit(1);
  }
}

export async function addCriterion(taskId: string, text: string) {
  const spinner = ora('Adding criterion...').start();

  try {
    const backlog = await Backlog.load();
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

    // Add new criterion
    task.acceptance_criteria.push({
      text,
      checked: false,
    });

    await backlog.updateTask(
      id,
      {
        acceptance_criteria: task.acceptance_criteria,
      },
      'user'
    );

    const index = task.acceptance_criteria.length - 1;

    spinner.succeed(chalk.green('Criterion added!'));
    console.log(chalk.white(`\n${icons.pending} [${index}] "${text}"\n`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to add criterion'));
    logger.error((error as Error).message);
    process.exit(1);
  }
}
