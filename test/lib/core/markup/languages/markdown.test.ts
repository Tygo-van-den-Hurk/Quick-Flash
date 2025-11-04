import { describe, expect, test } from 'vitest';
import { MarkdownRenderer } from '#lib/core/markup/languages/markdown';

describe('class MarkdownRenderer implements MarkupRender', () => {
  test(`rendering an empty string to see if it stays a literal`, () => {
    const input = '';
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(input);
  });

  test('rendering text with no markers', () => {
    const input = 'just plain text here';
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(input);
  });

  test(`rendering a marked for bold word`, () => {
    const input = `**word**`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(`<strong>word</strong>`);
  });

  test(`rendering a marked for bold word inside of a sentence"`, () => {
    const input = `something **word** something`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(`something <strong>word</strong> something`);
  });

  test(`rendering with a marker for bold nested inside of a word`, () => {
    const input = `something word**word**`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(`something word<strong>word</strong>`);
  });

  test(`rendering an escaped marker reverts to a literal"`, () => {
    const input1 = `something not \\**word**`;
    const result1 = new MarkdownRenderer().render(input1);
    expect(result1).toBe(`something not *<em>word</em>*`);
    const input2 = `something not *\\*word**`;
    const result2 = new MarkdownRenderer().render(input2);
    expect(result2).toBe(`something not <em>*word</em>*`);
    const input3 = `something not **word\\**`;
    const result3 = new MarkdownRenderer().render(input3);
    expect(result3).toBe(`something not *<em>word*</em>`);
    const input4 = `something not **word*\\*`;
    const result4 = new MarkdownRenderer().render(input4);
    expect(result4).toBe(`something not *<em>word</em>*`);
  });

  test('rendering unclosed marker reverts to literal', () => {
    const input = `**unclosed bold text`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(input);
  });

  test('rendering multiple unclosed markers revert to literals', () => {
    const input = `**bold *italic`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(input);
  });

  test('rendering same marker cannot nest within itself', () => {
    const input = `**outer **inner** outer**`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(`<strong>outer <strong>inner</strong> outer</strong>`);
  });

  test('rendering same marker on different lines', () => {
    const input = `**line 1
    line 2**`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(`<strong>line 1
    line 2</strong>`);
  });

  test('rendering adjacent markers', () => {
    const input = `**bold****more bold**`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(`<strong>bold****more bold</strong>`);
  });

  test('rendering escaped backslash before marker', () => {
    const input = `\\\\**word**`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(`\\<strong>word</strong>`);
  });

  test('rendering marker at end of string (unclosed)', () => {
    const input = `text **`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(input);
  });

  test('rendering mixed escaped and unescaped markers', () => {
    const input = `\\**not styled** **styled**`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(`*<em>not styled</em>* <strong>styled</strong>`);
  });

  test('test link', () => {
    const input = `[this](http://example.com)`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(`<a href="http://example.com">this</a>`);
  });

  test('filter out image', () => {
    const input = `![this](http://example.com)`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(input);
  });

  test('filter out table', () => {
    const input = `| Header |\n|--------|\n| entry  |`;
    const result = new MarkdownRenderer().render(input);
    expect(result).toBe(input);
  });
});
