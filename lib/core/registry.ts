import type { Component as Comp } from '#lib/core/components/index';
import { FromPascalCase, } from '#lib/utils/index';
import { Logger, } from '#lib/logger';
import type { MarkupRenderer as MarkRender } from '#lib/core/markup/index';

/**
 * Anything that is Registerable must implement this interface.
 */
export interface Registerable {
  /**
   * The keys to register this object as.
   */
  registerKeys: () => string[],
}

/**
 * The is the registry for all `Components` and `Plugins`.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Registry {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ COMPONENT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  /**
   * The is the registry for all `Component`s.
   */
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Component {
    type ConstructableComponent<T> = new (args: Readonly<Comp.ConstructorArguments>) => T & Comp;

    const registry: Record<string, ConstructableComponent<Comp> | undefined> = {};

    /**
     * Registers a component by the class name in the general registry.
     */
    export const add = function add<T extends Comp>(
      target: new (args: Comp.ConstructorArguments) => T & Comp
    ): typeof target {
      let printed = false;

      if (registry[target.name]) {
        printed = true;
        Logger.warn(`The component ${target.name} is being overwritten...`);
      }

      const names = [
        target.name,
        FromPascalCase.toKebabCase(target.name),
        FromPascalCase.toSnakeCase(target.name),
        target.name.toLowerCase(),
        target.name.toUpperCase(),
      ] as const;

      for (const name of names) {
        if (!printed) Logger.warn(`The component ${name} is being overwritten...`);
        registry[name] = target;
      }

      return target;
    };

    /**
     * Retrieves a `Component` by name from the `Registry`.
     */
    export const get = function get(name: string): ConstructableComponent<Comp> | undefined {
      return registry[name];
    };

    /**
     * Retrieves the keys registered `Component`s in the `Registry`.
     */
    export const keys = function keys(): readonly string[] {
      return Object.keys(registry);
    };
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ MARKUP RENDERER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

  /**
   * The is the registry for all `MarkupRenderer`s.
   */
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace MarkupRenderer {
    type ConstructableMarkupRenderer<T> = new () => T & MarkRender;

    const registry: Record<string, ConstructableMarkupRenderer<MarkRender> | undefined> = {};

    /**
     * Registers a component by the class name in the general registry.
     */
    export const add = function add<T extends MarkRender>(
      target: new () => T & MarkRender
    ): typeof target {
      let printed = false;

      if (registry[target.name]) {
        printed = true;
        Logger.warn(`The markup renderer ${target.name} is being overwritten...`);
      }

      const names = [
        target.name,
        FromPascalCase.toKebabCase(target.name),
        FromPascalCase.toSnakeCase(target.name),
        target.name.toLowerCase(),
        target.name.toUpperCase(),
      ] as const;

      for (const name of names) {
        if (!printed) Logger.warn(`The component ${name} is being overwritten...`);
        registry[name] = target;
      }

      return target;
    };

    /**
     * Retrieves a `MarkupRenderer` by name from the `Registry`.
     */
    export const get = function get(
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
}
