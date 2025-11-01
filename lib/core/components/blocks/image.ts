// eslint-disable-next-line max-classes-per-file
import { Component, Logger, Registry } from '#lib';

/**
 * The `Image` component. Shows an image.
 */
@Registry.Component.add
export class Image extends Component {
  /**
   * The source of the image.
   */
  public readonly source: string;

  /**
   * The description of the image.
   */
  public readonly description?: string;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Readonly<Component.ConstructorArguments>) {
    super(args);

    if (typeof args.attributes.source === 'string') {
      this.source = args.attributes.source;
    } else if (typeof args.attributes.src === 'string') {
      this.source = args.attributes.src;
    } else {
      throw new Error(`${Image.name} at ${this.path.join('.')} is missing attribute 'source'.`);
    }

    if (typeof args.attributes.description === 'string') {
      this.description = args.attributes.description;
    } else if (typeof args.attributes.alt === 'string') {
      this.description = args.attributes.alt;
    } else {
      Logger.warn(`${Image.name} at ${this.path.join('.')} is missing attribute 'description'.`);
    }

    this.description = args.attributes.description;
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render(): string {
    const description = this.description ?? '';
    const { source } = this;

    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `<img src="${source}" alt="${description}">`;
  }

  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public hierarchy(): ReturnType<Component['hierarchy']> {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return [3, '+'];
  }
}

/**
 * The `img` component. Shows an image. Alias for `Image`
 */
@Registry.Component.add
export class Img extends Image {
  // Just functions as an alias to <image>.
}
