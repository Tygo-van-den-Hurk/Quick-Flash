import { describe, expect, test } from 'vitest';
import { Result } from '#lib';

describe('Result', () => {
  // Tests for `Result`:

  // Result.type:

  test('Result.ok().type === "ok"', () => {
    expect(Result.ok().type).toBe('ok');
  });

  test('Result.error().type === "error"', () => {
    expect(Result.error(new Error()).type).toBe('error');
  });

  // Result.value:

  test('Result.ok(XYZ).ok === XYZ', () => {
    const result = Result.ok('SUCCESS') as { type: 'ok'; ok: 'SUCCESS' };
    expect(result.ok).toBe('SUCCESS');
  });

  test('Result.error(XYZ).error === XYZ', () => {
    const error = new Error('some problem');
    const result = Result.error(error) as { type: 'error'; error: Error };
    expect(result.error).toBe(error);
  });
});
