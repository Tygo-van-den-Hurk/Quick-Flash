import * as compiler from '#lib/core/compiler/index';
import { type DeepReadonly, LogLevel, Logger, type RequireAll, Result } from '#lib';
import { promises as FileSystem, type PathLike } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';

/**
 * The possible options you can provide to the `compile` function.
 */
export interface CompileArgs {
  /** The path to output on */
  output: string;

  /** The path to the file to read and parse. */
  file: string;

  /** A list of files to import dynamically. */
  plugins?: readonly string[];
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
    file: path.join(process.cwd(), 'slyde.xml'),
    output: path.join(process.cwd(), 'slyde.html'),
    plugins: [],
  } satisfies CompileArgs;

  /**
   * Fills the `CompileArgs` up with the defaults if any properties are missing.
   */
  export const fillUpWithDefaults = function fillUpWithDefaults(
    options: DeepReadonly<CompileArgs> = defaults
  ): RequireAll<CompileArgs> {
    return {
      file: options.file,
      output: options.output,
      plugins: options.plugins ?? defaults.plugins,
    } satisfies RequireAll<CompileArgs>;
  };
}

const writeToDisk = async function writeToDisk(
  resolved: PathLike, // eslint-disable-line @typescript-eslint/prefer-readonly-parameter-types
  content: string
): Promise<Result> {
  const spinner = ora({
    isSilent: LogLevel.of(Logger.logLevel).isLessVerboseThen(LogLevel.INFO),
    prefixText: chalk.cyan(LogLevel.INFO.toUpperCase()),
  }).start(`writing to disk...`);

  try {
    await FileSystem.writeFile(resolved, content);
    spinner.succeed(`${chalk.green('Success')}: wrote the result to disk!`);
    return Result.ok();
  } catch (error) {
    if (error instanceof Error) {
      const result = new Error(`Unable to write to ${resolved.toString()}: ${error.message}`);
      spinner.fail(`${chalk.red(LogLevel.ERROR.toUpperCase())}: ${result.message}`);
      return Result.error(result);
    }

    const result = new Error(`Unable to write to ${resolved.toString()}`);
    spinner.fail(`${chalk.red(LogLevel.ERROR.toUpperCase())}: ${result.message}`);
    return Result.error(result);
  }
};

/**
 * Compiles and then writes to the disk
 */
export const compileFromCliArgs = async function compileFromCliArgs(
  args: DeepReadonly<CompileArgs> = CompileArgs.defaults
): Promise<void> {
  const options = CompileArgs.fillUpWithDefaults(args);
  const result = await compiler.compile(options);
  const writeResult = await writeToDisk(options.output, result);
  if (writeResult.type === 'error') throw writeResult.error;
  Logger.info(`Write result to: ${options.output}`);
};
