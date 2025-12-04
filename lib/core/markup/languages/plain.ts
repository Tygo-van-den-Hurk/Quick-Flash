import { MarkupRenderer } from '#lib/core/markup/class';

const aliases = ['RawMarkupRenderer', 'OffMarkupRenderer'] as const;

/**
 * A `MarkupRenderer` for that just returns it's input.
 */
@MarkupRenderer.register.using({ aliases, plugin: false })
export class PlainMarkupRenderer extends MarkupRenderer {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public render(input: string): string {
    return input;
  }
}
