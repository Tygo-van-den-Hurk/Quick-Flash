import { promises as FileSystem, type PathLike } from 'fs';
import { LogLevel, Logger, Result } from '#lib';
import { CompileArgs } from '#src/compile/index';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';

/**
 * Checks if a file (`resolved`) is isAccessible and returns the content in a `Result`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const isAccessible = async function isAccessible(resolved: PathLike): Promise<Result<string>> {
  try {
    await FileSystem.access(resolved);
    return Result.ok(`${resolved.toString()} is accessible`);
  } catch (error) {
    if (error instanceof Error) {
      return Result.error(new Error(`${resolved.toString()} is not accessible, ${error.message}`));
    }
    return Result.error(new Error(`${resolved.toString()} is not accessible`));
  }
};

/**
 * Checks if a file (`resolved`) is a file and not a directory and returns the content in a `Result`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const isFile = async function isFile(resolved: PathLike): Promise<Result<string>> {
  const stats = await FileSystem.stat(resolved);
  if (stats.isFile()) {
    return Result.ok(`${resolved.toString()} is a directory`);
  }

  return Result.error(new Error(`${resolved.toString()} is a directory`));
};

/**
 * Checks if a file (`resolved`) is an XML file and returns the content in a `Result`.
 */
const isRightType = function isRightType(resolved: string): Result<string> {
  const expected = path.extname(CompileArgs.defaults.file).toLowerCase();
  const actual = path.extname(resolved).toLowerCase();
  if (expected === actual) {
    return Result.ok(`${resolved} is the right file type.`);
  }

  return Result.error(new Error(`${resolved} is not the expected type: '${expected}'`));
};

/**
 * Reads the contents of a file (`resolved`) and returns the content in a `Result`.
 */
// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const readContent = async function readContent(resolved: PathLike): Promise<Result<string>> {
  try {
    const content = await FileSystem.readFile(resolved);
    return Result.ok(content.toString());
  } catch (error) {
    if (error instanceof Error) {
      return Result.error(new Error(`${resolved.toString()} is not accessible ${error.message}`));
    }

    return Result.error(new Error(`${resolved.toString()} is not accessible:`));
  }
};

/**
 * Performs all the steps to read the input file.
 */
const readInputSteps = async function* readInputSteps(
  resolved: string
): AsyncGenerator<Result<string>, Result<string>, string> {
  yield isAccessible(resolved);
  yield isFile(resolved);
  yield isRightType(resolved);
  return readContent(resolved);
};

/**
 * Reads an XML file from the disk and returns the content in a `Result`.
 */
export const readInputFileFromDisk = async function readInputFileFromDisk(
  resolved: string
): Promise<Result<string>> {
  const steps = readInputSteps(resolved);

  const spinner = ora({
    isSilent: LogLevel.of(Logger.logLevel).isLessVerboseThen(LogLevel.INFO),
    prefixText: chalk.cyan(LogLevel.INFO.toUpperCase()),
  }).start(`Attempting read on ${resolved}...`);

  let result = await steps.next();
  while (!(result.done ?? false) || result.value.type === 'error') {
    if (result.value.type === 'error') {
      spinner.fail(`${chalk.red('ERROR')}: ${result.value.error.message}`);
      return result.value;
    }

    spinner.text = result.value.ok;
    result = await steps.next(); // eslint-disable-line no-await-in-loop
  }

  spinner.succeed(`${chalk.green('Success')}: read ${resolved}.`);
  return result.value;
};

/**
 * Reads an XML file from the disk and returns the content in a `Result`.
 */
export default readInputFileFromDisk;
