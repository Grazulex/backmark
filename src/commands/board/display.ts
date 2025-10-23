import { Backlog } from '../../core/backlog.js';
import { renderBoard } from '../../ui/board-tui.js';
import { logger } from '../../utils/logger.js';

interface DisplayBoardOptions {
  watch?: boolean;
}

export async function displayBoard(_options: DisplayBoardOptions = {}) {
  try {
    const backlog = await Backlog.load();
    const columns = backlog.getConfig<string[]>('board.columns');

    // Use Ink-based interactive board
    await renderBoard(backlog, columns);
  } catch (error) {
    logger.error((error as Error).message);
    process.exit(1);
  }
}
