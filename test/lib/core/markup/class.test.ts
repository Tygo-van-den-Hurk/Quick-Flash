import { describe, expect, test } from 'vitest';
import { MarkupRenderer } from '#lib/core/markup/class';

describe('implements MarkupRender', () => {
  test(`garbage is not found`, () => {
    // eslint-disable-next-line no-undefined
    expect(MarkupRenderer.retrieve('GAR8AG3')).toBe(undefined);
  });

  test(`MarkupRenderer.Keys() includes the name of a class we register`, () => {
    @MarkupRenderer.register
    class ABCDEFG implements MarkupRenderer {
      // eslint-disable-next-line @typescript-eslint/class-methods-use-this
      public render = (input: string): string => input;
    }

    expect(MarkupRenderer.keys()).includes(ABCDEFG.name);
    expect(MarkupRenderer.retrieve(ABCDEFG.name)).toBe(ABCDEFG);
  });
});
