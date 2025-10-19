import { describe, test, expect } from "vitest";

const sum = (a: number, b: number): number => a + b;

describe("simple test", () => {
  test("sum(1,1(", () => {
    expect(sum(1, 1)).toBe(2);
  });
});
