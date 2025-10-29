import * as zod from 'zod';

const OPTIONS = ['debug', 'info', 'warn', 'error', 'critical', 'silent'] as const;

const PARSER = zod.enum(OPTIONS);

/**
 * Possible log levels you could use.
 */
export type LogLevel = zod.infer<typeof PARSER>;

/**
 * Possible log levels you could use.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
export namespace LogLevel {
  /**
   * Returns a log level from a number where the number signifies the intensity.
   */
  export const fromNumber = function fromNumber(value: number): LogLevel {
    const min = 0;
    const arrayIndex = 1;
    const max = OPTIONS.length - arrayIndex;
    const clamped = Math.max(min, Math.min(value, max));
    return OPTIONS[clamped];
  };

  /**
   * Returns the intensity of the log level as a number.
   */
  export const toNumber = function toNumber(value: LogLevel): number {
    return OPTIONS.findIndex((element) => element === value);
  };

  /**
   * For comparing two `LogLevel`s to see which one is more/less verbose as the other.
   */
  export const of = function of(level1: LogLevel): Readonly<{
    isLessOrAsVerboseAs: (level2: LogLevel) => boolean;
    isLessVerboseThen: (level2: LogLevel) => boolean;
    isMoreOrAsVerboseAs: (level2: LogLevel) => boolean;
    isMoreVerboseThen: (level2: LogLevel) => boolean;
  }> {
    return Object.freeze({
      /** Returns `true` if the first `LogLevel` is less or as verbose as the second `LogLevel`. */
      isLessOrAsVerboseAs: (level2: LogLevel) => toNumber(level1) >= toNumber(level2),
      /** Returns `true` if the first `LogLevel` is strictly less verbose then the second `LogLevel`. */
      isLessVerboseThen: (level2: LogLevel) => toNumber(level1) > toNumber(level2),
      /** Returns `true` if the first `LogLevel` is more or as verbose as the second `LogLevel`. */
      isMoreOrAsVerboseAs: (level2: LogLevel) => toNumber(level1) <= toNumber(level2),
      /** Returns `true` if the first `LogLevel` is strictly more verbose then the second `LogLevel`. */
      isMoreVerboseThen: (level2: LogLevel) => toNumber(level1) < toNumber(level2),
    });
  };

  /**
   * The parser to return `LogLevel`s.
   */
  export const parser = PARSER;

  /**
   * An array of all possible `LogLevel` options.
   */
  export const options = OPTIONS;

  /**
   * The `debug` log-level.
   */
  export const DEBUG = 'debug' as const;

  /**
   * The `critical` log-level.
   */
  export const CRITICAL = 'critical' as const;

  /**
   * The `error` log-level.
   */
  export const ERROR = 'error' as const;

  /**
   * The `info` log-level.
   */
  export const INFO = 'info' as const;

  /**
   * The `silent` log-level.
   */
  export const SILENT = 'silent' as const;

  /**
   * The `warn` log-level.
   */
  export const WARN = 'warn' as const;
}
