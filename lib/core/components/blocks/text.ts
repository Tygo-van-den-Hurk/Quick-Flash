import { Component } from '#lib/core/components/class';

/**
 * A component that just shows text.
 */
@Component.register
export class Text extends Component {
  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Readonly<Component.ConstructorArguments>) {
    super(args);
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Readonly<Component.RenderArguments>): string {
    if (!children) {
      throw new Error(
        `${Text.name} at ${this.path.join('.')} expected to have children, but found none.`
      );
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `<p>${children()}</p>`;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component['hierarchy']> {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return [2, '+'];
  }
}
