import { describe, expect, test } from 'vitest';
import { PlainMarkupRenderer } from '#lib/core/markup/languages/plain';

describe('class PlainMarkupRenderer implements MarkupRender', () => {
  test(`rendering an empty string to see if it stays a literal`, () => {
    const input = '';
    const result = new PlainMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  test('rendering text with no markers', () => {
    const input = 'just plain text here';
    const result = new PlainMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  test(`rendering a marked for bold word`, () => {
    const input = `**word**`;
    const result = new PlainMarkupRenderer().render(input);
    expect(result).toBe(input);
  });
});
