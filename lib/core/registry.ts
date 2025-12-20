/**
 * A registry is a place where a class can store all it's possible variants by name. This is used
 * for `Component`, `MarkupRenderers`, etc. to store which possible variants exist. Because this way
 * one can later find and create instances of that subclass.
 *
 * **Example**
 *
 * Let's say you'd want to implement this for component, then you can use this example:
 *
 * ```TypeScript
 * // Start by injecting the registry...
 * const Component = Registry.inject(
 *   class Component {
 *     ...
 *   }
 * );
 *
 * \@Component.register
 * class Text extends Component {}
 *
 * \@Component.register.using({ name: "Point" })
 * class BulletPointComponent extends Component {}
 *
 * \@Component.register.using({ aliases: ['Img'] })
 * class Image extends Component {}
 *
 * \@Component.register.using({ plugin: true })
 * class Plugin extends Component {}
 * ```
 *
 * See the register function definition for the defaults.
 */
//
import type { DeepReadonly, RequireAll } from '#lib/types';
import { FromPascalCase } from '#lib/utils/index';
import { Logger } from '#lib/logger';

/**
 * Adds a bunch of variations of a given name in the array such as upper case, lower case kebab-case...
 * Exported purely for testing.
 */
export const createVariations = function createVariations(
  names: readonly string[],
  extensiveAliases: boolean
): readonly string[] {
  return names.reduce<readonly string[]>(
    (previous, value) => [
      ...previous,
      value.toLowerCase(),
      value.toUpperCase(),
      // eslint-disable-next-line no-ternary
      ...(extensiveAliases
        ? [FromPascalCase.toKebabCase(value), FromPascalCase.toSnakeCase(value)]
        : []),
      value,
    ],
    []
  );
};

/**
 * Adds a bunch of variations of a given name in the array such as upper case, lower case kebab-case...
 * Exported purely for testing.
 */
export const createVariationsByRemovingSubstring = function createVariationsByRemovingSubstring(
  names: readonly string[],
  substrings: readonly string[]
): readonly string[] {
  return names.reduce<readonly string[]>(
    (previous, value) => [
      ...substrings.map((substring) => value.replace(substring, '')),
      ...previous,
      value,
    ],
    []
  );
};

/**
 * Adds the `slyde` or `plugin` namespace prefix to a list of given names. Exported purely for testing.
 */
export const addXmlNameSpace = function addXmlNameSpace(
  names: readonly string[],
  plugin: boolean
): readonly string[] {
  const prefix = plugin ? 'plugin' : 'slyde'; // eslint-disable-line no-ternary
  return names.reduce<readonly string[]>(
    (previous, value) => [
      ...previous,
      ...createVariations([prefix], true).map((pre) => `${pre}:${value}`),
      value,
    ],
    []
  );
};

/** A type any concreet class would have. As they all have a constructor.*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ConcreetClass<T> = new (...args: any[]) => T;

/** A type any abstract class would have. As they all have a constructor.*/
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractClass<T> = abstract new (...args: any[]) => T;

/** A type any class would have. As they all have a constructor.*/
export type Class<T> = ConcreetClass<T> | AbstractClass<T>;

/** The interface the constructor of a `Registry` expects. */
export interface RegistryConstructorArguments {
  /** The name of the `Registry`. */
  readonly name: string;

  /**
   * A list of substrings that may appear in any registered element's identifier.
   * For each element, the registry will automatically create aliases by removing these substrings,
   * making it easier to access elements using shorter or simplified names.
   */
  readonly substrings?: readonly string[];

  /** The possible substrings any registered element could have. An alias will automatically be created */
  readonly extensiveAliases?: boolean;
}

/** A class that has registry functions. */
export type ClassAugmentedWithRegistry<C extends Class<object>> = C & {
  /** The internal registry. */
  registry: Registry<ConcreetClass<InstanceType<C>>>;
  /** Add a member from the internal registry using the default parameters. */
  register: Registry<ConcreetClass<InstanceType<C>>>['register'];
  /** Get a member from the internal registry by name. */
  retrieve: Registry<ConcreetClass<InstanceType<C>>>['retrieve'];
  /** Add a member to the internal registry. */
  add: Registry<ConcreetClass<InstanceType<C>>>['add'];
  /** Get the keys of all registered members. */
  keys: Registry<ConcreetClass<InstanceType<C>>>['keys'];
};

/** A class to register and retrieve classes by name. */
export class Registry<
  T extends ConcreetClass<object>,
> implements RequireAll<RegistryConstructorArguments> {
  /** Injects a registry instance and it's methods to a class. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly inject = Object.assign(
    <C extends Class<object>>(cls: C): ClassAugmentedWithRegistry<C> =>
      Registry.injectHelper<C>(cls, { name: cls.name }),
    {
      using:
        (opts: Partial<RegistryConstructorArguments>) =>
        <C extends Class<object>>(cls: C): ClassAugmentedWithRegistry<C> =>
          Registry.injectHelper<C>(cls, {
            ...opts,
            name: opts.name ?? cls.name,
          }),
    }
  );

  /** The master Registry that holds all the registers. */
  private static readonly MASTER: Record<string, Registry<ConcreetClass<object>> | undefined> = {};

  public readonly extensiveAliases: RequireAll<RegistryConstructorArguments>['extensiveAliases'];
  public readonly substrings: RequireAll<RegistryConstructorArguments>['substrings'];
  public readonly name: RequireAll<RegistryConstructorArguments>['name'];

  /**
   * Decorator that can be used in multiple ways:
   * - `@Class.register`: directly as decorator, uses class name to register.
   * - `@Class.register.using({ name: "NewName" })`: allows you to override the name it will be registered as.
   * - `@Class.register.using({ plugin: true })`: allows you to register it as a plugin or not.
   * - `@Class.register.using({ aliases: ['alias1', 'alias2'] })`: called with custom aliases
   */
  public readonly register = Object.assign(<C extends T>(target: C): C => this.add<C>(target), {
    using:
      (opts: Partial<Parameters<Registry<ConcreetClass<object>>['add']>[1]> = {}) =>
      <C extends T>(target: C): C =>
        this.add<C>(target, opts),
  });

  /** The internal registry of a `Registry`. */
  private readonly registry: Record<string, T | undefined> = {};

  /** Creates a new `Registry` of type `T`. */
  public constructor({
    name,
    substrings = [name],
    extensiveAliases = true,
  }: RegistryConstructorArguments) {
    this.extensiveAliases = extensiveAliases;
    this.substrings = createVariations(substrings, extensiveAliases);
    this.name = name;
  }

  /** Retrieves a `Registry` from the master registry. */
  public static readonly retrieve = (
    name: string
  ):
    | (DeepReadonly<Registry<ConcreetClass<object>>> & {
        keys: Registry<ConcreetClass<object>>['keys'];
      })
    | undefined => Registry.MASTER[name];

  /** Injects a `Registry` into a given class, and returns the result. */
  private static injectHelper<C extends Class<object>>(
    cls: C,
    opts: Partial<RegistryConstructorArguments>
  ): ClassAugmentedWithRegistry<C> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const augmented = cls as unknown as ClassAugmentedWithRegistry<C>;
    const name = opts.name ?? cls.name;
    augmented.registry = new Registry<ConcreetClass<InstanceType<C>>>({ ...opts, name });
    augmented.retrieve = augmented.registry.retrieve;
    augmented.register = augmented.registry.register;
    augmented.keys = augmented.registry.keys;
    augmented.add = augmented.registry.add;

    let variants = [name, `${name}s`] as readonly string[];
    variants = createVariationsByRemovingSubstring(variants, opts.substrings ?? []);
    variants = createVariations(variants, true);
    for (const variant of new Set(variants)) {
      if (['', 's', 'S'].includes(variant)) continue;
      if (Registry.MASTER[variant]) Logger.warn(`A 2nd Registry by name ${variant} was created.`);
      Registry.MASTER[variant] = augmented.registry;
    }

    return augmented;
  }

  /** Adds a `T` and all its aliases to this registry. */
  // eslint-disable-next-line no-restricted-syntax
  public readonly add = <C extends T>(
    target: C,
    {
      name = target.name,
      aliases = [],
      plugin = true,
    }: {
      readonly aliases?: readonly string[];
      readonly name?: string;
      readonly plugin?: boolean;
    } = {}
  ): C => {
    let variants = [...aliases, name] as readonly string[];
    variants = createVariationsByRemovingSubstring(variants, this.substrings);
    variants = createVariations(variants, this.extensiveAliases);
    variants = addXmlNameSpace(variants, plugin);

    // Register all the new keys in the registry
    for (const variant of new Set(variants)) {
      const warning = `The ${this.name} named "${variant}" is being overwritten...`;
      if (this.registry[variant]) Logger.warn(warning);
      Logger.debug(`Added a ${this.name} named "${variant}"`);
      this.registry[variant] = target;
    }

    return target;
  };

  /** Retrieves a `T` by name from this `Registry`. */
  public readonly retrieve = (name: string): T | undefined => this.registry[name];

  /** Retrieves all the keys registered in this `Registry`. */
  public readonly keys = (): readonly string[] => Object.keys(this.registry);
}
