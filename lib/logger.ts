/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { LogLevel } from '#lib';
import chalk from 'chalk';

/** The exact type of `console.xyz()`. */
type LogFunction = typeof console.info;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
const DEV_NULL: LogFunction = (_message, ..._optionalParams) => {};

// eslint-disable-next-line no-console
const STD_OUT: LogFunction = console.info;

// eslint-disable-next-line no-console
const STD_ERR: LogFunction = console.error;

/**
 * The logger of the application. Has functions for all `LogLevel`s like `Logger.debug(...)`.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Logger {
  /** The default log level for the logger. */
  public static readonly DEFAULT_LOG_LEVEL: LogLevel = LogLevel.INFO;

  /** A function that ignores all it's arguments. */
  public static readonly DEV_NULL: LogFunction = DEV_NULL;

  /** A function that prints as `console.log` to STD out. */
  public static readonly STD_OUT: LogFunction = STD_OUT;

  /** A function that prints as `console.log` to STD err. */
  public static readonly STD_ERR: LogFunction = STD_ERR;

  /**
   * The default function for each `LogLevel`.
   */
  private static PRIVATE_DEFAULT_FUNCTIONS: Record<LogLevel, LogFunction> = {
    [LogLevel.SILENT]: DEV_NULL,
    [LogLevel.CRITICAL]: STD_ERR,
    [LogLevel.ERROR]: STD_ERR,
    [LogLevel.WARN]: STD_ERR,
    [LogLevel.INFO]: STD_OUT,
    [LogLevel.DEBUG]: STD_OUT,
  };
  
  /**
   * The functions to call depending on what level is set. Allows for setting a function of a particular level.
   */
  private static privateFunctions: Record<LogLevel, LogFunction> = {
    ...Logger.PRIVATE_DEFAULT_FUNCTIONS,
  };

  /**
   * The internal log level of the logger.
   */
  private static privateLogLevel: LogLevel = Logger.DEFAULT_LOG_LEVEL;

  /**
   * The functions to call depending on what level is set. Allows for setting a function of a particular level.
   */
  public static get functions(): Readonly<typeof Logger.privateFunctions> {
    return Logger.privateFunctions;
  }


  /**
   * The default function for each `LogLevel`.
   */
  public static get DEFAULT_FUNCTIONS(): Readonly<typeof Logger.PRIVATE_DEFAULT_FUNCTIONS> {
    return Object.freeze({ ...Logger.PRIVATE_DEFAULT_FUNCTIONS });
  }
  
  /**
   * The default function for each `LogLevel`.
   */
  public static set DEFAULT_FUNCTIONS(value: Readonly<typeof Logger.PRIVATE_DEFAULT_FUNCTIONS>) {
    Logger.PRIVATE_DEFAULT_FUNCTIONS = value;
    // Now we have to update the functions being used, this does that:
    Logger.logLevel = LogLevel.fromNumber(LogLevel.toNumber(Logger.logLevel));
  }
  
  /**
   * The level to log. Anything using a lower level is discarded.
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public static get logLevel(): LogLevel {
    return Logger.privateLogLevel;
  }

  /**
   * The level to log. Anything using a lower level is discarded.
   */
  public static set logLevel(newLevel: LogLevel) {
    Logger.privateLogLevel = newLevel;
    const STEP = 1;
    for (let index = 0; index < LogLevel.options.length; index += STEP) {
      const level = LogLevel.fromNumber(index);
      if (LogLevel.of(level).isMoreVerboseThen(newLevel))
        Logger.privateFunctions[level] = Logger.DEV_NULL;
      else Logger.privateFunctions[level] = Logger.DEFAULT_FUNCTIONS[level];
    }
  }

  /**
   * Prints to `stderr` with newline if `Logger.logLevel <= LogLevel.CRITICAL`. Multiple arguments can be passed, with
   * the first used as the primary message and all additional used as substitution values similar to printf (the
   * arguments are all passed to `util.format()`).
   */
  public static readonly critical: LogFunction = function critical(
    message?: any,
    ...optionalParams: any[]
  ): void {
    Logger.functions[LogLevel.CRITICAL](
      `${chalk.bold.magenta(LogLevel.CRITICAL.toUpperCase())}:`,
      message,
      ...optionalParams
    );
  };

  /**
   * Prints to `stderr` with newline if `Logger.logLevel <= LogLevel.ERROR`. Multiple arguments can be passed, with
   * the first used as the primary message and all additional used as substitution values similar to printf (the
   * arguments are all passed to `util.format()`).
   */

  public static readonly error: LogFunction = function error(
    message?: any,
    ...optionalParams: any[]
  ): void {
    Logger.functions[LogLevel.ERROR](
      `${chalk.bold.red(LogLevel.ERROR.toUpperCase())}:`,
      message,
      ...optionalParams
    );
  };

  /**
   * Prints to `stderr` with newline if `Logger.logLevel <= LogLevel.WARN`. Multiple arguments can be passed, with
   * the first used as the primary message and all additional used as substitution values similar to printf (the
   * arguments are all passed to `util.format()`).
   */
  public static readonly warn: LogFunction = function warn(
    message?: any,
    ...optionalParams: any[]
  ): void {
    Logger.functions[LogLevel.WARN](
      `${chalk.bold.yellow(LogLevel.WARN.toUpperCase())}:`,
      message,
      ...optionalParams
    );
  };

  /**
   * Prints to `stdout` with newline if `Logger.logLevel <= LogLevel.INFO`. Multiple arguments can be passed, with
   * the first used as the primary message and all additional used as substitution values similar to printf (the
   * arguments are all passed to `util.format()`).
   */
  public static readonly info: LogFunction = function info(
    message?: any,
    ...optionalParams: any[]
  ): void {
    Logger.functions[LogLevel.INFO](
      `${chalk.bold.cyan(LogLevel.INFO.toUpperCase())}:`,
      message,
      ...optionalParams
    );
  };

  /**
   * Prints to `stdout` with newline if `Logger.logLevel <= LogLevel.INFO`. Multiple arguments can be passed, with
   * the first used as the primary message and all additional used as substitution values similar to printf (the
   * arguments are all passed to `util.format()`).
   */
  public static readonly debug: LogFunction = function debug(
    message?: any,
    ...optionalParams: any[]
  ): void {
    Logger.functions[LogLevel.DEBUG](
      `${chalk.bold.green(LogLevel.DEBUG.toUpperCase())}:`,
      message,
      ...optionalParams
    );
  };
}

Logger.logLevel = Logger.DEFAULT_LOG_LEVEL;
