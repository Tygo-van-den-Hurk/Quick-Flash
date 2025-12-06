import { describe, expect, test, vi } from 'vitest';
import { Optional } from '#lib/types/optional';

/** Returns the number if it is odd, else returns `null`. Used for tests. */
const isOdd = function isOdd(num: number): number | null {
  if (num === 1) throw new Error();
  if (num % 2 === 1) return num;
  return null;
};

describe('type Optional', () => {
  test('Optional.some', () => {
    const input = 1234567890;
    const optional = Optional.some(input);
    expect(optional.type).toBe('some');
    expect(optional.isSome()).toBe(true);
    expect(optional.isNone()).toBe(false);
    expect(optional.unwrap()).toBe(input);
    expect(optional.unwrap.withFallback(input + 1)).toBe(input);
    expect(optional.toString()).toContain('some');
    const result = optional.toResult();
    expect(result.isOk()).toBe(true);
    expect(result.value).toBe(input);
  });

  test('Optional.none', () => {
    const optional = Optional.none();
    expect(optional.type).toBe('none');
    expect(optional.isSome()).toBe(false);
    expect(optional.isNone()).toBe(true);
    expect(optional.unwrap.withFallback(1)).toBe(1);
    expect(optional.toString()).toContain('none');
    const result = optional.toResult();
    expect(result.isError()).toBe(true);
  });

  test('Optional.none().unwrap() => Process.exit', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit called');
    });

    expect(() => Optional.none().unwrap()).toThrow('exit called');
    expect(exitSpy).toHaveBeenCalled();
    exitSpy.mockRestore();
  });

  test('Optional.exec', () => {
    // Returns `Optional.none<number>()`
    const optional1 = Optional.exec(isOdd, 0);
    expect(optional1.type).toBe('none');
    expect(optional1.isSome()).toBe(false);
    expect(optional1.isNone()).toBe(true);

    // Throws
    const optional2 = Optional.exec(isOdd, 1);
    expect(optional2.type).toBe('none');
    expect(optional2.isSome()).toBe(false);
    expect(optional2.isNone()).toBe(true);

    // Returns `Optional.some<number>()`
    const input = 3;
    const optional3 = Optional.exec(isOdd, input);
    expect(optional3.type).toBe('some');
    expect(optional3.isSome()).toBe(true);
    expect(optional3.isNone()).toBe(false);
    expect(optional3.unwrap()).toBe(input);
  });
});
