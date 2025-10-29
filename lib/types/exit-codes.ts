import { CommanderError } from 'commander';
import { ZodError } from 'zod';

/**
 * The type for exit codes.
 */
export type ExitCode = number;

/**
 * The type for exit codes.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
export namespace ExitCode {
  /**
   * The exit code for a successful run.
   */
  export const SUCCESS: ExitCode = 0;

  /**
   * The exit code for an unknown error.
   */
  export const UNKNOWN_ERROR: ExitCode = 1;

  /**
   * The exit code for an unknown provided option.
   */
  export const UNKNOWN_OPTION: ExitCode = 3;

  /**
   * The exit code for a missing argument.
   */
  export const MISSING_ARGUMENT: ExitCode = 4;

  /**
   * The exit code for when we run into a `ZodError`.
   */
  export const ZOD_ERROR: ExitCode = 5;

  /**
   * The when an argument provided to the CLI was invalid.
   */
  export const INVALID_ARGUMENT: ExitCode = 6;

  /**
   * The when an option provided to the CLI is missing an argument.
   */
  export const OPTION_MISSING_ARGUMENT: ExitCode = 7;

  /**
   * The when the error is a commander error, but our cases do not describe it.
   */
  export const UNKNOWN_COMMANDER_ERROR: ExitCode = 8;

  /**
   * The when the error is an unknown commander error.
   */
  export const UNKNOWN_ERROR_TYPE: ExitCode = 9;

  /**
   * Finding the right `ExitCode` for any error.
   */
  export const from = function from(error: unknown): ExitCode {
    if (!(error instanceof Error)) return UNKNOWN_ERROR_TYPE;
    if (error instanceof ZodError) return ZOD_ERROR;
    if (!(error instanceof CommanderError)) return UNKNOWN_ERROR;
    if (error.code === 'commander.unknownOption') return UNKNOWN_OPTION;
    if (error.code === 'commander.missingArgument') return MISSING_ARGUMENT;
    if (error.code === 'commander.invalidArgument') return INVALID_ARGUMENT;
    if (error.code === 'commander.optionMissingArgument') return OPTION_MISSING_ARGUMENT;
    if (error.code === 'commander.helpDisplayed') return SUCCESS;
    if (error.code === 'commander.version') return SUCCESS;
    return UNKNOWN_COMMANDER_ERROR;
  };
}
