import type { Command } from 'commander';
import { displayBoard } from './display';

export function boardCommands(program: Command) {
  program
    .command('show')
    .alias('display')
    .description('Display Kanban board')
    .option('-w, --watch', 'Auto-refresh every 3 seconds')
    .action(displayBoard);
}
