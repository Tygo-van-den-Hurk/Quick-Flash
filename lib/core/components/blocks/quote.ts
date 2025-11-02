import { Component } from '#lib/core/components/class';
import { Logger } from '#lib/logger';

/**
 * The `Quote` component. Shows a quote by somebody.
 */
@Component.register
export class Quote extends Component {
  /**
   * Who said the quote.
   */
  public readonly by: string;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Readonly<Component.ConstructorArguments>) {
    super(args);

    if (typeof args.attributes.by === 'string') {
      this.by = args.attributes.by;
    } else if (typeof args.attributes.cite === 'string') {
      this.by = args.attributes.cite;
    } else {
      Logger.warn(`${Quote.name} at ${this.path.join('.')} is missing attribute "by".`);
      this.by = 'Unknown';
    }
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Readonly<Component.RenderArguments>): string {
    if (!children) {
      throw new Error(
        `Expected ${Quote.name} at ${this.path.join('.')} to have children, but found none.`
      );
    }

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <blockquote cite="https://example.com/source">
        <p>${children()}</p>
        <footer><cite>${this.by}</cite></footer>
      </blockquote>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component['hierarchy']> {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return [3, '+'];
  }
}
