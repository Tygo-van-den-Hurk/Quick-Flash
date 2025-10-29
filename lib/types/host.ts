import * as zod from 'zod';

const IP_V4_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/u;

const IDENTIFY_IP_V4 = function IDENTIFY_IP_V4(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  if (! IP_V4_REGEX.test(value)) return false;
  for (const octet of value.split(".")) {
    const num = Number.parseInt(octet, 10);
    const max = 255, min = 0;
    if (num < min || num > max) return false;
  }
  
  return true;
};

const IP_V4_PARSER = zod.custom<`${number}.${number}.${number}.${number}`>(IDENTIFY_IP_V4);

/**
 * An IP version 4 host.
 */
export type IP4Host = zod.infer<typeof IP_V4_PARSER>;

/**
 * An IP version 4 host.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
export namespace IP4Host {

  /**
   * The parser to parse `IP4Host`s.
   */
  export const parser = IP_V4_PARSER;

  /**
   * Parses a string to be a valid `IP4Host`.
   */
  export const parse = function parse(value: string): IP4Host {
    return IP_V4_PARSER.parse(value);
  };

  /**
   * Identifies something if it is an `IP4Host`.
   */
  export const identify = IDENTIFY_IP_V4;
}


const IP_V6_REGEX = /^[0-9a-fA-F:]+$/u;

const IDENTIFY_IP_V6 = function IDENTIFY_IP_V6(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return IP_V6_REGEX.test(value);
};

const IP_V6_PARSER =
  zod.custom<`${string}:${string}:${string}:${string}:${string}:${string}:${string}:${string}`>(
    IDENTIFY_IP_V6
  );

/**
 * An IP version 6 host.
 */
export type IP6Host = zod.infer<typeof IP_V6_PARSER>;

/**
 * An IP version 6 host.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
export namespace IP6Host {

  /**
   * The parser to parse `IP4Host`s.
   */
  export const parser = IP_V6_PARSER;

  /**
   * Parses a string to be a valid `IP4Host`.
   */
  export const parse = function parse(value: string): IP6Host {
    return IP_V6_PARSER.parse(value);
  };

  /**
   * Identifies something if it is an `IP4Host`.
   */
  export const identify = IDENTIFY_IP_V6;
}

const PARSER = IP_V4_PARSER.or(IP_V6_PARSER);

/**
 * A IP version 4 or version 6 host.
 */
export type Host = zod.infer<typeof PARSER>;

/**
 * A IP version 4 or version 6 host.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
export namespace Host {
  /**
   * The parser to parse `Host`s.
   */
  export const parser = PARSER;

  /**
   * Parses a string to be a valid `Host`.
   */
  export const parse = function parse(value: string): Host {
    return PARSER.parse(value);
  };

  /**
   * Identifies something if it is an `Host`.
   */
  export const identify = IDENTIFY_IP_V4;
}
