import chalk from 'chalk';
import { Backlog } from '../../core/backlog';
import { colorizeStatus, formatTaskId, icons, truncate } from '../../utils/colors';
import { logger } from '../../utils/logger';

export async function showTree(taskId: string) {
  try {
    const backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      logger.error('Invalid task ID');
      process.exit(1);
    }

    const task = await backlog.getTaskById(id);
    if (!task) {
      logger.error(`Task ${formatTaskId(id, true)} not found`);
      process.exit(1);
    }

    console.log(`\n${chalk.bold.cyan('═'.repeat(70))}`);
    console.log(chalk.bold.white('Task Hierarchy Tree'));
    console.log(`${chalk.bold.cyan('═'.repeat(70))}\n`);

    // Show parent if exists
    if (task.parent_task) {
      const parent = await backlog.getTaskById(task.parent_task);
      if (parent) {
        console.log(chalk.gray('Parent:'));
        console.log(
          `  ${formatTaskId(parent.id, true)} ${chalk.white(parent.title)} ${colorizeStatus(parent.status)}\n`
        );
        console.log(chalk.gray('  │'));
      }
    }

    // Show current task
    console.log(
      `${icons.task} ${formatTaskId(task.id, true)} ${chalk.bold.white(task.title)} ${colorizeStatus(task.status)}`
    );

    // Show subtasks
    if (task.subtasks.length > 0) {
      console.log(chalk.gray('  │'));
      for (let i = 0; i < task.subtasks.length; i++) {
        const subtaskId = task.subtasks[i];
        const subtask = await backlog.getTaskById(subtaskId);
        const isLast = i === task.subtasks.length - 1;
        const prefix = isLast ? icons.lastSubtask : icons.subtask;

        if (subtask) {
          console.log(
            `${prefix} ${formatTaskId(subtask.id, true)} ${chalk.white(truncate(subtask.title, 40))} ${colorizeStatus(subtask.status)}`
          );

          // Show sub-subtasks if any
          if (subtask.subtasks.length > 0) {
            for (const subSubId of subtask.subtasks) {
              const subSub = await backlog.getTaskById(subSubId);
              if (subSub) {
                const subPrefix = isLast ? '     ' : '  │  ';
                console.log(
                  `${subPrefix}└─ ${formatTaskId(subSub.id, true)} ${chalk.gray(truncate(subSub.title, 35))} ${colorizeStatus(subSub.status)}`
                );
              }
            }
          }
        }
      }
    } else {
      console.log(chalk.gray('\n  (No subtasks)'));
    }

    console.log(`\n${chalk.bold.cyan('═'.repeat(70))}\n`);
  } catch (error) {
    logger.error((error as Error).message);
    process.exit(1);
  }
}

export async function showDependencies(taskId: string) {
  try {
    const backlog = await Backlog.load();
    const id = Number.parseInt(taskId, 10);

    if (Number.isNaN(id)) {
      logger.error('Invalid task ID');
      process.exit(1);
    }

    const task = await backlog.getTaskById(id);
    if (!task) {
      logger.error(`Task ${formatTaskId(id, true)} not found`);
      process.exit(1);
    }

    console.log(`\n${chalk.bold.cyan('═'.repeat(70))}`);
    console.log(
      chalk.bold.white(
        `${icons.dependency} Dependencies for ${formatTaskId(task.id, true)}: ${task.title}`
      )
    );
    console.log(`${chalk.bold.cyan('═'.repeat(70))}\n`);

    // Dependencies (tasks this one depends on)
    if (task.dependencies.length > 0) {
      console.log(chalk.bold.yellow('This task depends on:'));
      for (const depId of task.dependencies) {
        const dep = await backlog.getTaskById(depId);
        if (dep) {
          const icon = dep.status === 'Done' ? chalk.green(icons.done) : chalk.gray(icons.pending);
          console.log(
            `  ${icon} ${formatTaskId(dep.id, true)} ${chalk.white(dep.title)} ${colorizeStatus(dep.status)}`
          );
        }
      }
    } else {
      console.log(chalk.gray('No dependencies'));
    }

    console.log();

    // Blocked by
    if (task.blocked_by.length > 0) {
      console.log(chalk.bold.red(`${icons.blocked} Blocked by:`));
      for (const blockerId of task.blocked_by) {
        const blocker = await backlog.getTaskById(blockerId);
        if (blocker) {
          console.log(
            `  ${icons.blocked} ${formatTaskId(blocker.id, true)} ${chalk.white(blocker.title)} ${colorizeStatus(blocker.status)}`
          );
        }
      }
      console.log();
    }

    // Tasks that depend on this one
    const allTasks = await backlog.getTasks();
    const dependents = allTasks.filter((t) => t.dependencies.includes(id));

    if (dependents.length > 0) {
      console.log(chalk.bold.yellow('Tasks depending on this:'));
      for (const dependent of dependents) {
        console.log(
          `  ${formatTaskId(dependent.id, true)} ${chalk.white(dependent.title)} ${colorizeStatus(dependent.status)}`
        );
      }
    } else {
      console.log(chalk.gray('No tasks depend on this one'));
    }

    console.log(`\n${chalk.bold.cyan('═'.repeat(70))}\n`);
  } catch (error) {
    logger.error((error as Error).message);
    process.exit(1);
  }
}

export async function showBlocked() {
  try {
    const backlog = await Backlog.load();
    const blockedTasks = await backlog.getBlockedTasks();

    console.log(`\n${chalk.bold.red(`${icons.blocked} Blocked Tasks`)}\n`);

    if (blockedTasks.length === 0) {
      console.log(chalk.green('No blocked tasks! 🎉\n'));
      return;
    }

    for (const task of blockedTasks) {
      console.log(
        `${icons.blocked} ${formatTaskId(task.id, true)} ${chalk.white(task.title)} ${colorizeStatus(task.status)}`
      );
      console.log(
        chalk.gray('  Blocked by:'),
        task.blocked_by.map((id) => formatTaskId(id, true)).join(', ')
      );
      console.log();
    }

    console.log(chalk.bold(`Total: ${blockedTasks.length} blocked task(s)\n`));
  } catch (error) {
    logger.error((error as Error).message);
    process.exit(1);
  }
}
