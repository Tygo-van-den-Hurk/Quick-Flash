import { LogLevel, Logger } from '#lib';
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';

describe('class Logger', () => {
  // Tests for the `Logger` class

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

  test('Logger.logLevel === Logger.DEFAULT_LOG_LEVEL', () => {
    expect(Logger.logLevel).toBe(Logger.DEFAULT_LOG_LEVEL);
  });

  test('Logger.logLevel = LogLevel.X -> Logger.logLevel === LogLevel.X ', () => {
    for (const level of LogLevel.options) {
      Logger.logLevel = level;
      expect(Logger.logLevel).toBe(level);
    }
  });

  test('Logger.XYZ() to exist for XYY = debug | info | ...', () => {
    for (const level of LogLevel.options) {
      if (level === LogLevel.SILENT) continue;
      const message = `Expect ${level} to be a function on the logger`;
      expect(Logger[level as keyof typeof Logger], message).toBeDefined();
    }
  });

  test('if Logger.logLevel is less verbose then function print nothing', () => {
    Logger.logLevel = LogLevel.DEBUG;
    for (const level of LogLevel.options) {
      expect(Logger.DEFAULT_FUNCTIONS[level]).not.toBe(Logger.DEV_NULL);
      expect(Logger.functions[level]).not.toBe(Logger.DEV_NULL);
    }

    Logger.logLevel = LogLevel.SILENT;
    for (const level of LogLevel.options) {
      if (LogLevel.of(level).isLessOrAsVerboseAs(Logger.logLevel)) continue;
      expect(Logger.DEFAULT_FUNCTIONS[level]).not.toBe(Logger.DEV_NULL);
      expect(Logger.functions[level]).toBe(Logger.DEV_NULL);
    }
  });

  test("Logger.XYZ() to print through it's function for XYZ = debug | info | ...", () => {
    for (const level of LogLevel.options) {
      if (level === LogLevel.SILENT) continue;
      Logger.logLevel = level;
      const message = 'Hello, World!';
      const key = level as keyof typeof Logger;
      (Logger[key] as Function)(message);
      expect(spy).toHaveBeenCalledWith(expect.any(String), message);
    }
  });
});
