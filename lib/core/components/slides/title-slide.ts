import { Component, Registry } from '#lib';

/**
 * A `Slide` with the title and possibly the author
 */
@Registry.Component.add
export class TitleSlide extends Component {
  /** The title of this slide. */
  public readonly title: string;

  /** The author under the title. */
  public readonly authors?: readonly string[];

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Readonly<Component.ConstructorArguments>) {
    super(args);
    this.title = args.attributes.title ?? 'Questions?';

    if (typeof args.attributes.authors === 'string') {
      this.authors = args.attributes.authors.split(',');
    } else if (typeof args.attributes.author === 'string') {
      this.authors = [args.attributes.author];
    }
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Readonly<Component.RenderArguments>): string {
    let authors = '';

    if (this.authors)
      authors = /*HTML*/ `
      <p>
        ${this.authors.join('<br>')}
      </p>
    `;

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div style="height:100%;width:100%;display:flex;justify-content:center;align-items: center;">
        <h2>${this.title}</h2>
        ${authors}
        ${children?.() ?? ''}
      </div>
    `;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component['hierarchy']> {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return [2];
  }
}
