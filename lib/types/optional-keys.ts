/**
 * gets only the optional keys from any interface.
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
