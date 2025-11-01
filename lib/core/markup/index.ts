import { Registerable } from '#lib/core/registry';

export * from '#lib/core/markup/slyde';

/**
 * The interface for any `MarkupRender`.
 */
export interface MarkupRenderer extends Registerable {
  render: (input: string) => string;
}
