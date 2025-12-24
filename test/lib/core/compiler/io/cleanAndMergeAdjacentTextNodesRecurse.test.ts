import { describe, expect, test } from 'vitest';
import type { XmlParserElementNode } from 'xml-parser-xo';
import { cleanAndMergeAdjacentTextNodesRecurse } from '#lib/core/compiler/io';

describe('function cleanAndMergeAdjacentTextNodesRecurse', () => {
  test(`filtering of no children`, () => {
    const input: XmlParserElementNode = {
      attributes: {} as Record<string, string>,
      children: null,
      name: 'root',
      type: 'Element',
    };

    const result = cleanAndMergeAdjacentTextNodesRecurse(input);
    expect(result).toStrictEqual({
      ...input,
      children: [],
    });
  });

  test(`merging of no children`, () => {
    const input: XmlParserElementNode = {
      attributes: {} as Record<string, string>,
      children: [
        {
          content: 'A',
          type: 'Text',
        },
        {
          content: 'B',
          type: 'Text',
        },
      ],
      name: 'root',
      type: 'Element',
    };

    const result = cleanAndMergeAdjacentTextNodesRecurse(input);
    expect(result).toStrictEqual({
      ...input,
      children: [
        {
          content: 'A B',
          type: 'Text',
        },
      ],
    });
  });

  test(`filtering of empty text`, () => {
    const input: XmlParserElementNode = {
      attributes: {} as Record<string, string>,
      children: [
        {
          content: '',
          type: 'Text',
        },
        {
          content: '       ',
          type: 'Text',
        },
      ],
      name: 'root',
      type: 'Element',
    };

    const result = cleanAndMergeAdjacentTextNodesRecurse(input);
    expect(result).toStrictEqual({
      ...input,
      children: [],
    });
  });

  test(`filtering of empty before, after, or between anything else`, () => {
    const input: XmlParserElementNode = {
      attributes: {} as Record<string, string>,
      children: [
        {
          content: '',
          type: 'Text',
        },
        {
          content: 'this is a comment',
          type: 'Comment',
        },
        {
          content: '   ',
          type: 'Text',
        },
        {
          content: 'this is a comment',
          type: 'Comment',
        },
        {
          content: '   ',
          type: 'Text',
        },
      ],
      name: 'root',
      type: 'Element',
    };

    const result = cleanAndMergeAdjacentTextNodesRecurse(input);
    expect(result).toStrictEqual({
      ...input,
      children: [
        {
          content: 'this is a comment',
          type: 'Comment',
        },
        {
          content: 'this is a comment',
          type: 'Comment',
        },
      ],
    });
  });

  test(`no changes on non text nodes`, () => {
    const input: XmlParserElementNode = {
      attributes: {} as Record<string, string>,
      children: [
        {
          content: 'this is a instruction',
          name: 'program',
          type: 'ProcessingInstruction',
        },
        {
          content: 'this data',
          type: 'CDATA',
        },
      ],
      name: 'root',
      type: 'Element',
    };

    const result = cleanAndMergeAdjacentTextNodesRecurse(input);
    expect(result).toStrictEqual(input);
  });

  test(`checking recursion result`, () => {
    const child: XmlParserElementNode = {
      attributes: {} as Record<string, string>,
      children: [
        {
          content: '',
          type: 'Text',
        },
        {
          content: 'this is a comment',
          type: 'Comment',
        },
        {
          content: '   ',
          type: 'Text',
        },
        {
          content: 'this is a comment',
          type: 'Comment',
        },
        {
          content: '   ',
          type: 'Text',
        },
      ],
      name: 'child',
      type: 'Element',
    };
    const input: XmlParserElementNode = {
      attributes: {} as Record<string, string>,
      children: [child],
      name: 'root',
      type: 'Element',
    };

    const result = cleanAndMergeAdjacentTextNodesRecurse(input);
    expect(result).toStrictEqual({
      ...input,
      children: [
        {
          ...child,
          children: [
            {
              content: 'this is a comment',
              type: 'Comment',
            },
            {
              content: 'this is a comment',
              type: 'Comment',
            },
          ],
        },
      ],
    });
  });
});
