import * as componentUtils from '#lib/core/components/utils';
import type {
  ComponentConstructorArguments,
  ComponentInterface,
  ComponentRenderArguments,
  ConstructableComponent,
} from '#lib/core/components/interfaces';
import { FromPascalCase } from '#lib/utils/switch-case';
import { Logger } from '#lib/logger';
import { isSubclass } from '#lib/utils/index';

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
   * The interface which every instance of `Component` has to comply with.
   */
  export type Interface = ComponentInterface;
}

/**
 * The base class of every concreet component.
 */
export abstract class Component implements Component.Interface {
  /** Utils related to components and their workings. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly utils = { ...componentUtils };

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
  public constructor(args: Component.ConstructorArguments) {
    Logger.debug(`constructing ${new.target.name} at ${args.path.join('.')}`);
    this.attributes = args.attributes;
    this.focusMode = args.focusMode;
    this.level = args.level;
    this.path = args.path;
    this.id = args.id;
    if (!this.canBeAtLevel(args.level)) {
      throw new Error(
        `${Component.name} ${new.target.name} at ${this.path.join('.')} cannot be at level ${this.level}. ` +
          `Only at levels: ${this.hierarchy().toString()}`
      );
    }
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

    if (!isSubclass(target, this))
      Logger.warn(`${target.name} does not extend ${Component.name}...`);

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

  // eslint-disable-next-line jsdoc/require-jsdoc
  public canBeAtLevel(level: number): boolean {
    const hierarchy = this.hierarchy();
    if (hierarchy === '*') return true;
    if (hierarchy.includes(level)) return true;

    const hasPlus = hierarchy[hierarchy.length - 1] === '+';
    // eslint-disable-next-line no-ternary
    const numbers = hasPlus // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      ? (hierarchy.slice(0, -1) as number[]) // eslint-disable-line @typescript-eslint/no-unsafe-type-assertion
      : (hierarchy as unknown as number[]); // eslint-disable-line @typescript-eslint/no-unsafe-type-assertion
    const highestNumber = Math.max(...numbers);
    if (hasPlus && highestNumber < level) return true;

    return false;
  }

  public abstract hierarchy(): ReturnType<Component.Interface['hierarchy']>;
  public abstract render(arg0: Component.RenderArguments): ReturnType<Component.Interface['render']>;
}
