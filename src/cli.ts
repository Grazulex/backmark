#!/usr/bin/env node
import boxen from 'boxen';
import chalk from 'chalk';
import { Command } from 'commander';
import { boardCommands } from './commands/board/index.js';
import {
  addPriority,
  addStatus,
  listPriorities,
  listStatuses,
  removePriority,
  removeStatus,
} from './commands/config.js';
import { initCommand } from './commands/init.js';
import { overviewCommand } from './commands/overview.js';
import { searchCommand } from './commands/search.js';
import { taskCommands } from './commands/task/index.js';

const program = new Command();

// ASCII art banner
const banner = chalk.bold.blue(`
██████╗  █████╗  ██████╗██╗  ██╗███╗   ███╗ █████╗ ██████╗ ██╗  ██╗
██╔══██╗██╔══██╗██╔════╝██║ ██╔╝████╗ ████║██╔══██╗██╔══██╗██║ ██╔╝
██████╔╝███████║██║     █████╔╝ ██╔████╔██║███████║██████╔╝█████╔╝
██╔══██╗██╔══██║██║     ██╔═██╗ ██║╚██╔╝██║██╔══██║██╔══██╗██╔═██╗
██████╔╝██║  ██║╚██████╗██║  ██╗██║ ╚═╝ ██║██║  ██║██║  ██║██║  ██╗
╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
`);

// Custom version output
const versionInfo = () => {
  const pkg = { version: '0.11.3' }; // Will be replaced during build
  console.log(
    boxen(
      `${chalk.bold.blue('Backmark')} ${chalk.green(`v${pkg.version}`)}\n\n` +
        `${chalk.gray('Environment:')}\n` +
        `  Node.js:  ${chalk.white(process.version)}\n` +
        `  Platform: ${chalk.white(process.platform)}\n` +
        `  Arch:     ${chalk.white(process.arch)}\n\n` +
        `${chalk.gray('Links:')}\n` +
        `  Docs:     ${chalk.cyan('https://github.com/Grazulex/backmark#readme')}\n` +
        `  Issues:   ${chalk.cyan('https://github.com/Grazulex/backmark/issues')}\n` +
        `  Npm:      ${chalk.cyan('https://www.npmjs.com/package/@grazulex/backmark')}`,
      {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 0, right: 0 },
        borderStyle: 'round',
        borderColor: 'blue',
      }
    )
  );
};

program
  .name('backmark')
  .description(
    boxen(
      `${banner}\n${chalk.white('Markdown-native task management')}\n${chalk.gray('with colorful CLI and Kanban board')}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'blue',
      }
    )
  )
  .version('0.11.3', '-V, --version', 'Display version information')
  .on('option:version', () => {
    versionInfo();
    process.exit(0);
  })
  .addHelpText(
    'after',
    `
${chalk.bold.yellow('Examples:')}
  ${chalk.gray('# Initialize a new backlog')}
  ${chalk.cyan('$ backmark init "My Project"')}

  ${chalk.gray('# Create a task')}
  ${chalk.cyan('$ backmark task create "Add login feature" --priority high')}

  ${chalk.gray('# List tasks')}
  ${chalk.cyan('$ backmark task list --status "In Progress"')}

  ${chalk.gray('# View Kanban board')}
  ${chalk.cyan('$ backmark board')}

  ${chalk.gray('# Search tasks')}
  ${chalk.cyan('$ backmark search "authentication"')}

  ${chalk.gray('# Project overview')}
  ${chalk.cyan('$ backmark overview')}

${chalk.bold.yellow('Documentation:')}
  Quick Start:  ${chalk.cyan('https://github.com/Grazulex/backmark/blob/main/docs/quick-start.md')}
  AI Workflow:  ${chalk.cyan('https://github.com/Grazulex/backmark/blob/main/docs/ai-workflow.md')}
  Troubleshooting: ${chalk.cyan('https://github.com/Grazulex/backmark/blob/main/docs/troubleshooting.md')}
`
  );

// Init command
program
  .command('init')
  .description('Initialize a new backlog in the current directory')
  .argument('[name]', 'Project name')
  .option('--install-agent', 'Install Backmark agent for Claude Code')
  .action(initCommand);

// Task commands
const task = program.command('task').description('Manage tasks');
taskCommands(task);

// Board commands
const board = program.command('board').description('Kanban board visualization');
boardCommands(board);

// Config commands
const config = program.command('config').description('Manage backlog configuration');

config.command('list-statuses').description('List all valid statuses').action(listStatuses);

config.command('list-priorities').description('List all valid priorities').action(listPriorities);

config.command('add-status <status>').description('Add a new status').action(addStatus);

config.command('remove-status <status>').description('Remove a status').action(removeStatus);

config.command('add-priority <priority>').description('Add a new priority').action(addPriority);

config
  .command('remove-priority <priority>')
  .description('Remove a priority')
  .action(removePriority);

// Search command
program
  .command('search')
  .description('Search tasks with fuzzy matching')
  .argument('<query>', 'Search query')
  .option('-s, --status <status>', 'Filter by status')
  .option('-p, --priority <priority>', 'Filter by priority')
  .option('-a, --assignee <assignee>', 'Filter by assignee')
  .option('-m, --milestone <milestone>', 'Filter by milestone')
  .option('-l, --label <label>', 'Filter by label')
  .action(searchCommand);

// Overview command
program
  .command('overview')
  .description('Display project statistics and overview')
  .option('-m, --milestone <name>', 'Filter by milestone')
  .option('--start <date>', 'Start date (YYYY-MM-DD)')
  .option('--end <date>', 'End date (YYYY-MM-DD)')
  .option('--compact', 'Compact view (less visual)')
  .option('--team', 'Show detailed team breakdown')
  .action(overviewCommand);

// Parse arguments
program.parse();
