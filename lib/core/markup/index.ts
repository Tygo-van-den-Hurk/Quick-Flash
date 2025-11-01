import { Registerable } from '#lib/core/registry';

export * from '#lib/core/markup/slyde';
export * from '#lib/core/markup/markdown';

/**
 * The interface for any `MarkupRender`.
 */
export interface MarkupRenderer extends Registerable {
  render: (input: string) => string;
}
