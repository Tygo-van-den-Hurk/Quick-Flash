import { describe, test, expect } from "vitest";
import { LogLevel } from "#lib";

describe("enum LogLevel", () => {
  // LogLevel options

  test("LogLevel.options === LogLevel.parser.options", () => {
    expect([...LogLevel.parser.options].sort()).toStrictEqual(
      [...LogLevel.options].sort(),
    );
  });

  test("LogLevel.options", () => {
    expect([...LogLevel.options].sort()).toStrictEqual(
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

  // LogLevel parser

  test("LogLevel.parser.parse()", () => {
    for (const level of LogLevel.options) {
      expect(LogLevel.parser.parse(level)).toBe(level);
    }
  });

  test("LogLevel.parser.parse() > throw", () => {
    expect(() => LogLevel.parser.parse("notalevel")).toThrow();
  });

  // LogLevel as number

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

  test("LogLevel.fromNumber(MIN-x) === LogLevel.fromNumber(MIN)", () => {
    const MIN = 0;
    for (let index = 1; index < 5; index++) {
      const result1 = LogLevel.fromNumber(MIN - index);
      const result2 = LogLevel.fromNumber(MIN);
      expect(result1).toBe(result2);
    }
  });

  test("LogLevel.fromNumber(MAX+x) === LogLevel.fromNumber(MAX)", () => {
    const MAX = LogLevel.options.length - 1;
    for (let index = 1; index < 5; index++) {
      const result1 = LogLevel.fromNumber(MAX + index);
      const result2 = LogLevel.fromNumber(MAX);
      expect(result1).toBe(result2);
    }
  });

  // Enum options

  test("LogLevel.OPTION === option", () => {
    for (const value of LogLevel.options) {
      const key = value.toUpperCase() as keyof typeof LogLevel;
      expect(LogLevel[key]).toBe(value);
    }
  });
});
