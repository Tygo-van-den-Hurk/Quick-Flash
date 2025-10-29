import { Logger } from '#lib';
import cliCursor from 'cli-cursor';
import readline from 'readline';

/**
 * A class handling the cursor being hidden while the program runs.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class STDin {
  /**
   * Restores the terminal to it's original state, and shows the cursor.
   */
  public static restore(): void {
    if (process.stdin.isTTY) process.stdin.setRawMode(false);
    cliCursor.show();
  }

  /**
   * Hides the cursor
   */
  public static hide(): void {
    cliCursor.hide();
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
  }

  /**
   * Installs all `process.on(...)` listeners.
   */
  public static install(): void {

    /**
     * Restores the cursor to its original state and exits with a 1 exit code.
     */
    const restoreAndExit = function restoreAndExit(error?: Readonly<Error>): never {
      STDin.restore();
      if (error) Logger.critical(error.message);
      const ERROR = 1;
      process.exit(ERROR);
    };

    STDin.hide();
    process.on('SIGINT', restoreAndExit);
    process.on('uncaughtException', restoreAndExit);
    process.on('exit', () => {
      STDin.restore();
    });
  }
}
