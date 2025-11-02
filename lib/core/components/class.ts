import type {
  ComponentConstructorArguments,
  ComponentInterface,
  ComponentRenderArguments,
} from '#lib/core/components/interfaces';
import { FromPascalCase } from '#lib/utils/switch-case';
import { Logger } from '#lib/logger';

type ConstructableComponent = new (
  arg0: Readonly<ComponentConstructorArguments>
) => ComponentInterface;

/**
 * The base class of every concreet component.
 */
export abstract class Component implements ComponentInterface {
  /**
   * Keeps track of all components that have been added using `@Component.register`.
   */
  private static registry: Record<string, undefined | ConstructableComponent> = {};

  public readonly attributes;
  public readonly focusMode;
  public readonly level;
  public readonly path;
  public readonly id;

  /**
   * Creates a new `Component` from the arguments provided.
   */
  public constructor(args: Readonly<ComponentConstructorArguments>) {
    this.attributes = args.attributes;
    this.focusMode = args.focusMode;
    this.level = args.level;
    this.path = args.path;
    this.id = args.id;
  }

  /**
   * Retrieves a `Component` by name from the `Registry`.
   */
  public static retrieve = (name: string): ConstructableComponent | undefined =>
    Component.registry[name];

  /**
   * Registers a component by the class name in the general registry.
   */
  // eslint-disable-next-line no-restricted-syntax
  public static register = <T extends ConstructableComponent>(target: T): T => {
    let printed = false;

    if (Component.registry[target.name]) {
      Logger.warn(`The component ${target.name} is being overwritten...`);
      printed = true;
    }

    const names = [
      ...new Set([
        target.name,
        FromPascalCase.toKebabCase(target.name),
        FromPascalCase.toSnakeCase(target.name),
        target.name.toLowerCase(),
        target.name.toUpperCase(),
      ]),
    ];

    for (const name of names) {
      if (!printed && Component.registry[name])
        Logger.warn(`The component ${name} is being overwritten...`);
      Logger.debug(`Added component: ${name}`);
      Component.registry[name] = target;
    }

    return target;
  };

  /**
   * Retrieves the keys registered `Component`s in the `Registry`.
   */
  public static keys = function keys(): readonly string[] {
    return Object.keys(Component.registry);
  };

  public abstract hierarchy(): ReturnType<ComponentInterface['hierarchy']>;
  public abstract render(arg0: Readonly<Component.RenderArguments>): string;
}

/**
 * The base class of every concreet component.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Component {
  /**
   * The arguments to provide to the constructor of a component.
   */
  export type ConstructorArguments = ComponentConstructorArguments;

  /**
   * The arguments to provide to the render function.
   */
  export type RenderArguments = ComponentRenderArguments;

  /**
   * The base class of every concreet component.
   */
  export type Interface = ComponentInterface;
}
