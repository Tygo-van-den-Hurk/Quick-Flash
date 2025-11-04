import { loadPlugins, parseInput, readInput } from '#lib/core/compiler/io';
import { Logger } from '#lib/logger';
import path from 'path';
import prettier from 'prettier'; // eslint-disable-line import/default
import { render } from '#lib/core/compiler/render';

/**
 * The possible options you can provide to the `compile` function.
 */
export interface CompileArgs {
  /** The path to output on. */
  output: string;

  /** The path to the file to read and parse. */
  file: string;

  /** A list of files to import dynamically. */
  plugins: readonly string[];
}

/**
 * Compiles an input Slyde file into an HTML string.
 */
export const compile = async function compile(options: Readonly<CompileArgs>): Promise<string> {
  const content = readInput(options.file);
  Logger.info(`Read file ${options.file}`);

  process.chdir(path.dirname(path.resolve(options.file)));
  Logger.debug(`Changed CWD to: ${path.dirname(path.resolve(options.file))}`);

  const parsed = parseInput(content);
  Logger.info(`Parsed input file.`);

  await loadPlugins(options.plugins);
  Logger.info(`Loaded ${options.plugins.length} plugins:`, options.plugins);

  const rendered = render(parsed);
  Logger.info(`Rendered file from input file.`);

  const formatted = await prettier.format(rendered, { parser: 'html' });
  Logger.info(`Formatted result using Prettier.`);

  return formatted;
};

export * as io from '#lib/core/compiler/io';
export * as render from '#lib/core/compiler/render';
