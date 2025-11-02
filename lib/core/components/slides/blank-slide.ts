import { Component } from '#lib/core/components/class';

/**
 * The `Slide` object. Should be the standard 2nd tier object.
 */
@Component.register
export class BlankSlide extends Component {
  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Readonly<Component.ConstructorArguments>) {
    super(args);
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Readonly<Component.RenderArguments>): string {
    if (children) {
      throw new Error(
        `Expected ${BlankSlide.name} at ${this.path.join('.')} to not have children, but found some.`
      );
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div style="height:100%;width:100%"> 
        <!-- Blank Slide... -->
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component['hierarchy']> {
    return [1];
  }
}
