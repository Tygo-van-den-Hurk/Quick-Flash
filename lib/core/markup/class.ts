import type {
  ConstructableMarkupRenderer,
  MarkupRendererInterface,
} from '#lib/core/markup/interfaces';
import { FromPascalCase } from '#lib/utils/switch-case';
import { Logger } from '#lib/logger';
import { isSubclass } from '#lib/utils/index';

/**
 * The base class for any `MarkupRenderer`.
 */
export abstract class MarkupRenderer implements MarkupRendererInterface {
  /**
   * Keeps track of all `MarkupRenderer`s that have been added using `@MarkupRenderer.register`.
   */
  private static registry: Record<string, undefined | ConstructableMarkupRenderer> = {};

  /**
   * Retrieves a `MarkupRenderer` by name from the `Registry`.
   */
  public static retrieve = (name: string): ConstructableMarkupRenderer | undefined =>
    MarkupRenderer.registry[name];

  /**
   * Registers a `MarkupRenderer` by the class name in the general registry.
   */
  // eslint-disable-next-line no-restricted-syntax
  public static register = <T extends ConstructableMarkupRenderer>(target: T): T => {
    let printed = false;

    if (!isSubclass(target, this))
      Logger.warn(`${target.name} does not extend ${MarkupRenderer.name}...`);

    if (MarkupRenderer.registry[target.name]) {
      Logger.warn(`The markup renderer ${target.name} is being overwritten...`);
      printed = true;
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
      if (!printed && MarkupRenderer.registry[name])
        Logger.warn(`The markup renderer ${name} is being overwritten...`);
      Logger.debug(`Added markup renderer: ${name}`);
      MarkupRenderer.registry[name] = target;
    }

    return target;
  };

  /**
   * Retrieves the keys registered `MarkupRenderer`s in the `Registry`.
   */
  public static keys = function keys(): readonly string[] {
    return Object.keys(MarkupRenderer.registry);
  };

  public abstract render(input: string): string;
}
