import type { Command } from 'commander';
import { aiDocCommand, aiNoteCommand, aiPlanCommand, aiReviewCommand } from './ai';
import { addCriterion, checkCriterion, uncheckCriterion } from './check';
import { createTask } from './create';
import { assignTask, closeTask, editTask } from './edit';
import { showBlocked, showDependencies, showTree } from './hierarchy';
import { listTasks } from './list';
import { listTemplatesCommand, showTemplateCommand } from './templates';
import { viewTask } from './view';

export function taskCommands(program: Command) {
  program
    .command('create')
    .description('Create a new task')
    .argument('<title>', 'Task title')
    .option('-d, --description <text>', 'Task description')
    .option('-t, --template <name>', 'Use a task template (feature, bugfix, refactoring, research)')
    .option('-s, --status <status>', 'Task status', 'To Do')
    .option('-p, --priority <priority>', 'Task priority (low, medium, high, critical)', 'medium')
    .option('-a, --assignees <assignees>', 'Comma-separated assignees')
    .option('-l, --labels <labels>', 'Comma-separated labels')
    .option('-m, --milestone <milestone>', 'Milestone')
    .option('--start <date>', 'Start date (YYYY-MM-DD)')
    .option('--end <date>', 'End date (YYYY-MM-DD)')
    .option('--release <date>', 'Release date (YYYY-MM-DD)')
    .option('--parent <id>', 'Parent task ID (for subtasks)', Number.parseInt)
    .option('--depends-on <ids>', 'Comma-separated task IDs this depends on')
    .action(createTask);

  program
    .command('list')
    .description('List all tasks')
    .option('-s, --status <status>', 'Filter by status')
    .option('-p, --priority <priority>', 'Filter by priority')
    .option('-a, --assignee <assignee>', 'Filter by assignee')
    .option('-l, --label <label>', 'Filter by label')
    .option('-m, --milestone <milestone>', 'Filter by milestone')
    .option('--parent <id>', 'Filter by parent task ID', Number.parseInt)
    .action(listTasks);

  program
    .command('view')
    .description('View task details')
    .argument('<id>', 'Task ID')
    .option('--ai-plan', 'Show AI plan section')
    .option('--ai-notes', 'Show AI notes section')
    .option('--ai-doc', 'Show AI documentation section')
    .option('--ai-review', 'Show AI review section')
    .option('--ai-all', 'Show all AI sections')
    .action(viewTask);

  // AI Commands
  program
    .command('ai-plan')
    .description('Add or update AI implementation plan')
    .argument('<id>', 'Task ID')
    .argument('<content>', 'Plan content')
    .action(aiPlanCommand);

  program
    .command('ai-note')
    .description('Add an AI development note (timestamped)')
    .argument('<id>', 'Task ID')
    .argument('<content>', 'Note content')
    .action(aiNoteCommand);

  program
    .command('ai-doc')
    .description('Add or update AI documentation')
    .argument('<id>', 'Task ID')
    .argument('<content>', 'Documentation content')
    .action(aiDocCommand);

  program
    .command('ai-review')
    .description('Add or update AI review')
    .argument('<id>', 'Task ID')
    .argument('<content>', 'Review content')
    .action(aiReviewCommand);

  // Acceptance Criteria Commands
  program
    .command('check')
    .description('Check an acceptance criterion')
    .argument('<id>', 'Task ID')
    .argument('<index>', 'Criterion index')
    .action(checkCriterion);

  program
    .command('uncheck')
    .description('Uncheck an acceptance criterion')
    .argument('<id>', 'Task ID')
    .argument('<index>', 'Criterion index')
    .action(uncheckCriterion);

  program
    .command('add-criterion')
    .description('Add a new acceptance criterion')
    .argument('<id>', 'Task ID')
    .argument('<text>', 'Criterion text')
    .action(addCriterion);

  // Edit Commands
  program
    .command('edit')
    .description('Edit task properties')
    .argument('<id>', 'Task ID')
    .option('-s, --status <status>', 'Update status')
    .option('-p, --priority <priority>', 'Update priority')
    .option('-m, --milestone <milestone>', 'Update milestone')
    .option('--start <date>', 'Update start date')
    .option('--end <date>', 'Update end date')
    .option('--release <date>', 'Update release date')
    .option('--add-label <labels>', 'Add labels (comma-separated)')
    .option('--remove-label <labels>', 'Remove labels (comma-separated)')
    .option('--add-dependency <ids>', 'Add dependencies (comma-separated IDs)')
    .option('--remove-dependency <ids>', 'Remove dependencies (comma-separated IDs)')
    .action(editTask);

  program
    .command('assign')
    .description('Assign task to people')
    .argument('<id>', 'Task ID')
    .argument('<assignees>', 'Comma-separated assignees')
    .action(assignTask);

  program
    .command('close')
    .description('Close a task (set status to Done)')
    .argument('<id>', 'Task ID')
    .option('--force', 'Force close even if validations fail')
    .action(closeTask);

  // Hierarchy Commands
  program
    .command('tree')
    .description('Show task hierarchy tree')
    .argument('<id>', 'Task ID')
    .action(showTree);

  program
    .command('deps')
    .description('Show task dependencies')
    .argument('<id>', 'Task ID')
    .action(showDependencies);

  program.command('blocked').description('List all blocked tasks').action(showBlocked);

  // Template Commands
  program.command('templates').description('List all available task templates').action(listTemplatesCommand);

  program
    .command('template')
    .description('Template operations')
    .argument('<action>', 'Action: show')
    .argument('<name>', 'Template name')
    .action((action, name) => {
      if (action === 'show') {
        showTemplateCommand(name);
      } else {
        console.error(`Unknown action: ${action}`);
        process.exit(1);
      }
    });
}
