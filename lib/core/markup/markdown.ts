import { Marked } from 'marked';
import { MarkupRenderer } from '#lib/core/markup/interfaces';

const disregard: () => string = () => '';

const parser = new Marked({
  breaks: false,
  gfm: true,
  renderer: {
    blockquote: disregard,
    heading: disregard,
    hr: disregard,
    html: disregard,
    image: disregard,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    link({ tokens }): string {
      return this.parser.parseInline(tokens);
    },
    list: disregard,
    listitem: disregard,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    paragraph({ tokens }): string {
      return this.parser.parseInline(tokens);
    },
    table: disregard,
    tablecell: disregard,
    tablerow: disregard,
  },
});

/**
 * A `MarkupRenderer` for Markdown.
 */
@MarkupRenderer.register
export class MarkdownRenderer implements MarkupRenderer {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public render(input: string): string {
    return parser.parse(input, { async: false });
  }
}
