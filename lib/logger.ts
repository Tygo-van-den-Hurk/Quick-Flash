import { LogLevel } from "#lib";

/** The exact type of `console.xyz()`. */
type LogFunction = typeof console.info;

/** The logger of the application. */
export class Logger {
  
  /** The default log level for the logger. */
  public static readonly DEFAULT_LOG_LEVEL: LogLevel = LogLevel.INFO;

  /** A function that ignores all it's arguments. */
  public static readonly DEV_NULL: LogFunction = (_message?: any, ..._optionalParams: any[]) => {};;
  
  /** A function that prints as `console.log` to STD out. */
  public static readonly STD_OUT: LogFunction = console.info;

  /** A function that prints as `console.log` to STD err. */
  public static readonly STD_ERR: LogFunction = console.error;

  /**
   * The default function for each `LogLevel`.
   */
  private static _DEFAULT_FUNCTIONS: Record<LogLevel, LogFunction> = {
    [LogLevel.SILENT]: Logger.DEV_NULL,
    [LogLevel.CRITICAL]: Logger.STD_ERR,
    [LogLevel.ERROR]: Logger.STD_ERR,
    [LogLevel.WARN]: Logger.STD_ERR,
    [LogLevel.INFO]: Logger.STD_OUT,
    [LogLevel.DEBUG]: Logger.STD_OUT,
  };
        
  /**
   * The default function for each `LogLevel`.
   */
  public static get DEFAULT_FUNCTIONS(): Readonly<typeof Logger._DEFAULT_FUNCTIONS> {
    return Object.freeze({ ...Logger._DEFAULT_FUNCTIONS });
  }
    
  /**
   * The default function for each `LogLevel`.
   */
  public static set DEFAULT_FUNCTIONS(value: Readonly<typeof Logger._DEFAULT_FUNCTIONS>) {
    Logger._DEFAULT_FUNCTIONS = value;
    const level = LogLevel.fromNumber(LogLevel.toNumber(Logger.logLevel));
    Logger.logLevel = level; // updates functions being used
  }

  /** 
   * the functions to call depending on what level is set. Allows for setting a function of a particular level.
   */
  private static _functions: Record<LogLevel, LogFunction> = {
    ...Logger.DEFAULT_FUNCTIONS,
  };

  /** 
   * the functions to call depending on what level is set. Allows for setting a function of a particular level.
   */
  public static get functions(): Readonly<typeof Logger._functions> {
    return Logger._functions;
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
      if (level < newLevel) Logger._functions[index] = Logger.DEV_NULL;
      else Logger._functions[index] = Logger.DEFAULT_FUNCTIONS[index];
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
