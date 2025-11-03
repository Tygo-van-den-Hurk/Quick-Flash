import { describe, expect, test } from 'vitest';
import { parseInput } from '#lib/core/compiler/io';
import parseXml from 'xml-parser-xo';

describe('function cleanAndMergeAdjacentTextNodesRecurse', () => {
  test(`Basic parsing`, () => {
    const input = `<Element></Element>`;
    const result = parseInput(input);
    expect(result).toStrictEqual(parseXml(input));
  });

  test(`Basic invalid parsing`, () => {
    const input = `<></>`;
    const fn = (): unknown => parseInput(input);
    expect(fn).toThrow();
  });

  test(`Tag never closed`, () => {
    const input = `<NeverClosed>`;
    const fn = (): unknown => parseInput(input);
    expect(fn).toThrow();
  });
});
