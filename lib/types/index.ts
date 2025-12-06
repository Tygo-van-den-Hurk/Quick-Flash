export * from '#lib/types/base-path';
export * from '#lib/types/log-level';
export * from '#lib/types/result';

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
