/**
 * Forces all optional properties to not be optional.
 */
export type RequireAll<T> = {
  /**
   * Makes all keys no longer optional.
   */
  [K in keyof T]-?: T[K];
};
