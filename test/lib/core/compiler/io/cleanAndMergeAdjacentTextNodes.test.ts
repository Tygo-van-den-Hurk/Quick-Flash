/* eslint-disable max-lines */

import type { XmlParserElementNode, XmlParserResult } from 'xml-parser-xo';
import { describe, expect, test } from 'vitest';
import { cleanAndMergeAdjacentTextNodes } from '#lib/core/compiler/io';

describe('function cleanAndMergeAdjacentTextNodes', () => {
  test(`filtering of no children`, () => {
    const root: XmlParserElementNode = {
      attributes: {} as Record<string, string>,
      children: null,
      name: 'root',
      type: 'Element',
    };
    const input: XmlParserResult = {
      children: [root],
      declaration: null,
      root,
    };

    const result = cleanAndMergeAdjacentTextNodes(input);
    expect(result).toStrictEqual({
      ...input,
      children: [
        {
          ...root,
          children: [],
        },
      ],
      root: {
        ...root,
        children: [],
      },
    });
  });

  test(`merging of no children`, () => {
    const root: XmlParserElementNode = {
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
    const input: XmlParserResult = {
      children: [root],
      declaration: null,
      root,
    };

    const result = cleanAndMergeAdjacentTextNodes(input);
    expect(result).toStrictEqual({
      ...input,
      children: [
        {
          ...root,
          children: [
            {
              content: 'A B',
              type: 'Text',
            },
          ],
        },
      ],
      root: {
        ...root,
        children: [
          {
            content: 'A B',
            type: 'Text',
          },
        ],
      },
    });
  });

  test(`filtering of empty text`, () => {
    const root: XmlParserElementNode = {
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
    const input: XmlParserResult = {
      children: [root],
      declaration: null,
      root,
    };

    const result = cleanAndMergeAdjacentTextNodes(input);
    expect(result).toStrictEqual({
      ...input,
      children: [
        {
          ...root,
          children: [],
        },
      ],
      root: {
        ...root,
        children: [],
      },
    });
  });

  test(`filtering of empty before, after, or between anything else`, () => {
    const root: XmlParserElementNode = {
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
    const input: XmlParserResult = {
      children: [root],
      declaration: null,
      root,
    };

    const result = cleanAndMergeAdjacentTextNodes(input);
    expect(result).toStrictEqual({
      ...input,
      children: [
        {
          ...root,
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
      root: {
        ...root,
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
    });
  });

  test(`no changes on non text nodes`, () => {
    const root: XmlParserElementNode = {
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

    const input: XmlParserResult = {
      children: [root],
      declaration: null,
      root,
    };
    const result = cleanAndMergeAdjacentTextNodes(input);
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
    const root: XmlParserElementNode = {
      attributes: {} as Record<string, string>,
      children: [child],
      name: 'root',
      type: 'Element',
    };
    const input: XmlParserResult = {
      children: [
        {
          content: 'this is a instruction',
          name: 'program',
          type: 'ProcessingInstruction',
        },
        root,
      ],
      declaration: null,
      root,
    };

    const result = cleanAndMergeAdjacentTextNodes(input);
    expect(result).toStrictEqual({
      ...input,
      children: [
        {
          content: 'this is a instruction',
          name: 'program',
          type: 'ProcessingInstruction',
        },
        {
          ...root,
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
        },
      ],
      root: {
        ...root,
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
      },
    });
  });
});
