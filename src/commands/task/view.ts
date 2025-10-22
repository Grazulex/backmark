import chalk from 'chalk';
import boxen from 'boxen';
import { Backlog } from '../../core/backlog';
import {
  colorizeStatus,
  colorizePriority,
  formatTaskId,
  formatKeywords,
  formatLabels,
  formatAssignees,
  formatDate,
  icons,
} from '../../utils/colors';
import { logger } from '../../utils/logger';

interface ViewTaskOptions {
  aiPlan?: boolean;
  aiNotes?: boolean;
  aiDoc?: boolean;
  aiReview?: boolean;
  aiAll?: boolean;
}

export async function viewTask(taskId: string, options: ViewTaskOptions) {
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

    // Header
    console.log('\n' + chalk.bold.cyan('═'.repeat(80)));
    console.log(
      chalk.bold.white(`${icons.task} Task ${formatTaskId(task.id, true)}: ${task.title}`)
    );
    console.log(chalk.bold.cyan('═'.repeat(80)) + '\n');

    // Main info
    console.log(chalk.bold.yellow('📊 Overview'));
    console.log(chalk.gray('─'.repeat(80)));
    console.log(`${icons.status} ${chalk.bold('Status:      ')}`, colorizeStatus(task.status));
    console.log(`${icons.priority} ${chalk.bold('Priority:    ')}`, colorizePriority(task.priority));

    if (task.milestone) {
      console.log(`${icons.milestone} ${chalk.bold('Milestone:   ')}`, chalk.yellow(task.milestone));
    }

    if (task.assignees.length > 0) {
      console.log(`${icons.user} ${chalk.bold('Assignees:   ')}`, formatAssignees(task.assignees));
    }

    if (task.keywords.length > 0) {
      console.log(`${icons.keyword} ${chalk.bold('Keywords:    ')}`, formatKeywords(task.keywords));
    }

    if (task.labels.length > 0) {
      console.log(`   ${chalk.bold('Labels:      ')}`, formatLabels(task.labels));
    }

    // Dates
    console.log('\n' + chalk.bold.yellow(`${icons.date} Dates`));
    console.log(chalk.gray('─'.repeat(80)));
    console.log(`   ${chalk.bold('Created:     ')}`, formatDate(task.created_date, 'long'));
    console.log(`   ${chalk.bold('Updated:     ')}`, formatDate(task.updated_date, 'long'));

    if (task.start_date) {
      console.log(`   ${chalk.bold('Start:       ')}`, formatDate(task.start_date, 'long'));
    }
    if (task.end_date) {
      console.log(`   ${chalk.bold('End:         ')}`, formatDate(task.end_date, 'long'));
    }
    if (task.release_date) {
      console.log(`   ${chalk.bold('Release:     ')}`, formatDate(task.release_date, 'long'));
    }
    if (task.closed_date) {
      console.log(`   ${chalk.bold('Closed:      ')}`, formatDate(task.closed_date, 'long'));
    }

    // Hierarchy & Dependencies
    if (
      task.parent_task ||
      task.subtasks.length > 0 ||
      task.dependencies.length > 0 ||
      task.blocked_by.length > 0
    ) {
      console.log('\n' + chalk.bold.yellow(`${icons.dependency} Relationships`));
      console.log(chalk.gray('─'.repeat(80)));

      if (task.parent_task) {
        console.log(`   ${chalk.bold('Parent:      ')}`, formatTaskId(task.parent_task, true));
      }

      if (task.subtasks.length > 0) {
        console.log(
          `   ${chalk.bold('Subtasks:    ')}`,
          task.subtasks.map((id) => formatTaskId(id, true)).join(', ')
        );
      }

      if (task.dependencies.length > 0) {
        console.log(
          `   ${chalk.bold('Depends on:  ')}`,
          task.dependencies.map((id) => formatTaskId(id, true)).join(', ')
        );
      }

      if (task.blocked_by.length > 0) {
        console.log(
          `${icons.blocked} ${chalk.bold('Blocked by:  ')}`,
          task.blocked_by.map((id) => formatTaskId(id, true)).join(', ')
        );
      }
    }

    // Description
    if (task.description) {
      console.log('\n' + chalk.bold.yellow('📝 Description'));
      console.log(chalk.gray('─'.repeat(80)));
      console.log(chalk.white(task.description));
    }

    // Acceptance Criteria
    if (task.acceptance_criteria.length > 0) {
      console.log('\n' + chalk.bold.yellow('✓ Acceptance Criteria'));
      console.log(chalk.gray('─'.repeat(80)));
      for (const criterion of task.acceptance_criteria) {
        const icon = criterion.checked ? chalk.green(icons.done) : chalk.gray(icons.pending);
        const text = criterion.checked ? chalk.green(criterion.text) : chalk.white(criterion.text);
        console.log(`   ${icon} ${text}`);
      }
    }

    // AI Sections - Always show if present, but can be filtered
    const showAIPlan = options.aiPlan || options.aiAll || (!options.aiNotes && !options.aiDoc && !options.aiReview);
    const showAINotes = options.aiNotes || options.aiAll || (!options.aiPlan && !options.aiDoc && !options.aiReview);
    const showAIDoc = options.aiDoc || options.aiAll || (!options.aiPlan && !options.aiNotes && !options.aiReview);
    const showAIReview = options.aiReview || options.aiAll || (!options.aiPlan && !options.aiNotes && !options.aiDoc);

    if (showAIPlan && task.ai_plan) {
      console.log('\n' + chalk.bold.magenta(`${icons.ai} AI Plan`));
      console.log(chalk.gray('─'.repeat(80)));
      console.log(
        boxen(chalk.white(task.ai_plan), {
          padding: 1,
          borderStyle: 'round',
          borderColor: 'magenta',
        })
      );
    }

    if (showAINotes && task.ai_notes) {
      console.log('\n' + chalk.bold.magenta(`${icons.ai} AI Notes`));
      console.log(chalk.gray('─'.repeat(80)));
      console.log(
        boxen(chalk.white(task.ai_notes), {
          padding: 1,
          borderStyle: 'round',
          borderColor: 'magenta',
        })
      );
    }

    if (showAIDoc && task.ai_documentation) {
      console.log('\n' + chalk.bold.magenta(`${icons.ai} AI Documentation`));
      console.log(chalk.gray('─'.repeat(80)));
      console.log(
        boxen(chalk.white(task.ai_documentation), {
          padding: 1,
          borderStyle: 'round',
          borderColor: 'magenta',
        })
      );
    }

    if (showAIReview && task.ai_review) {
      console.log('\n' + chalk.bold.magenta(`${icons.ai} AI Review`));
      console.log(chalk.gray('─'.repeat(80)));
      console.log(
        boxen(chalk.white(task.ai_review), {
          padding: 1,
          borderStyle: 'round',
          borderColor: 'magenta',
        })
      );
    }

    // Changelog
    if (task.changelog.length > 0) {
      console.log('\n' + chalk.bold.yellow('📜 History'));
      console.log(chalk.gray('─'.repeat(80)));
      for (const entry of task.changelog.slice(-10)) {
        // Show last 10 entries
        const timestamp = chalk.gray(formatDate(entry.timestamp, 'long'));
        const user = entry.user
          ? chalk.cyan(`[${entry.user}]`)
          : chalk.gray('[system]');
        const action = chalk.yellow(entry.action);
        const details = chalk.white(entry.details);
        console.log(`   ${timestamp} ${user} ${action}: ${details}`);
      }

      if (task.changelog.length > 10) {
        console.log(chalk.gray(`   ... and ${task.changelog.length - 10} more entries`));
      }
    }

    // Footer
    console.log('\n' + chalk.bold.cyan('═'.repeat(80)));
    console.log(chalk.dim('File: ') + chalk.cyan(task.filePath));
    console.log(chalk.bold.cyan('═'.repeat(80)) + '\n');

    // AI suggestions
    if (task.assignees.some((a) => a.toLowerCase().includes('ai') || a.toLowerCase().includes('claude'))) {
      if (!task.ai_plan) {
        console.log(chalk.magenta(`${icons.ai} Tip: Add an AI plan with:`));
        console.log(chalk.gray(`  backmark task ai-plan ${task.id} "Your plan..."\n`));
      }
    }
  } catch (error) {
    logger.error((error as Error).message);
    process.exit(1);
  }
}
