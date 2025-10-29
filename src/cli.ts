#!/usr/bin/env node

import { BasePath, ExitCode, Host, LogLevel, Logger } from '#lib';
import { Command } from 'commander';
import { CompileArgs } from '#src/compile';
import { ServeArgs } from '#src/serve';
import path from 'path';
import pkg from '#package' with { type: 'json' };

// Declare CLI options

/** The root CLI argument parser. */
export const program = new Command();

program
  .name(pkg.name)
  .allowUnknownOption(false)
  .allowExcessArguments(false)
  .exitOverride()
  .combineFlagAndOptionalValue(false)
  .version(pkg.version, '-v, --version', 'print program version and then exit')
  .option(
    '-i, --include-import <glob>',
    'a directory or file to import and use as custom tags',
    // eslint-disable-next-line no-sequences, @typescript-eslint/prefer-readonly-parameter-types
    (value, previous) => (previous.push(value), previous),
    [] as string[]
  )
  .option(
    '-I, --ignore-in-include-import <glob>',
    'a directory or file to not import and use as custom tags',
    // eslint-disable-next-line no-sequences, @typescript-eslint/prefer-readonly-parameter-types
    (value, previous) => (previous.push(value), previous),
    [] as string[]
  )
  .option(
    '-l, --log-level <level>',
    `To log level to use when running. Must be one of: ${LogLevel.options.join(', ')}`,
    (value) => LogLevel.parser.parse(value),
    Logger.DEFAULT_LOG_LEVEL
  )
  .option(
    '-w, --watch <level>',
    `watch the specified files, and rerun if they change.`,
    (value) => Boolean(value),
    false
  )
  .option(
    '-V, --verbose',
    'wether to be more talkative. Raises log level by one per flag.',
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    (_ignore, previous) => previous + 1,
    LogLevel.toNumber(LogLevel.SILENT)
  );

const compileFunctionWrapper = function compileFunctionWrapper(...args: readonly unknown[]): void {
  Logger.critical(args);
  /* Temp: await mergeArgsAndExec(command, compileFile); */
};

/** The CLI argument parser for the `compile` sub-command. */
export const compile = program
  .command('compile [file]')
  .description('compile and then write the changes')
  .action(compileFunctionWrapper)
  .option(
    '-o, --output <path>',
    'The path to write the output to',
    (value) => path.resolve(value),
    CompileArgs.defaults.output
  );

const serveFunctionWrapper = function serveFunctionWrapper(...args: readonly unknown[]): void {
  Logger.critical(args);
  /* Temp: await mergeArgsAndExec(command, compileFile); */
};

/** The CLI argument parser for the `serve` sub-command. */
export const serve = program
  .command('serve [file]')
  .description('compile and then serve on a webserver')
  .action(serveFunctionWrapper)
  .option(
    '-H, --host <ip-address>',
    'The host to use ports from.',
    (value) => Host.parse(value),
    ServeArgs.defaults.host
  )
  .option(
    '-p, --port <int>',
    'The port to listen on and serve the slides from.',
    (value) => Number(value),
    ServeArgs.defaults.port
  )
  .option(
    '-b, --base-path. <prefix>',
    'The base path the serve from. If specified serve from that subdirectory.',
    (value) => BasePath.parse(value),
    ServeArgs.defaults.basePath
  );

const fileIndex = 1;
const isBeingExecuted = import.meta.url === `file://${process.argv[fileIndex]}`;
if (isBeingExecuted) {
  try {
    program.parse(process.argv, { from: 'node' });
  } catch (error: unknown) {
    const EXIT_CODE = ExitCode.from(error);
    process.exit(EXIT_CODE);
  }
}
