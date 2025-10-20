import { RequireAll } from "#lib";

/**
 * The possible options you can provide to the `compile` function.
 */
export interface CompileArgs {
  
  /** The path to output on */
  output: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompileArgs {
  /**
   * the defaults for the `CompileArgs` options to the `compile` function.
   */
  export const defaults = {
    output: "./slides.html",
  } satisfies CompileArgs;

  /**
   * Fills the `CompileArgs` up with the defaults if any properties are missing.
   */
  export function fillUpWithDefaults(
    options: CompileArgs = CompileArgs.defaults,
  ): RequireAll<CompileArgs> {
    return {
      output: options.output ?? CompileArgs.defaults.output,
    } satisfies RequireAll<CompileArgs>;
  }
}

/**
 * Compiles and then compiles the result
 */
export function compile(options: CompileArgs = CompileArgs.defaults): void {
  console.log(`compiling...`);
}
