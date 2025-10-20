import { Logger, LogLevel } from "#lib";
import { describe, test, expect } from "vitest";
import { vi, beforeAll, afterEach } from "vitest";

describe("class Logger", () => {
  // tests for the `Logger` class

  const spy = vi.fn(Logger.DEV_NULL);

  beforeAll(() => {
    Logger.logLevel = Logger.DEFAULT_LOG_LEVEL;
    Logger.DEFAULT_FUNCTIONS = {
      [LogLevel.DEBUG]: spy,
      [LogLevel.INFO]: spy,
      [LogLevel.WARN]: spy,
      [LogLevel.ERROR]: spy,
      [LogLevel.CRITICAL]: spy,
      [LogLevel.SILENT]: spy,
    };
  });

  afterEach(() => vi.restoreAllMocks());

  test("Logger.logLevel === Logger.DEFAULT_LOG_LEVEL", () => {
    expect(Logger.logLevel).toBe(Logger.DEFAULT_LOG_LEVEL);
  });

  test("Logger.logLevel = LogLevel.X -> Logger.logLevel === LogLevel.X ", () => {
    for (const level of LogLevel.options) {
      Logger.logLevel = level;
      expect(Logger.logLevel).toBe(level);
    }
  });

  test("Logger.${logLevel}() to exist", () => {
    for (const level of LogLevel.options) {
      if (level === LogLevel.SILENT) continue;
      const message = `Expect ${level} to be a function on the logger`;
      expect(Logger[level as keyof typeof Logger], message).toBeDefined();
    }
  });

  test("Logger.${logLevel}() to print through it's function", () => {
    for (const level of LogLevel.options) {
      if (level === LogLevel.SILENT) continue;
      Logger.logLevel = level;
      const message = "Hello, World!";
      const key = level as keyof typeof Logger;
      (Logger[key] as Function)(message);
      expect(spy).toHaveBeenCalledWith(message);
    }
  });
});
