/* eslint-disable max-classes-per-file */
import { MarkupRenderer } from '#lib/core/markup/class';

/**
 * A `MarkupRenderer` for that just returns it's input.
 */
@MarkupRenderer.register
export class PlainMarkupRenderer extends MarkupRenderer {
  // eslint-disable-next-line @typescript-eslint/class-methods-use-this, jsdoc/require-jsdoc
  public render(input: string): string {
    return input;
  }
}

/**
 * A `MarkupRenderer` for that just returns it's input.
 */
export class RawMarkupRenderer extends PlainMarkupRenderer {}

/**
 * A `MarkupRenderer` for that just returns it's input.
 */
export class OffMarkupRenderer extends PlainMarkupRenderer {}
