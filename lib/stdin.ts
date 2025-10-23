import readline from 'readline';
import cliCursor from 'cli-cursor';
import { Logger } from '#lib';

/** A class handling the cursor being hidden while the program runs. */
export abstract class STDin {

  /**
   * restores the terminal and shows the cursor.
   */
  public static restore() {
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    cliCursor.show();
  }

  /**
   * Hides the cursor
   */
  public static hide() {
    cliCursor.hide();
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
  }
}

/**
 * restores the cursor to its original state and exits with a 1 exit code.
 */
function restoreAndExit(error?: Error) {
  STDin.restore();
  if (error) Logger.critical(error.message);
  process.exit(1);
}

STDin.hide();
process.on('exit', STDin.restore);
process.on('SIGINT', restoreAndExit);
process.on('uncaughtException', restoreAndExit);
