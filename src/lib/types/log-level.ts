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
