import { LogLevel } from "#lib";

/** The exact type of `console.xyz()`. */
type LogFunction = typeof console.info;

/** A function that ignores all it's arguments. */
const devNull: LogFunction = (_message?: any, ..._optionalParams: any[]) => {};

/** The logger of the application. */
export class Logger {
  
  /** The default log level for the logger. */
  public static readonly DEFAULT_LOG_LEVEL: LogLevel = LogLevel.INFO;

  /** A function that ignores all it's arguments. */
  private static readonly DEV_NULL: LogFunction = devNull;
  
  /** A function that prints as `console.log` to STD out. */
  private static readonly STD_OUT: LogFunction = console.info;

  /** A function that prints as `console.log` to STD err. */
  private static readonly STD_ERR: LogFunction = console.error;

  /**
   * The default function for each `LogLevel`.
   */
  public static readonly DEFAULT_FUNCTIONS: Readonly<Record<LogLevel, LogFunction>> = Object.freeze({
    [LogLevel.SILENT]: Logger.DEV_NULL,
    [LogLevel.CRITICAL]: Logger.STD_ERR,
    [LogLevel.ERROR]: Logger.STD_ERR,
    [LogLevel.WARN]: Logger.STD_ERR,
    [LogLevel.INFO]: Logger.STD_OUT,
    [LogLevel.DEBUG]: Logger.STD_OUT,
  });

  /** 
   * the functions to call depending on what level is set. Allows for setting a function of a particular level.
   */
  private static functions: Record<LogLevel, LogFunction> = {
    ...Logger.DEFAULT_FUNCTIONS,
  };
  
  /**
   * The internal log level of the logger.
   */
  private static _logLevel: LogLevel = Logger.DEFAULT_LOG_LEVEL;

  /**
   * The level to log. Anything using a lower level is discarded.
   */
  public static get logLevel(): LogLevel {
    return Logger._logLevel;
  };

  /**
   * The level to log. Anything using a lower level is discarded.
   */
  public static set logLevel(value: LogLevel) {
    Logger._logLevel = value;
    const newLevel = LogLevel.toNumber(value);
    for (let level = 0; level < LogLevel.options.length; level++) {
      const index = LogLevel.fromNumber(level);
      if (level < newLevel) Logger.functions[index] = Logger.DEV_NULL;
      else Logger.functions[index] = Logger.DEFAULT_FUNCTIONS[index];
    }
  };

  /**
   * Prints to `stderr` with newline if `Logger.logLevel <= LogLevel.CRITICAL`. Multiple arguments can be passed, with 
   * the first used as the primary message and all additional used as substitution values similar to printf (the 
   * arguments are all passed to `util.format()`).
   */
  public static readonly critical: LogFunction = (message?: any, ...optionalParams: any[]):void => {
    Logger.functions[LogLevel.CRITICAL](message, ...optionalParams);
  }

  /**
   * Prints to `stderr` with newline if `Logger.logLevel <= LogLevel.ERROR`. Multiple arguments can be passed, with 
   * the first used as the primary message and all additional used as substitution values similar to printf (the 
   * arguments are all passed to `util.format()`).
   */
  public static readonly error: LogFunction = (message?: any, ...optionalParams: any[]):void => {
    Logger.functions[LogLevel.ERROR](message, ...optionalParams);
  }
  
  /**
   * Prints to `stderr` with newline if `Logger.logLevel <= LogLevel.WARN`. Multiple arguments can be passed, with 
   * the first used as the primary message and all additional used as substitution values similar to printf (the 
   * arguments are all passed to `util.format()`).
   */
  public static readonly warn: LogFunction = (message?: any, ...optionalParams: any[]):void => {
    Logger.functions[LogLevel.WARN](message, ...optionalParams);
  }

  /**
   * Prints to `stdout` with newline if `Logger.logLevel <= LogLevel.INFO`. Multiple arguments can be passed, with 
   * the first used as the primary message and all additional used as substitution values similar to printf (the 
   * arguments are all passed to `util.format()`).
   */
  public static readonly info: LogFunction = (message?: any, ...optionalParams: any[]):void => {
    Logger.functions[LogLevel.INFO](message, ...optionalParams);
  }

  /**
   * Prints to `stdout` with newline if `Logger.logLevel <= LogLevel.INFO`. Multiple arguments can be passed, with 
   * the first used as the primary message and all additional used as substitution values similar to printf (the 
   * arguments are all passed to `util.format()`).
   */
  public static readonly debug: LogFunction = (message?: any, ...optionalParams: any[]):void => {
    Logger.functions[LogLevel.DEBUG](message, ...optionalParams);
  }
}

Logger.logLevel = Logger.DEFAULT_LOG_LEVEL;
