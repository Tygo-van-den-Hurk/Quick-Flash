import * as zod from 'zod';

const IDENTIFY = function IDENTIFY(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return value.startsWith('/');
};

const PARSER = zod.custom<`/${string}`>(IDENTIFY);

/**
 * A base path to host any files on. If set to anything other then `/` hosts on that base path.
 * So `/presentation` results that the files will be hosted on `/presentation`.
 */
export type BasePath = zod.infer<typeof PARSER>;

/**
 * A base path to host any files on. If set to anything other then `/` hosts on that base path.
 * So `/presentation` results that the files will be hosted on `/presentation`.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
export namespace BasePath {
  /**
   * The parser to parse `BasePath`s.
   */
  export const parser = PARSER;

  /**
   * Parses a string to be a valid `BasePath`.
   */
  export const parse = function parse(value: unknown): BasePath {
    return PARSER.parse(value);
  };

  /**
   * Identifies something if it is an `BasePath`.
   */
  export const identify = IDENTIFY;
}
