/* eslint-disable id-length, max-classes-per-file, @typescript-eslint/no-extraneous-class */

import { describe, expect, test } from 'vitest';
import { isSubclass } from '#lib/utils/index';

describe('function isSubclass', () => {
  // Tests for the `isSubclass` function:

  class A {}
  class B extends A {}
  class C extends B {}
  class D {}

  test('direct child', () => {
    expect(isSubclass(B, A)).toBe(true);
  });

  test('direct parent', () => {
    expect(isSubclass(A, B)).toBe(false);
  });

  test('grand child', () => {
    expect(isSubclass(C, A)).toBe(true);
  });

  test('not a child', () => {
    expect(isSubclass(D, A)).toBe(false);
  });
});
