import { Host, IP4Host, IP6Host } from '#lib';
import { describe, expect, test } from 'vitest';
import { ZodType } from "zod";

describe("IP4Host", () => {
  // Tests for `IP4Host`:

  // IP4Host.parser

  test("IP4Host.parser is defined", () => {
    expect(IP4Host.parser).instanceOf(ZodType)
  });

  // IP4Host.parse(...)

  test("IP4Host.parse('0.0.0.0') to return '0.0.0.0'", () => {
    expect(() => IP4Host.parse("0.0.0.0")).not.toThrow();
    expect(IP4Host.parse("0.0.0.0")).toBe('0.0.0.0');
  });

  test("IP4Host.parse('1.1.1.1') to return '1.1.1.1'", () => {
    const addr = "1.1.1.1"
    expect(() => IP4Host.parse(addr)).not.toThrow();
    expect(IP4Host.parse(addr)).toBe(addr);
  });

  test("IP4Host.parse('255.255.255.255') to return '255.255.255.255'", () => {
    const addr = "255.255.255.255"
    expect(() => IP4Host.parse(addr)).not.toThrow();
    expect(IP4Host.parse(addr)).toBe(addr);
  });

  test("IP4Host.parse('255.255.255.256') to throw", () => {
    expect(() => IP4Host.parse("255.255.255.256")).toThrow();
  });

  test("IP4Host.parse('garbage') throws", () => {
    expect(() => IP4Host.parse("#garbage123")).toThrow();
  });

  // IP4Host.identify(...)


  test("IP4Host.identify('0.0.0.0') to return true", () => {
    expect(() => IP4Host.identify("0.0.0.0")).not.toThrow();
    expect(IP4Host.identify("0.0.0.0")).toBe(true);
  });

  test("IP4Host.identify('1.1.1.1') to return true", () => {
    expect(() => IP4Host.identify("1.1.1.1")).not.toThrow();
    expect(IP4Host.identify("1.1.1.1")).toBe(true);
  });

  test("IP4Host.identify('255.255.255.255') to return true", () => {
    expect(() => IP4Host.identify("255.255.255.255")).not.toThrow();
    expect(IP4Host.identify("255.255.255.255")).toBe(true);
  });

  test("IP4Host.parse('255.255.255.256') to return false", () => {
    expect(IP4Host.identify("255.255.255.256")).toBe(false);
  });

  test("IP4Host.identify('garbage') returns false", () => {
    expect(() => IP4Host.identify("#garbage123")).not.toThrow();
    expect(IP4Host.identify("#garbage123")).toBe(false);
  });

  test("IP4Host.identify(1) returns false", () => {
    expect(() => IP4Host.identify(1)).not.toThrow();
    expect(IP4Host.identify(1)).toBe(false);
  });
});

describe("IP6Host", () => {
  // Tests for `IP6Host`:
  
  // IP6Host.parser

  test("IP6Host.parser is defined", () => {
    expect(IP6Host.parser).instanceOf(ZodType)
  });

  // IP6Host.parse(...)

  test("IP6Host.parse('garbage') throws", () => {
    expect(() => IP6Host.parse("#garbage123")).toThrow();
  });

  // IP6Host.identify(...)

  test("IP6Host.identify('garbage') returns false", () => {
    expect(() => IP6Host.identify("#garbage123")).not.toThrow();
    expect(IP6Host.identify("#garbage123")).toBe(false);
  });

  test("IP6Host.identify(1) returns false", () => {
    expect(() => IP6Host.identify(1)).not.toThrow();
    expect(IP6Host.identify(1)).toBe(false);
  });
});

describe("Host", () => {
  // Tests for `Host`:
  

  // Host.parser

  test("Host.parser is defined", () => {
    expect(Host.parser).instanceOf(ZodType)
  });

  // Host.parse(...)

  test("Host.parse('0.0.0.0') to return '0.0.0.0'", () => {
    expect(() => Host.parse("0.0.0.0")).not.toThrow();
    expect(Host.parse("0.0.0.0")).toBe('0.0.0.0');
  });

  test("Host.parse('1.1.1.1') to return '1.1.1.1'", () => {
    const addr = "1.1.1.1"
    expect(() => Host.parse(addr)).not.toThrow();
    expect(Host.parse(addr)).toBe(addr);
  });

  test("Host.parse('255.255.255.255') to return '255.255.255.255'", () => {
    const addr = "255.255.255.255"
    expect(() => Host.parse(addr)).not.toThrow();
    expect(Host.parse(addr)).toBe(addr);
  });

  test("Host.parse('255.255.255.256') to throw", () => {
    expect(() => Host.parse("255.255.255.256")).toThrow();
  });

  test("Host.parse('garbage') throws", () => {
    expect(() => Host.parse("#garbage123")).toThrow();
  });

  // Host.identify(...)

  test("Host.identify('0.0.0.0') to return true", () => {
    expect(() => Host.identify("0.0.0.0")).not.toThrow();
    expect(Host.identify("0.0.0.0")).toBe(true);
  });

  test("Host.identify('1.1.1.1') to return true", () => {
    expect(() => Host.identify("1.1.1.1")).not.toThrow();
    expect(Host.identify("1.1.1.1")).toBe(true);
  });

  test("Host.identify('255.255.255.255') to return true", () => {
    expect(() => Host.identify("255.255.255.255")).not.toThrow();
    expect(Host.identify("255.255.255.255")).toBe(true);
  });

  test("Host.parse('255.255.255.256') to return false", () => {
    expect(Host.identify("255.255.255.256")).toBe(false);
  });

  test("Host.identify('garbage') returns false", () => {
    expect(() => Host.identify("#garbage123")).not.toThrow();
    expect(Host.identify("#garbage123")).toBe(false);
  });

  test("Host.identify(1) returns false", () => {
    expect(() => Host.identify(1)).not.toThrow();
    expect(Host.identify(1)).toBe(false);
  });
});
