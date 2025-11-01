/**
 * The arguments to provide to the constructor of a component.
 */
interface ComponentConstructorArguments {
  /**
   * The ID given to a component at creation. This will be the ID that it will have in the final document, and
   * specifies the focus order, and creation order that happend. Allows you to
   */
  readonly id: string;

  /**
   * The focus behaviors that this component will have, as specified in the source document.
   * - **follows**: as long as this component or any of it's children have focus, it has focus.
   * - **default**: This component will not share its focus group with it's children unless it's parents specify
   *   otherwise, in which case it will behave as it's parents specified.
   * - **group**: as long as this component or any of it's children have focus, it and all of its children all have
   *   focus.
   */
  readonly focusMode: 'follows' | 'default' | 'group';

  /**
   * The attributes a component got in the source file. So for example:
   *
   * ```XML
   * <component attr1="val1" attr2="val2" ... />
   * ```
   *
   * becomes the following record:
   *
   * ```YAML
   * { attr1: "val1", attr2: "val2", ... }
   * ```
   *
   * it is up to the component to look for them in the constructor and enforce that all required ones are there.
   */
  attributes: Readonly<Record<string, string | undefined>>;

  /**
   * The path at which this element is located.
   */
  path: readonly string[];

  /**
   * How deep the component is in the tree. For example if we look at the following presentation:
   *
   * ```XML
   * <presentation>
   *   <slide>
   *     <point>Because Slyde is amazing</point>
   *   </slide>
   * </presentation>
   * ```
   *
   * Then presentation has a level of `0`, slide a level of `1`, and point a level of `2`.
   */
  level: number;
}

/**
 * The arguments to provide to the render function.
 */
interface ComponentRenderArguments {
  /**
   * Renders the children to HTML to and returns the output. If the component has no children then this function is
   * missing.
   */
  children?: () => string;
}

interface ComponentInterface extends ComponentConstructorArguments {
  /**
   * Render this component to HTML.
   */
  render: (argo0: Readonly<ComponentRenderArguments>) => string;

  /**
   * The levels at which this component is allowed to be used. End with a plus to allow any level deeper then the last
   * mentioned level. Cannot be empty, or only contain a plus. Use `['*']` to allow all levels.
   */
  hierarchy: () =>
    | readonly [number, ...number[]]
    | readonly [...[number, ...number[]], '+']
    | ['*'];
}

/**
 * The base class of every concreet component.
 */
export abstract class Component implements ComponentInterface {
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
}
