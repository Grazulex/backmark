import { Backlog } from '../../core/backlog.js';
import { renderBoard } from '../../ui/board-tui.js';
import { logger } from '../../utils/logger.js';

interface DisplayBoardOptions {
  watch?: boolean;
}

export async function displayBoard(_options: DisplayBoardOptions = {}) {
  try {
    const backlog = await Backlog.load();

    // Try new format first (board.columns), then fall back to old format (statuses)
    let columns = backlog.getConfig<string[]>('board.columns');
    if (!columns || columns.length === 0) {
      columns = backlog.getConfig<string[]>('statuses');
    }

    // If still no columns, use defaults
    if (!columns || columns.length === 0) {
      columns = ['To Do', 'In Progress', 'Done'];
    }

    // Use Ink-based interactive board
    await renderBoard(backlog, columns);
  } catch (error) {
    logger.error((error as Error).message);
    process.exit(1);
  }
}
