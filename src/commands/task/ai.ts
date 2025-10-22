import chalk from 'chalk';
import ora from 'ora';
import { Backlog } from '../../core/backlog';
import { formatTaskId, icons } from '../../utils/colors';
import { logger } from '../../utils/logger';

export async function aiPlanCommand(taskId: string, content: string) {
  const spinner = ora('Adding AI plan...').start();

  try {
    const backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      spinner.fail('Invalid task ID');
      process.exit(1);
    }

    await backlog.addAIPlan(id, content, 'AI');

    spinner.succeed(chalk.green('AI plan added successfully!'));
    console.log(
      chalk.magenta(`\n${icons.ai} View with: `) +
        chalk.cyan(`backmark task view ${id} --ai-plan\n`)
    );
  } catch (error) {
    spinner.fail(chalk.red('Failed to add AI plan'));
    logger.error((error as Error).message);
    process.exit(1);
  }
}

export async function aiNoteCommand(taskId: string, content: string) {
  const spinner = ora('Adding AI note...').start();

  try {
    const backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      spinner.fail('Invalid task ID');
      process.exit(1);
    }

    await backlog.addAINote(id, content, 'AI');

    spinner.succeed(chalk.green('AI note added successfully!'));
    console.log(
      chalk.magenta(`\n${icons.ai} View with: `) +
        chalk.cyan(`backmark task view ${id} --ai-notes\n`)
    );
  } catch (error) {
    spinner.fail(chalk.red('Failed to add AI note'));
    logger.error((error as Error).message);
    process.exit(1);
  }
}

export async function aiDocCommand(taskId: string, content: string) {
  const spinner = ora('Adding AI documentation...').start();

  try {
    const backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      spinner.fail('Invalid task ID');
      process.exit(1);
    }

    await backlog.addAIDocumentation(id, content, 'AI');

    spinner.succeed(chalk.green('AI documentation added successfully!'));
    console.log(
      chalk.magenta(`\n${icons.ai} View with: `) +
        chalk.cyan(`backmark task view ${id} --ai-doc\n`)
    );
  } catch (error) {
    spinner.fail(chalk.red('Failed to add AI documentation'));
    logger.error((error as Error).message);
    process.exit(1);
  }
}

export async function aiReviewCommand(taskId: string, content: string) {
  const spinner = ora('Adding AI review...').start();

  try {
    const backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      spinner.fail('Invalid task ID');
      process.exit(1);
    }

    await backlog.addAIReview(id, content, 'AI');

    spinner.succeed(chalk.green('AI review added successfully!'));
    console.log(
      chalk.magenta(`\n${icons.ai} View with: `) +
        chalk.cyan(`backmark task view ${id} --ai-review\n`)
    );
  } catch (error) {
    spinner.fail(chalk.red('Failed to add AI review'));
    logger.error((error as Error).message);
    process.exit(1);
  }
}
