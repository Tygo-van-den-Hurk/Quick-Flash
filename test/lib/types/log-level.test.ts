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

  // LogLevel comparisons

  test("LogLevel.of(LogLevel.XYZ).isMoreVerboseThen(LogLevel.ABC)", () => {
    const debug = LogLevel.DEBUG;
    const critical = LogLevel.CRITICAL;
    const assumption = LogLevel.of(debug).isMoreVerboseThen(critical);
    expect(assumption).toBe(true);
    for (let index = 0; index < LogLevel.options.length - 1; index++) {
      const level1 = LogLevel.fromNumber(index);
      const level2 = LogLevel.fromNumber(index + 1);
      const assertion = LogLevel.of(level1).isMoreVerboseThen(level2);
      expect(assertion).toBe(true);
    }
  });

  test("LogLevel.of(LogLevel.XYZ).isMoreOrAsVerboseAs(LogLevel.ABC)", () => {
    const debug = LogLevel.DEBUG;
    const critical = LogLevel.CRITICAL;
    const assumption1 = LogLevel.of(debug).isMoreOrAsVerboseAs(critical);
    expect(assumption1).toBe(true);
    const assumption2 = LogLevel.of(debug).isMoreOrAsVerboseAs(debug);
    expect(assumption2).toBe(true);
    for (let index = 0; index < LogLevel.options.length - 1; index++) {
      const level1 = LogLevel.fromNumber(index);
      const level2 = LogLevel.fromNumber(index + 1);
      const assertion1 = LogLevel.of(level1).isMoreOrAsVerboseAs(level2);
      expect(assertion1).toBe(true);
      const assertion2 = LogLevel.of(level1).isMoreOrAsVerboseAs(level1);
      expect(assertion2).toBe(true);
    }
  });

  test("LogLevel.of(LogLevel.XYZ).isLessVerboseThen(LogLevel.ABC)", () => {
    const debug = LogLevel.DEBUG;
    const critical = LogLevel.CRITICAL;
    const assumption = LogLevel.of(critical).isLessVerboseThen(debug);
    expect(assumption).toBe(true);
    for (let index = 0; index < LogLevel.options.length - 1; index++) {
      const level1 = LogLevel.fromNumber(index);
      const level2 = LogLevel.fromNumber(index + 1);
      const assertion = LogLevel.of(level2).isLessVerboseThen(level1);
      expect(assertion).toBe(true);
    }
  });

  test("LogLevel.of(LogLevel.XYZ).isLessOrAsVerboseAs(LogLevel.ABC)", () => {
    const debug = LogLevel.DEBUG;
    const critical = LogLevel.CRITICAL;
    const assumption1 = LogLevel.of(critical).isLessOrAsVerboseAs(debug);
    expect(assumption1).toBe(true);
    const assumption2 = LogLevel.of(debug).isLessOrAsVerboseAs(debug);
    expect(assumption2).toBe(true);
    for (let index = 0; index < LogLevel.options.length - 1; index++) {
      const level1 = LogLevel.fromNumber(index);
      const level2 = LogLevel.fromNumber(index + 1);
      const assertion1 = LogLevel.of(level2).isLessOrAsVerboseAs(level1);
      expect(assertion1).toBe(true);
      const assertion2 = LogLevel.of(level2).isLessOrAsVerboseAs(level2);
      expect(assertion2).toBe(true);
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
