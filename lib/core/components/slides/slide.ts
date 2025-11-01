import { Component, Registry } from '#lib';

/**
 * The `Slide` object. Should be the standard 2nd tier object.
 */
@Registry.Component.add
export class Slide extends Component {
  /** The title of this slide. */
  public readonly title?: string;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Readonly<Component.ConstructorArguments>) {
    super(args);
    this.title = args.attributes.title;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Readonly<Component.RenderArguments>): string {
    if (!children) {
      throw new Error(
        `Expected ${Slide.name} at ${this.path.join('.')} to have children, but found none.`
      );
    }

    if (typeof this.title === 'string')
      // eslint-disable-next-line no-inline-comments
      return /*HTML*/ `
      <div style="height:100%;width:100%">
        <h2>${this.title}</h2>
        <div style="width:100%">
          ${children()}
        </div>
      </div>
    `;

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div style="height:100%;width:100%">
        ${children()}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component['hierarchy']> {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return [2];
  }
}
