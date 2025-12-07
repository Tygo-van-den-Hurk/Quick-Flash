import { type NoneOptional, Optional } from '#lib/types/optional';
import { describe, expect, test, vi } from 'vitest';

/** Returns the number if it is odd, else returns `null`. Used for tests. */
const isOdd = function isOdd(num: number): number | null {
  if (num % 2 === 0) return null;
  if (num === 1) throw new Error();
  if (num === 3) throw '3'; // eslint-disable-line @typescript-eslint/only-throw-error
  if (num === 5) throw 5; // eslint-disable-line @typescript-eslint/only-throw-error
  return num;
};

/** Waits a certain amount of milliseconds and then returns. */
const wait = async function wait(ms: number): Promise<ReturnType<typeof isOdd>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const result = isOdd(ms);
        resolve(result);
      } catch (error) {
        reject(error); // eslint-disable-line @typescript-eslint/prefer-promise-reject-errors
      }
    }, ms);
  });
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

  test('Optional.exec (sync)', () => {
    // Returns `Optional.none<number>()` because result is null
    const optional1 = Optional.exec(isOdd, 0);
    expect(optional1.type).toBe('none');
    expect(optional1.isSome()).toBe(false);
    expect(optional1.isNone()).toBe(true);
    expect((optional1 as NoneOptional<number>).exception).not.toBeDefined();

    // Returns `Optional.none<number>()` because of throw
    const optional2 = Optional.exec(isOdd, 1);
    expect(optional2.type).toBe('none');
    expect(optional2.isSome()).toBe(false);
    expect(optional2.isNone()).toBe(true);
    expect((optional2 as NoneOptional<number>).exception).toBeDefined();

    // Returns `Optional.none<number>()` because of throw
    const optional3 = Optional.exec(isOdd, 3);
    expect(optional3.type).toBe('none');
    expect(optional3.isSome()).toBe(false);
    expect(optional3.isNone()).toBe(true);
    expect((optional3 as NoneOptional<number>).exception).toBeDefined();

    // Returns `Optional.none<number>()` because of throw
    const optional4 = Optional.exec(isOdd, 5);
    expect(optional4.type).toBe('none');
    expect(optional4.isSome()).toBe(false);
    expect(optional4.isNone()).toBe(true);
    expect((optional4 as NoneOptional<number>).exception).toBeDefined();

    // Returns `Optional.some<number>()`
    const input = 7;
    const optional5 = Optional.exec(isOdd, input);
    expect(optional5.type).toBe('some');
    expect(optional5.isSome()).toBe(true);
    expect(optional5.isNone()).toBe(false);
    expect(optional5.unwrap()).toBe(input);
  });

  test('Optional.exec (async)', async () => {
    // Returns `Optional.none<number>()` because of throw
    const optional1 = await Optional.exec(wait, 1);
    expect(optional1.type).toBe('none');
    expect(optional1.isSome()).toBe(false);
    expect(optional1.isNone()).toBe(true);
    expect((optional1 as NoneOptional<number>).exception).toBeDefined();

    // Returns `Optional.none<number>()`
    const optional2 = await Optional.exec(wait, 2);
    expect(optional2.type).toBe('none');
    expect(optional2.isSome()).toBe(false);
    expect(optional2.isNone()).toBe(true);
    expect((optional2 as NoneOptional<number>).exception).not.toBeDefined();

    // Returns `Optional.some<number>()`
    const input = 7;
    const optional3 = await Optional.exec(wait, input);
    expect(optional3.type).toBe('some');
    expect(optional3.isSome()).toBe(true);
    expect(optional3.isNone()).toBe(false);
    expect(optional3.unwrap()).toBe(input);
  });
});
