import { type ErrorResult, type OkResult, Result } from '#lib/types/result';
import { Logger } from '#lib/logger';

/** A class for when no such element exists */
export class NoSuchElementError extends Error {
  /** A class for when no such element exists */
  public constructor(message = 'No such element') {
    super(message);
    this.name = NoSuchElementError.name;
  }
}

/** The fallback function a unwrap function has. */
export interface FallbackFunction<T extends NonNullable<unknown>> {
  /** Unwraps the `Optional`, return the fallback if the `Optional` was not of type `some`. */
  readonly withFallback: (fallback: T) => T;
}

/** The base interface of any `Optional`. */
export interface OptionalBase<T extends NonNullable<unknown>> {
  /** The Type that this result has. Either: "some" or "none". */
  readonly type: string;
  /** Wether or not the `Optional` is of type `some`. */
  readonly isSome: () => this is SomeOptional<T>;
  /** Wether or not the `Optional` is of type `none`. */
  readonly isNone: () => this is NoneOptional<T>;
  /** Returns a string representation of the object. */
  readonly toString: () => string;
  /** Transforms the `Optional` to a `Result`. */
  readonly toResult: () => Result<T>;
  /** Unwraps the `Optional`, exits the process if the result was not of type `Some`. */
  readonly unwrap: (() => T | never) & FallbackFunction<T>;
}

/** The interface of the `error` result variant. */
export interface NoneOptional<T extends NonNullable<unknown>> extends OptionalBase<T> {
  readonly type: 'none';
  readonly toResult: () => ErrorResult<T>;
  readonly unwrap: (() => never) & FallbackFunction<T>;
}

/** The interface of the `ok` result variant. */
export interface SomeOptional<T extends NonNullable<unknown>> extends OptionalBase<T> {
  readonly type: 'some';
  readonly toResult: () => OkResult<T>;
  readonly unwrap: (() => T) & FallbackFunction<T>;
  /** The value the was returned from execution of the function. */
  readonly value: T;
}

/**
 * The `Optional` enum HEAVILY inspired by rust.
 */
export type Optional<T extends NonNullable<unknown>> = NoneOptional<T> | SomeOptional<T>;

/**
 * The `Optional` enum HEAVILY inspired by rust.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-redeclare
export namespace Optional {
  /** Creates an `some` variant of the `Optional`. */
  export const some = function some<T extends NonNullable<unknown>>(value: T): SomeOptional<T> {
    return {
      isNone: (): this is NoneOptional<T> => false,
      isSome: (): this is SomeOptional<T> => true,
      toResult: () => Result.ok(value),
      toString: () => `Optional.some(${typeof value})`,
      type: 'some',
      unwrap: Object.assign(() => value, {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        withFallback(_fallback: T) {
          return value;
        },
      }),
      value,
    };
  };

  /** Creates an `error` result. */
  export const none = Object.defineProperty(
    // eslint-disable-next-line prefer-arrow-callback
    function none<T extends NonNullable<unknown>>(): NoneOptional<T> {
      return {
        isNone: (): this is NoneOptional<T> => true,
        isSome: (): this is SomeOptional<T> => false,
        toResult: () => Result.error(new NoSuchElementError),
        toString: () => `Optional.none()`,
        type: 'none',
        unwrap: Object.assign(
          // eslint-disable-next-line no-restricted-syntax
          (): never => {
            Logger.critical(`Unwrap called on failed Optional without fallback.`);
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
    },
    'name',
    {
      configurable: true,
      value: 'Optional.none',
    }
  );

  /**
   * Wraps execution of a function, returning a `Optional` in all cases. Used for when you know a function can fail,
   * but have no control over it because for example it is imported from a library. If you do have control over the
   * function you can implement it returning an `Optional` as normal.
   */
  export const exec = Object.defineProperty(
    // eslint-disable-next-line prefer-arrow-callback
    function exec<P extends readonly unknown[], R>(
      fn: (...params: P) => R,
      ...params: P
    ): Optional<R & {}> {
      try {
        const result = fn(...params);
        // eslint-disable-next-line no-undefined
        if (result !== undefined && result !== null) return some(result);
        return none();
      } catch (error) {
        Logger.error(error);
        return none();
      }
    },
    'name',
    {
      configurable: true,
      value: 'Optional.exec',
    }
  );
}
