import { describe, expect, test, vi } from 'vitest';
import { Result } from '#lib/types/result';

/** Returns the number if it is odd, else returns `null`. Used for tests. */
const isOdd = function isOdd(num: number): number | null {
  if (num === 1) throw new Error();
  if (num === 3) throw "3"; // eslint-disable-line @typescript-eslint/only-throw-error
  if (num === 5) throw 5; // eslint-disable-line @typescript-eslint/only-throw-error
  if (num % 2 === 1) return num;
  return null;
};

describe('type Result', () => {
  test('Result.ok(...)', () => {
    const input = 1234567890;
    const optional = Result.ok(input);
    expect(optional.type).toBe('ok');
    expect(optional.isOk()).toBe(true);
    expect(optional.isError()).toBe(false);
    expect(optional.unwrap()).toBe(input);
    expect(optional.unwrap.withFallback(input + 1)).toBe(input);
    expect(optional.toString()).toContain('ok');
  });

  test('Result.error(...)', () => {
    const optional = Result.error(new Error());
    expect(optional.type).toBe('error');
    expect(optional.isOk()).toBe(false);
    expect(optional.isError()).toBe(true);
    expect(optional.unwrap.withFallback(1)).toBe(1);
    expect(optional.toString()).toContain('error');
  });

  test('Result.error(...).unwrap() => Process.exit', () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit called');
    });

    expect(() => Result.error(new Error).unwrap()).toThrow('exit called');
    expect(exitSpy).toHaveBeenCalled();
    exitSpy.mockRestore();
  });

  test('Result.exec', () => {
    // Returns `Result.ok<null>()`
    const result1 = Result.exec(isOdd, 0);
    expect(result1.type).toBe('ok');
    expect(result1.isError()).toBe(false);
    expect(result1.isOk()).toBe(true);
    expect(result1.unwrap()).toBe(null);

    // Throws
    const optional2 = Result.exec(isOdd, 1);
    expect(optional2.type).toBe('error');
    expect(optional2.isOk()).toBe(false);
    expect(optional2.isError()).toBe(true);

    // Throws
    const optional3 = Result.exec(isOdd, 3);
    expect(optional3.type).toBe('error');
    expect(optional3.isOk()).toBe(false);
    expect(optional3.isError()).toBe(true);
   
    // Throws
    const optional4 = Result.exec(isOdd, 5);
    expect(optional4.type).toBe('error');
    expect(optional4.isOk()).toBe(false);
    expect(optional4.isError()).toBe(true);

    // Returns `Result.ok<number>()`
    const input = 7;
    const optional5 = Result.exec(isOdd, input);
    expect(optional5.type).toBe('ok');
    expect(optional5.isError()).toBe(false);
    expect(optional5.isOk()).toBe(true);
    expect(optional5.unwrap()).toBe(input);
  });
});
