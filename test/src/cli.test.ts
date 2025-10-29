import { compile, program, serve } from '#src/cli';
import { describe, expect, test } from 'vitest';
import { Command } from 'commander';

describe('program', () => {
  // Tests relating `program`:

  test('is defined', () => {
    expect(program).toBeInstanceOf(Command);
  });
});

describe('compile', () => {
  // Tests relating `compile`:

  test('to be subcommand of program', () => {
    expect(compile).toBeInstanceOf(Command);
    expect(compile.parent).toBe(program);
  });
});

describe('serve', () => {
  // Tests relating `serve`:

  test('to be subcommand of program', () => {
    expect(serve).toBeInstanceOf(Command);
    expect(serve.parent).toBe(program);
  });
});
