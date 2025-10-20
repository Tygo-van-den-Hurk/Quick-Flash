import { RequireAll } from "#lib";

/**
 * The possible options you can provide to the `compile` function.
 */
export interface CompileArgs {}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompileArgs {
  /**
   * the defaults for the `CompileArgs` options to the `compile` function.
   */
  export const defaults = {} satisfies CompileArgs;

  /**
   * Fills the `CompileArgs` up with the defaults if any properties are missing.
   */
  export function fillUpWithDefaults(
    options: CompileArgs = CompileArgs.defaults,
  ): RequireAll<CompileArgs> {
    return {} satisfies RequireAll<CompileArgs>;
  }
}

/**
 * Compiles and then compiles the result
 */
export function compile(options: CompileArgs = CompileArgs.defaults): void {
  console.log(`compiling...`);
}
