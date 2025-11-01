/**
 * A collection of functions to switch between `camelCase` to another case.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FromCamelCase {
  /**
   * Converts a `camelCasedWord` into a `kebab-cased-word`.
   */
  export const toKebabCase = function toKebabCase(str: string): string {
    return str
      .replace(/(?<lower>[a-z0-9])(?<upper>[A-Z])/gu, '$<lower>-$<upper>')
      .replace(/(?<first>[A-Z])(?<second>[A-Z][a-z])/gu, '$<first>-$<second>')
      .toLowerCase();
  };

  /**
   * Converts a `camelCasedWord` into a `snake_cased_word`.
   */
  export const toSnakeCase = function toSnakeCase(str: string): string {
    return str
      .replace(/(?<lower>[a-z0-9])(?<upper>[A-Z])/gu, '$<lower>_$<upper>')
      .replace(/(?<first>[A-Z])(?<second>[A-Z][a-z])/gu, '$<first>_$<second>')
      .toLowerCase();
  };
}

/**
 * A collection of functions to switch between `PascalCase` to another case.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace FromPascalCase {
  // eslint-disable-next-line jsdoc/require-jsdoc
  export const {
    /**
     * Converts a `camelCasedWord` into a `kebab-cased-word`.
     */
    toKebabCase,

    /**
     * Converts a `camelCasedWord` into a `snake_cased_word`.
     */
    toSnakeCase,
  } = FromCamelCase;
}
