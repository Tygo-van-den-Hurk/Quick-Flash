import { FromPascalCase } from '#lib/utils/switch-case';
import { Logger } from '#lib/logger';

/**
 * The interface for any `MarkupRender`.
 */
export interface MarkupRenderer {
  render: (input: string) => string;
}

type MarkRender = MarkupRenderer;

/**
 * The interface for any `MarkupRender`.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MarkupRenderer {
  type ConstructableMarkupRenderer<T> = new () => T & MarkRender;

  const registry: Record<string, ConstructableMarkupRenderer<MarkRender> | undefined> = {};

  /**
   * Registers a component by the class name in the general registry.
   */
  export const register = function register<T extends MarkRender>(
    target: new () => T & MarkRender
  ): typeof target {
    let printed = false;

    if (registry[target.name]) {
      printed = true;
      Logger.warn(`The markup renderer ${target.name} is being overwritten...`);
    }

    const names = [
      ...new Set([
        target.name,
        FromPascalCase.toKebabCase(target.name),
        FromPascalCase.toSnakeCase(target.name),
        target.name.toLowerCase(),
        target.name.toUpperCase(),
        target.name.replace(/(?:renderer|markup)/giu, ''),
        FromPascalCase.toKebabCase(target.name.replace(/(?:renderer|markup)/giu, '')),
        FromPascalCase.toSnakeCase(target.name.replace(/(?:renderer|markup)/giu, '')),
        target.name.replace(/(?:renderer|markup)/giu, '').toLowerCase(),
        target.name.replace(/(?:renderer|markup)/giu, '').toUpperCase(),
      ]),
    ];

    for (const name of names) {
      if (!printed && registry[name])
        Logger.warn(`The markup renderer ${name} is being overwritten...`);
      Logger.debug(`Added markup renderer: ${name}`);
      registry[name] = target;
    }

    return target;
  };

  /**
   * Retrieves a `MarkupRenderer` by name from the `Registry`.
   */
  export const retrieve = function retrieve(
    name: string
  ): ConstructableMarkupRenderer<MarkRender> | undefined {
    return registry[name];
  };

  /**
   * Retrieves the keys registered `MarkupRenderer`s in the `Registry`.
   */
  export const keys = function keys(): readonly string[] {
    return Object.keys(registry);
  };
}
