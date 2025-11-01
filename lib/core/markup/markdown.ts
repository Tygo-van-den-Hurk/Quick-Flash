import { Marked } from 'marked';
import type { MarkupRenderer } from '#lib/core/markup/index';
import { Registry } from '#lib/core/registry';

const parser = new Marked({
  breaks: false,
  gfm: true,
  renderer: {
    heading({ }) { return ''; },
    paragraph({ tokens }) { 
      return this.parser.parseInline(tokens);
    },
    blockquote() { return ''; },
    list() { return ''; },
    listitem() { return ''; },
    hr() { return ''; },
    table() { return ''; },
    tablerow() { return ''; },
    tablecell() { return ''; },
    html() { return ''; },
    link({ tokens }) { 
      return this.parser.parseInline(tokens);
    },
    image() { return ''; },
  }
});

/**
 * A `MarkupRenderer` for Markdown.
 */
@Registry.MarkupRenderer.add
export class MarkdownRenderer implements MarkupRenderer {
  public readonly registerKeys = () => [ "Markdown" ];

  public render(input: string): string {
    return parser.parse(input, { async: false });
  }
}
