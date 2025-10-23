#!/usr/bin/env node
import boxen from 'boxen';
import chalk from 'chalk';
import { Command } from 'commander';
import { boardCommands } from './commands/board/index.js';
import { initCommand } from './commands/init.js';
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
  .version('0.4.0');

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

// Search command
program
  .command('search')
  .description('Search tasks with fuzzy matching')
  .argument('<query>', 'Search query')
  .option('-s, --status <status>', 'Filter by status')
  .option('-p, --priority <priority>', 'Filter by priority')
  .option('-a, --assignee <assignee>', 'Filter by assignee')
  .option('-m, --milestone <milestone>', 'Filter by milestone')
  .option('-k, --keyword <keyword>', 'Filter by keyword')
  .option('-l, --label <label>', 'Filter by label')
  .action(searchCommand);

// Parse arguments
program.parse();
