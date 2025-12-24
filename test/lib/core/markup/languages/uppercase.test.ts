import { describe, expect, test } from 'vitest';
import { MarkupRenderer } from '#lib/core/markup/class';
import { UpperCaseMarkupRenderer } from '#lib/core/markup/languages/uppercase';

describe('class LowerCaseMarkupRenderer extends MarkupRender', () => {
  test(`is registered in the markup language registry`, () => {
    const expected = UpperCaseMarkupRenderer;
    const result = MarkupRenderer.retrieve(UpperCaseMarkupRenderer.name);
    expect(expected).toBe(result);
  });

  test(`rendering an empty string to see if it stays a literal`, () => {
    const input = '';
    const result = new UpperCaseMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  test('rendering text with no markers', () => {
    const input = 'Just plain TEXT here';
    const result = new UpperCaseMarkupRenderer().render(input);
    expect(result).toBe(input.toUpperCase());
  });

  test(`rendering a marked for bold word`, () => {
    const input = `**Word**`;
    const result = new UpperCaseMarkupRenderer().render(input);
    expect(result).toBe(input.toUpperCase());
  });
});
