import { MarkupRenderer } from '#lib/core/markup/class';

/**
 * A `MarkupRenderer` for that just returns an lowercase version of it's input.
 */
@MarkupRenderer.register.using({ aliases: ['LowerMarkupRenderer'], plugin: false })
export class LowerCaseMarkupRenderer extends MarkupRenderer {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public render(input: string): string {
    return input.toLowerCase();
  }
}
