export * from '#lib/types/base-path';
export * from '#lib/types/log-level';

/**
 * The result enum HEAVILY inspired by rust.
 */
export type Result<T = void, E extends Error = Error> =
  | { type: Readonly<'ok'>; ok: T }
  | { type: Readonly<'error'>; error: E };

/**
 * The result enum HEAVILY inspired by rust.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
export namespace Result {
  /**
   * Creates an `ok` result.
   */
  export function ok(): Result;

  /**
   * Creates an `ok` result.
   */
  export function ok<T>(value: T): Result<T>;

  /**
   * Creates an `ok` result.
   */
  export function ok<T>(value?: T): Result<T | void> {
    return {
      ok: value as T | void,
      type: 'ok',
    };
  }

  /**
   * Creates an `error` result.
   */
  export const error = function error<T, E extends Error>(value: E): Result<T, E> {
    return {
      error: value,
      type: 'error',
    };
  };
}

/**
 * Forces all optional properties to not be optional.
 *
 * ```TypeScript
 * export interface DataBaseRow {
 *   name: string;
 *   email?: string;
 * }
 *
 * type Result = RequireAll<DataBaseRow>;
 * // type Result = {
 * //   name: string;
 * //   email: string;
 * // }
 * ```
 */
export type RequireAll<T> = {
  /**
   * Makes all keys no longer optional.
   */
  [K in keyof T]-?: T[K];
};

/**
 * Gets only the optional keys from any TypeScript interface:
 *
 * ```TypeScript
 * export interface DataBaseRow {
 *   name: string;
 *   email?: string;
 * }
 *
 * type EmailStruct = OptionalKeys<DataBaseRow>;
 * // type EmailStruct = {
 * //   email: string;
 * // }
 * ```
 */
export type OptionalKeys<T> = {
  [K in keyof T as object extends Pick<T, K> ? K : never]: T[K];
};

/**
 * Makes an object deeply readonly.
 */
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : Readonly<T[K]>;
};
