import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { TitleSlide } from '#lib/core/components/slides/title-slide';

describe('class TitleSlide implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(TitleSlide.name)).toBe(TitleSlide);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: 1,
    path: ['root'],
  };

  test('Is creatable', () => {
    expect(() => new TitleSlide({ ...construct })).not.toThrow();
  });

  const render = {
    children: (): string => '',
  };

  test('renders author if present', () => {
    const author = 'Tygo van den Hurk';
    const attributes = { author };
    const slide = new TitleSlide({ ...construct, attributes });
    expect(slide.render({})).toContain(author);
  });

  test('renders all authors if present', () => {
    const author1 = 'Tygo van den Hurk';
    const author2 = 'John Doe';
    const authors = `${author1}, ${author2}`;
    const attributes = { authors };
    const slide = new TitleSlide({ ...construct, attributes });
    const result = slide.render({});
    expect(result).toContain(author1);
    expect(result).toContain(author2);
  });

  test('renders with children', () => {
    expect(() => new TitleSlide({ ...construct }).render({ ...render })).not.toThrow();
  });

  test('renders without children', () => {
    expect(() =>
      // eslint-disable-next-line no-undefined
      new TitleSlide({ ...construct }).render({ ...render, children: undefined })
    ).not.toThrow();
  });
});