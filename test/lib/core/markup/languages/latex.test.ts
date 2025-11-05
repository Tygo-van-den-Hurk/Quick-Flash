import { describe, expect, test } from 'vitest';
import { LatexRenderer } from '#lib/core/markup/languages/latex';

describe('class LatexRenderer extends MarkupRender', () => {
  test('renders latex into something else', () => {
    const input = `{x\\over2}`;
    const result = new LatexRenderer().render(`$${input}$`);
    expect(result).not.toBe(input);
  });
});
