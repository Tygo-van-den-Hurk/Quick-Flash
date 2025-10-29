import { Logger, type RequireAll } from '#lib';

/**
 * The possible options you can provide to the `compile` function.
 */
export interface CompileArgs {
  /** The path to output on */
  output: string;
}

/**
 * The possible options you can provide to the `compile` function.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CompileArgs {
  /**
   * The defaults for the `CompileArgs` options to the `compile` function.
   */
  export const defaults = {
    output: './slides.html',
  } satisfies CompileArgs;

  /**
   * Fills the `CompileArgs` up with the defaults if any properties are missing.
   */
  export const fillUpWithDefaults = function fillUpWithDefaults(
    options: Readonly<CompileArgs> = defaults
  ): RequireAll<CompileArgs> {
    return {
      output: options.output,
    } satisfies RequireAll<CompileArgs>;
  };
}

/**
 * Compiles and then compiles the result
 */
export const compile = function compile(args: Readonly<CompileArgs> = CompileArgs.defaults): void {
  const options = CompileArgs.fillUpWithDefaults(args);
  Logger.critical(`compiling...`, options);
};
