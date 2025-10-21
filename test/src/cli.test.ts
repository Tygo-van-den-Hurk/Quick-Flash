import { program, compile, serve } from '#src/cli';
import { describe, test, expect } from "vitest";

describe("program", () => {
  // tests relating `program`:

  test("is defined", () => {
    expect(program).toBeDefined();
  });
});

describe("compile", () => {
  // tests relating `compile`:
  
  test("to be subcommand of program", () => {
    expect(compile.parent).toBe(program);
  });
});

describe("serve", () => {
  // tests relating `serve`:
  
  test("to be subcommand of program", () => {
    expect(serve.parent).toBe(program);
  });
});
