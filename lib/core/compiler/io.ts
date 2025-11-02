import * as FileSystem from 'fs';
import * as path from 'path';
import * as url from 'url';
import parseXML, { ParsingError, type XmlParserResult } from 'xml-parser-xo';
import { Component } from '#lib/core/components/index';
import { LogLevel } from '#lib/types/log-level';
import { Logger } from '#lib/logger';
import { MarkupRenderer } from '#lib/core/markup/index';
import chalk from 'chalk';
import { oraPromise as ora } from 'ora';

/**
 * Parses a given string for XML, and returns the parsed result.
 */
export const parseInput = function parseInput(content: string): XmlParserResult {
  try {
    const strictMode = true;
    const result = parseXML(content, { strictMode });
    return result;
  } catch (error: unknown) {
    if (error instanceof ParsingError)
      throw new Error(`${error.message}: ${error.cause}`, { cause: error });
    throw new Error(`Could not parse input file.`, { cause: error });
  }
};

/**
 * Given a path to a file, checks it for existence, accessability and type. Then reads and returns it.
 */
export const readInput = function readInput(filePath: string): string | never {
  const resolved = path.resolve(filePath);

  if (!FileSystem.existsSync(resolved)) {
    throw new Error(`No such file: ${resolved}`);
  }

  const extension = path.extname(resolved);
  if (extension !== '.xml') {
    Logger.warn(`Expected an '.xml' file, but got a ${extension} file: ${resolved}`);
  }

  try {
    FileSystem.accessSync(resolved, FileSystem.constants.R_OK);
  } catch (error: unknown) {
    throw new Error(`File is not accessible for reading: ${resolved}`, { cause: error });
  }

  try {
    const content = FileSystem.readFileSync(resolved);
    return content.toString();
  } catch (error: unknown) {
    throw new Error(`Could not read: ${resolved}`, { cause: error });
  }
};

/**
 * Given a path to a file, checks it for existence, accessability and type. Then reads and imports it.
 */
const importPlugin = async function importPlugin(resolved: string): Promise<unknown> {
  if (!FileSystem.existsSync(resolved)) {
    throw new Error(`No such file: ${resolved}`);
  }

  const expected = ['.js', '.mjs'];
  const extension = path.extname(resolved);
  if (!expected.includes(extension)) {
    Logger.warn(
      `Expected plugin to be one of '${expected.join("', '")}', but got a '${extension}' file: ${resolved}`
    );
  }

  try {
    const plugin = url.pathToFileURL(resolved).href;
    return (await import(plugin)) as unknown;
  } catch (error: unknown) {
    throw new Error(`Could not import plugin: ${resolved}`, { cause: error });
  }
};

/**
 * Imports a file path, and parses the exports for the desired structure.
 */
const loadPlugin = async function loadPlugin(filePath: string): Promise<void> {
  const resolved = path.resolve(filePath);

  const result = await importPlugin(resolved);
  if (typeof result !== 'object' || result === null)
    throw new Error(`Expected plugin' exports to be an object, but found ${String(result)}`);
  if (!('default' in result))
    throw new Error(
      `Expected plugin' exports to have a default key, but found keys: "${Object.keys(result).join('", "')}"`
    );
  if (typeof result.default !== 'function')
    throw new Error(
      `Expected plugin' default exports to be a function but found: "${typeof result.default}"`
    );

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await result.default({ Component, Logger: Logger.API, MarkupRenderer });
    Logger.info(`Successfully loaded plugin: ${resolved}`);
  } catch (error: unknown) {
    throw new Error(`Could not load plugin' default function: ${resolved}`, { cause: error });
  }
};

/**
 * Imports all imports from a list of imports.
 */
export const loadPlugins = async function loadPlugins(plugins: readonly string[]): Promise<void> {
  await ora(Promise.all(plugins.map(async (plugin) => loadPlugin(plugin))), {
    failText: `${chalk.red('Failed')} to imported all ${plugins.length} plugins...`,
    isSilent: LogLevel.of(Logger.logLevel).isMoreOrAsVerboseAs(LogLevel.INFO),
    prefixText: chalk.cyan(LogLevel.INFO.toUpperCase()),
    successText: `${chalk.green('Successfully')} imported all ${plugins.length} plugins.`,
  });
};
