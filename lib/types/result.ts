import { Logger } from '#lib/logger';

/** The fallback function a unwrap function has. */
export interface Fallback<T> {
  /** Unwrap the result, return the fallback if the result was not of type `Ok`. */
  readonly withFallback: (fallback: T) => T;
}

/** The base interface of any `Result`. */
export interface ResultBase<T> {
  /** The Type that this result has. Either: "ok" or "error". */
  readonly type: string;
  /** Wether or not the `Result` is of type `ok`. */
  readonly isOk: () => this is OkResult<T>;
  /** Wether or not the `Result` is of type `error`. */
  readonly isError: () => this is ErrorResult<T>;
  /** Unwrap the result, exits the process if the result was not of type `Ok`. */
  readonly unwrap: (() => T | never) & Fallback<T>;
  /** Returns a string representation of the object. */
  readonly toString: () => string;
}

/** The interface of the `error` result variant. */
export interface ErrorResult<T, E extends Error = Error> extends ResultBase<T> {
  readonly type: 'error';
  readonly unwrap: (() => never) & Fallback<T>;
  /** The error the occurred during execution of the function. */
  readonly error: E;
}

/** The interface of the `ok` result variant. */
export interface OkResult<T> extends ResultBase<T> {
  readonly type: 'ok';
  readonly unwrap: (() => T) & Fallback<T>;
  /** The value the was returned from execution of the function. */
  readonly value: T;
}

/**
 * The result enum HEAVILY inspired by rust.
 */
export type Result<T = void, E extends Error = Error> = OkResult<T> | ErrorResult<T, E>;

/**
 * The result enum HEAVILY inspired by rust.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
export namespace Result {
  /** Creates an `ok` variant of the `Result`. */
  export function ok(): OkResult<void>;

  /** Creates an `ok` variant of the `Result`. */
  export function ok<T>(value: T): OkResult<T>;

  /** Creates an `ok` variant of the `Result`. */
  export function ok<T>(value?: T): OkResult<T | void> {
    const result = value as T | void;
    return {
      isError: (): this is ErrorResult<T | void> => false,
      isOk: (): this is OkResult<T | void> => true,
      toString: () => `Result.ok(${typeof value})`,
      type: 'ok',
      unwrap: Object.assign(() => value as T | void, {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        withFallback: (_fallback: T | void) => value,
      }),
      value: result,
    };
  }

  /** Creates an `error` result. */
  export const error = function error<T, E extends Error>(value: E): ErrorResult<T, E> {
    return {
      error: value,
      isError: (): this is ErrorResult<T, E> => true,
      isOk: (): this is OkResult<T> => false,
      toString: () => `Result.error(${value.name})`,
      type: 'error',
      unwrap: Object.assign(
        // eslint-disable-next-line no-restricted-syntax
        (): never => {
          Logger.critical(`Unwrap called on failed result without fallback.`, value);
          const unixInternalSoftwareError = 70;
          return process.exit(unixInternalSoftwareError);
        },
        {
          withFallback: function withFallback(fallback: T): T {
            return fallback;
          },
        }
      ),
    };
  };

  /** Creates a `Result` from an unknown thrown variable. */
  export const fromThrown = function fromThrown<T>(exception: unknown): ErrorResult<T> {
    if (exception instanceof Error) return error(exception);
    if (typeof exception === 'string') return error(new Error(exception));
    return error(new Error(`An unknown error occurred`));
  };

  /**
   * Wraps execution of an asynchronous function, returning a `Promise<Result>` in all cases.
   */
  export function exec<P extends readonly unknown[], R>(
    fn: (...params: P) => Promise<R>,
    ...params: P
  ): Promise<Result<R>>;

  /**
   * Wraps execution of a synchronous function, returning a `Result` in all cases.
   */
  export function exec<P extends readonly unknown[], R>(
    fn: (...params: P) => R,
    ...params: P
  ): Result<R>;

  /**
   * Wraps execution of a function, returning a `Result` in all cases. Used for when you know a function can fail, but
   * have no control over it because for example it is imported from a library. If you do have control over the
   * function you can implement it returning a result as normal.
   */
  export function exec<P extends readonly unknown[], R>(
    fn: (...params: P) => R | Promise<R>,
    ...params: P
  ): Result<R> | Promise<Result<R>> {
    try {
      const result = fn(...params);

      if (result instanceof Promise) {
        return result
          .then((value: R) => ok<R>(value))
          .catch((exception: unknown) => fromThrown<R>(exception));
      }

      return ok(result);
    } catch (exception) {
      return fromThrown(exception);
    }
  }
}

Object.defineProperty(Result.ok, 'name', { configurable: true, value: 'Result.ok' });
Object.defineProperty(Result.error, 'name', { configurable: true, value: 'Result.error' });
Object.defineProperty(Result.exec, 'name', { configurable: true, value: 'Result.exec' });
Object.defineProperty(Result.fromThrown, 'name', {
  configurable: true,
  value: 'Result.fromThrown',
});
