import { describe, expect, test } from 'vitest';
import { LowerCaseMarkupRenderer } from '#lib/core/markup/languages/lowercase';
import { MarkupRenderer } from '#lib/core/markup/class';

describe('class LowerCaseMarkupRenderer extends MarkupRender', () => {
  test(`is registered in the markup language registry`, () => {
    const expected = LowerCaseMarkupRenderer;
    const result = MarkupRenderer.retrieve(LowerCaseMarkupRenderer.name);
    expect(expected).toBe(result);
  });

  test(`rendering an empty string to see if it stays a literal`, () => {
    const input = '';
    const result = new LowerCaseMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  test('rendering text with no markers', () => {
    const input = 'Just plain TEXT here';
    const result = new LowerCaseMarkupRenderer().render(input);
    expect(result).toBe(input.toLowerCase());
  });

  test(`rendering a marked for bold word`, () => {
    const input = `**Word**`;
    const result = new LowerCaseMarkupRenderer().render(input);
    expect(result).toBe(input.toLowerCase());
  });
});
