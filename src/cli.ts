#!/usr/bin/env node

import * as zod from 'zod';
import { BasePath, type DeepReadonly, Host, LogLevel, Logger } from '#lib';
import { CompileArgs, compileFromCliArgs } from '#src/compile/index';
import FastGlob from 'fast-glob';
import { ServeArgs } from '#src/serve';
import chalk from 'chalk';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import pkg from '#package' with { type: 'json' };
import yargs from 'yargs';

// Helpers

const NAME = pkg.name
const VERSION = pkg.version;
const EPILOGUE = `
For the documentation go to ${chalk.underline.cyan(pkg.homepage)}. You can report bugs or create request features by opening an 
issue on ${chalk.underline.cyan(pkg.bugs.url)}, or even better yet a pull request. To see the source code for yourself, you can
go to ${chalk.underline.cyan(pkg.repository.url)}.
`
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .join(' ');

/** If argument is a string, return it, if it is an array of strings, return the last one. */
const getStringOrLast = function getStringOrLast(value: string | readonly string[]): string {
  if (typeof value === 'string') return value;
  return value[value.length - 1];
};

// CLI arguments

/** 
 * The root CLI argument parser.
 */
export const cli = yargs(hideBin(process.argv))
  .strict()
  .wrap(null)
  .demandCommand(1, 'You need to specify a subcommand')
  .scriptName(NAME)
  .version("version", "Show the program version, and then exit.", VERSION)
  .alias('v', 'version')
  .help("help", "Show this help message, and then exit.", true)
  .alias('h', 'help')
  .epilogue(EPILOGUE)

  .option('plugins', {
    alias: 'p',
    array: true,
    coerce: (value: readonly string[]) => FastGlob.sync([...value]),
    default: [] as string[],
    description: 'A directory or file to import and use as custom tags',
    type: 'string',
  })

  .option('log-level', {
    alias: 'l',
    choices: LogLevel.options,
    coerce: (value: string | readonly string[]) => LogLevel.parser.parse(getStringOrLast(value)),
    default: Logger.DEFAULT_LOG_LEVEL,
    description: `Log level to use when running.`,
    type: 'string',
  })

  .option('verbose', {
    alias: 'V',
    default: 0,
    description: 'Whether to be more talkative. Makes it more verbose by one step one per flag.',
    type: 'count',
  })

  .option('color', {
    choices: ["never", "auto", "always"],
    default: "auto",
    describe: 'Enable or disable color output.',
    type: 'string',
  })

  // Middlewares

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, prefer-arrow-callback
  .middleware(function setLoglevelOnLogger(argv): void {
    // More verbose for the value of the count of `verbose`:
    const verbosity = LogLevel.toNumber(argv.logLevel) - argv.verbose;
    Logger.logLevel = LogLevel.fromNumber(verbosity);
    Logger.debug(`Set LogLevel to: ${Logger.logLevel}`);
  })

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, prefer-arrow-callback
  .middleware(function disableColor(argv): void {
    // Set the color value
    const disabled = 0;
    if (argv.color === "never") chalk.level = disabled;
  })

  // Compile subcommand
  .command(
    'compile [file]',
    'Compile and then write the results to disk.',
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types,
    (subYargs) =>
      subYargs.epilogue(EPILOGUE)

        .option('output', {
          alias: 'o',
          coerce: (value: string | readonly string[]) => path.resolve(getStringOrLast(value)),
          default: CompileArgs.defaults.output,
          description: 'The path to write the output to',
          type: 'string',
        })

        .positional('file', {
          alias: 'input',
          default: CompileArgs.defaults.file,
          describe: 'The file to compile, and then serve',
          type: 'string',
        }),

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    async (args) => {
      await compileFromCliArgs(args as DeepReadonly<CompileArgs>);
    }
  )

  // Serve subcommand
  .command(
    'serve [file]',
    'Compile and then serve the results on a webserver.',
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types,
    (subYargs) =>
      subYargs.epilogue(EPILOGUE)

        .option('host', {
          alias: 'H',
          coerce: (value: string | readonly string[]) => Host.parser.parse(getStringOrLast(value)),
          default: ServeArgs.defaults.host,
          description: 'The host to use ports from.',
          type: 'string',
        })

        .option('port', {
          alias: 'P',
          coerce: (value: string | number) => zod.number().parse(value),
          default: ServeArgs.defaults.port,
          description: 'The port to listen on and serve the slides from.',
          type: 'number',
        })

        .option('base-path', {
          alias: 'B',
          coerce: (value: string) => BasePath.parser.parse(value, {
            error: () => `option '--base-path' must be a valid path starting with /`,
          }),
          default: ServeArgs.defaults.basePath,
          description: 'The base path to serve from. If specified, serve from that subdirectory.',
          type: 'string',
        })

        .positional('file', {
          alias: 'input',
          default: CompileArgs.defaults.file,
          describe: 'The file to compile, and then serve',
          type: 'string',
        }),

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (args) => {
      Logger.critical('serve', args);
      // Temp: await mergeArgsAndExec(command, serveFile);
    }
  )

  // Argument fails

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types,, no-restricted-syntax
  .fail((message?: string, error?: Error) => {

    if (error) {
      Logger.critical(error.message);
      process.exit(1);
    }

    Logger.critical('Invalid usage:', message);
    process.exit(1);
  });


// If file is being executed instead of sourced:

const fileIndex = 1;
const isBeingExecuted = import.meta.url === `file://${process.argv[fileIndex]}`;
if (isBeingExecuted) await cli.parse();
