import { Component } from '#lib/core/components/class';

/**
 * A `Slide` with on it a call to ask questions to the presentor.
 */
@Component.register
export class QuestionSlide extends Component {
  /** The title of this slide. */
  public readonly title: string;

  // eslint-disable-next-line jsdoc/require-jsdoc
  public constructor(args: Readonly<Component.ConstructorArguments>) {
    super(args);
    this.title = args.attributes.title ?? 'Questions?';
  }

  // eslint-disable-next-line jsdoc/require-jsdoc
  public render({ children }: Readonly<Component.RenderArguments>): string {
    // eslint-disable-next-line no-inline-comments
    return /*HTML*/ `
      <div style="height:100%;width:100%;display:flex;justify-content:center;align-items: center;">
        <h2>${this.title}</h2>
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
