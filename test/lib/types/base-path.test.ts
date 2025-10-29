import { describe, expect, test } from 'vitest';
import { BasePath } from '#lib';
import { ZodType } from 'zod';

describe("type BasePath", () => {
  // Tests for `BasePath`:

  // BasePath.parser

  test("BasePath.parser is defined", () => {
    expect(BasePath.parser).instanceOf(ZodType)
  });

  // BasePath.parse(...)

  test("BasePath.parse('garbage') throws", () => {
    expect(() => BasePath.parse("#garbage123")).toThrow();
  });

  test("BasePath.parse('/') returns '/'", () => {
    expect(() => BasePath.parse("/")).not.toThrow();
    expect(BasePath.parse("/")).toBe('/')
  });

  test("BasePath.parse('/presentation') returns '/presentation'", () => {
    expect(() => BasePath.parse("/presentation")).not.toThrow();
    expect(BasePath.parse("/presentation")).toBe('/presentation');
  });

  // BasePath.identify(...)

  test("BasePath.identify('garbage') returns false", () => {
    expect(() => BasePath.identify("#garbage123")).not.toThrow();
    expect(BasePath.identify("#garbage123")).toBe(false);
  });

  test("BasePath.identify(1) returns false", () => {
    expect(() => BasePath.identify(1)).not.toThrow();
    expect(BasePath.identify(1)).toBe(false);
  });

  test("BasePath.identify('/presentation') returns true", () => {
    expect(() => BasePath.identify("/presentation")).not.toThrow();
    expect(BasePath.identify("/presentation")).toBe(true);
  });
});
