import { describe, test, expect } from "vitest";
import { LogLevel } from "#src/lib/index";

describe("enum LogLevel", () => {
  test("LogLevel.DEBUG", () => {
    expect(LogLevel.DEBUG).toBe("debug");
  });

  test("property LogLevel.INFO", () => {
    expect(LogLevel.INFO).toBe("info");
  });

  test("property LogLevel.WARN", () => {
    expect(LogLevel.WARN).toBe("warn");
  });

  test("property LogLevel.ERROR", () => {
    expect(LogLevel.ERROR).toBe("error");
  });

  test("property LogLevel.CRITICAL", () => {
    expect(LogLevel.CRITICAL).toBe("critical");
  });

  test("property LogLevel.SILENT", () => {
    expect(LogLevel.SILENT).toBe("silent");
  });

  test("LogLevel.options === LogLevel.parser.options", () => {
    expect([...LogLevel.parser.options].sort()).toEqual(
      [...LogLevel.options].sort(),
    );
  });

  test("LogLevel.options", () => {
    expect([...LogLevel.options].sort()).toEqual(
      [
        LogLevel.DEBUG,
        LogLevel.INFO,
        LogLevel.WARN,
        LogLevel.ERROR,
        LogLevel.CRITICAL,
        LogLevel.SILENT,
      ].sort(),
    );
  });

  test("LogLevel.parser.parse()", () => {
    for (const level of LogLevel.options) {
      expect(LogLevel.parser.parse(level)).toBe(level);
    }
  });

  test("LogLevel.parser.parse() > throw", () => {
    expect(() => LogLevel.parser.parse("notalevel")).toThrow();
  });

  test("LogLevel.fromNumber(LogLevel.toNumber(x)) === x", () => {
    for (const level of LogLevel.options) {
      const result = LogLevel.fromNumber(LogLevel.toNumber(level));
      expect(result).toBe(level);
    }
  });

  test("LogLevel.toNumber(LogLevel.fromNumber(x)) === x", () => {
    for (let index = 0; index < LogLevel.options.length; index++) {
      const result = LogLevel.toNumber(LogLevel.fromNumber(index));
      expect(result).toBe(index);
    }
  });
});
