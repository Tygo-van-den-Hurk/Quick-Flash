import * as z from "zod";

const LogLevelOptions = [
  "debug",
  "info",
  "warn",
  "error",
  "critical",
  "silent",
] as const;

const LogLevelParser = z.enum(LogLevelOptions);

/**
 * possible log levels you could use.
 */
export type LogLevel = z.infer<typeof LogLevelParser>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace LogLevel {
  /**
   * returns a log level from a number where the number signifies the intensity.
   */
  export function fromNumber(value: number): LogLevel {
    const min = 0;
    if (value < min) value = min;
    const max = LogLevelOptions.length - 1;
    if (value > max) value = max;
    return LogLevelOptions[value];
  }

  /**
   * returns the intensity of the log level as a number.
   */
  export function toNumber(value: LogLevel): number {
    return LogLevelOptions.findIndex((element) => element === value);
  }

  /**
   * for comparing `LogLevel`s.
   */
  export const of = (level1: LogLevel) => Object.freeze({
    /** Returns `true` if the first `LogLevel` is strictly more verbose then the second `LogLevel`. */
    isMoreVerboseThen: (level2: LogLevel) => LogLevel.toNumber(level1) < LogLevel.toNumber(level2),
    /** Returns `true` if the first `LogLevel` is more or as verbose as the second `LogLevel`. */
    isMoreOrAsVerboseAs: (level2: LogLevel) => LogLevel.toNumber(level1) <= LogLevel.toNumber(level2),
    /** Returns `true` if the first `LogLevel` is strictly less verbose then the second `LogLevel`. */
    isLessVerboseThen: (level2: LogLevel) => LogLevel.toNumber(level1) > LogLevel.toNumber(level2),
    /** Returns `true` if the first `LogLevel` is less or as verbose as the second `LogLevel`. */
    isLessOrAsVerboseAs: (level2: LogLevel) => LogLevel.toNumber(level1) >= LogLevel.toNumber(level2),
  });

  /**
   * The parser to return `LogLevel`s.
   */
  export const parser = LogLevelParser;

  /**
   * An array of all possible `LogLevel` options.
   */
  export const options = LogLevelOptions;

  /**
   * The `debug` log-level.
   */
  export const DEBUG = "debug" as const;

  /**
   * The `info` log-level.
   */
  export const INFO = "info" as const;

  /**
   * The `warn` log-level.
   */
  export const WARN = "warn" as const;

  /**
   * The `error` log-level.
   */
  export const ERROR = "error" as const;

  /**
   * The `critical` log-level.
   */
  export const CRITICAL = "critical" as const;

  /**
   * The `silent` log-level.
   */
  export const SILENT = "silent" as const;
}
