import { program, compile, serve } from "#src/cli";
import { describe, test, expect } from "vitest";
import { Command } from "commander";

describe("program", () => {
  // tests relating `program`:

  test("is defined", () => {
    expect(program).toBeInstanceOf(Command);
  });
});

describe("compile", () => {
  // tests relating `compile`:

  test("to be subcommand of program", () => {
    expect(compile).toBeInstanceOf(Command);
    expect(compile.parent).toBe(program);
  });
});

describe("serve", () => {
  // tests relating `serve`:

  test("to be subcommand of program", () => {
    expect(serve).toBeInstanceOf(Command);
    expect(serve.parent).toBe(program);
  });
});
