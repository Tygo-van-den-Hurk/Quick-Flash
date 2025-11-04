import { describe, expect, test } from 'vitest';
import { SlydeMarkupRenderer } from '#lib/core/markup/languages/slyde';

describe('class SlydeMarkup implements MarkupRender', () => {
  const markers = ['*', '/', '^', '_', '`', '~'] as const;

  const tags: Record<(typeof markers)[number], { open: string; close: string }> = {
    '*': { close: '</b>', open: '<b>' },
    '/': { close: '</i>', open: '<i>' },
    '^': { close: '</sup>', open: '<sup>' },
    _: { close: '</u>', open: '<u>' }, // eslint-disable-line id-length
    '`': { close: '</code>', open: '<code>' },
    '~': { close: '</s>', open: '<s>' },
  };

  test('rendering italic and urls', () => {
    const input = `this is an HTTP URL: http://example.com/ this is an HTTPS URL: https://example.com/`;
    const result = new SlydeMarkupRenderer().render(input);
    expect(result).toBe(input);
  });

  for (const marker of markers) {
    const nextMarker = markers[(markers.indexOf(marker) + 1) % markers.length];
    const prevMarker = markers[(markers.indexOf(marker) + markers.length - 3) % markers.length];

    test(`rendering an empty string to see if it stays a literal`, () => {
      const input = '';
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(input);
    });

    test('rendering text with no markers', () => {
      const input = 'just plain text here';
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(input);
    });

    test(`rendering a marked word`, () => {
      const input = `${marker}${marker}word${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`${tags[marker].open}word${tags[marker].close}`);
    });

    test(`rendering a marked word inside of a sentence"`, () => {
      const input = `something ${marker}${marker}word${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`something ${tags[marker].open}word${tags[marker].close}`);
    });

    test(`rendering with a marker nested inside of a word`, () => {
      const input = `something word${marker}${marker}word${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`something word${tags[marker].open}word${tags[marker].close}`);
    });

    test(`rendering an escaped marker reverts to a literal"`, () => {
      const input1 = `something not \\${marker}${marker}word${marker}${marker}`;
      const result1 = new SlydeMarkupRenderer().render(input1);
      expect(result1).toBe(input1);
      const input2 = `something not ${marker}\\${marker}word${marker}${marker}`;
      const result2 = new SlydeMarkupRenderer().render(input2);
      expect(result2).toBe(input2);
      const input3 = `something not ${marker}${marker}word\\${marker}${marker}`;
      const result3 = new SlydeMarkupRenderer().render(input3);
      expect(result3).toBe(input3);
      const input4 = `something not ${marker}${marker}word${marker}\\${marker}`;
      const result4 = new SlydeMarkupRenderer().render(input4);
      expect(result4).toBe(input4);
    });

    test('rendering unclosed marker reverts to literal', () => {
      const input = `${marker}${marker}unclosed bold text`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(input);
    });

    test('rendering multiple unclosed markers revert to literals', () => {
      const input = `${marker}${marker}bold ${nextMarker}${nextMarker}italic`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(input);
    });

    test('rendering same marker cannot nest within itself', () => {
      const input = `${marker}${marker}outer ${marker}${marker}inner${marker}${marker} outer${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(
        `${tags[marker].open}outer ${marker}${marker}inner${tags[marker].close} outer${marker}${marker}`
      );
    });

    test('rendering same marker on different lines', () => {
      const input = `${marker}${marker}line 1
      line 2${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`${tags[marker].open}line 1
      line 2${marker}${marker}`);
    });

    test('rendering adjacent markers', () => {
      const input = `${marker}${marker}bold${marker}${marker}${marker}${marker}more bold${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(
        `${tags[marker].open}bold${tags[marker].close}${tags[marker].open}more bold${tags[marker].close}`
      );
    });

    test('rendering escaped backslash before marker', () => {
      const input = `\\\\${marker}${marker}word${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`\\\\${tags[marker].open}word${tags[marker].close}`);
    });

    test('rendering marker at end of string (unclosed)', () => {
      const input = `text ${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(input);
    });

    test('rendering mixed escaped and unescaped markers', () => {
      const input = `\\${marker}${marker}not styled${marker}${marker} ${marker}${marker}styled${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(
        `\\${marker}${marker}not styled${marker}${marker} ${tags[marker].open}styled${tags[marker].close}`
      );
    });

    test('rendering marker followed immediately by escaped marker', () => {
      const input = `${marker}${marker}\\${marker}${marker}text${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(`${tags[marker].open}\\${marker}${marker}text${tags[marker].close}`);
    });

    // These markers have special properties.
    if (['``'].includes(`${nextMarker}${nextMarker}`)) {
      test('rendering markers in "code blocks" are literal', () => {
        const input = `${marker}${marker}code ${nextMarker}${nextMarker}bold${nextMarker}${nextMarker} ${prevMarker}${prevMarker}italic${prevMarker}${prevMarker}${marker}${marker}`;
        const result = new SlydeMarkupRenderer().render(input);
        expect(result).toBe(
          `${tags[marker].open}code ${nextMarker}${nextMarker}bold${nextMarker}${nextMarker} ${prevMarker}${prevMarker}italic${prevMarker}${prevMarker}${tags[marker].close}`
        );
      });

      continue;
    }

    test(`rendering "something ${marker}${marker}word ${nextMarker}${nextMarker}word${marker}${marker}${nextMarker}${nextMarker}"`, () => {
      const input = `something ${marker}${marker}word ${nextMarker}${nextMarker}word${marker}${marker}${nextMarker}${nextMarker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(
        `something ${tags[marker].open}word ${nextMarker}${nextMarker}word${tags[marker].close}${nextMarker}${nextMarker}`
      );
    });

    test(`rendering "something ${marker}${marker}word ${nextMarker}${nextMarker}word${nextMarker}${nextMarker}${marker}${marker}"`, () => {
      const input = `something ${marker}${marker}word ${nextMarker}${nextMarker}word${nextMarker}${nextMarker}${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(
        `something ${tags[marker].open}word ${tags[nextMarker].open}word${tags[nextMarker].close}${tags[marker].close}`
      );
    });

    // These markers have special properties.
    if (['``'].includes(`${nextMarker}${nextMarker}`)) continue;

    test('rendering multiple properly nested markers', () => {
      const input = `${marker}${marker}word ${nextMarker}${nextMarker}word ${prevMarker}${prevMarker}word${prevMarker}${prevMarker}${nextMarker}${nextMarker}${marker}${marker}`;
      const result = new SlydeMarkupRenderer().render(input);
      expect(result).toBe(
        `${tags[marker].open}word ${tags[nextMarker].open}word ${tags[prevMarker].open}word${tags[prevMarker].close}${tags[nextMarker].close}${tags[marker].close}`
      );
    });
  }
});
