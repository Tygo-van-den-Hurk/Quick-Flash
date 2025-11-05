import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Presentation } from '#lib/core/components/presentations/presentation';

describe('class Presentation implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(Presentation.name)).toBe(Presentation);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: 0,
    path: ['root'],
  };

  test('Is creatable', () => {
    expect(() => new Presentation({ ...construct })).not.toThrow();
  });

  const render = {
    children: (): string => '',
  };

  test('renders author if present', () => {
    const author = 'Tygo van den Hurk';
    const attributes = { author };
    const slide = new Presentation({ ...construct, attributes });
    expect(slide.render({ ...render })).toContain(author);
  });

  test('renders all authors if present', () => {
    const author1 = 'Tygo van den Hurk';
    const author2 = 'John Doe';
    const authors = `${author1}, ${author2}`;
    const attributes = { authors };
    const slide = new Presentation({ ...construct, attributes });
    const result = slide.render({ ...render });
    expect(result).toContain(author1);
    expect(result).toContain(author2);
  });

  test('renders with children', () => {
    expect(() => new Presentation({ ...construct }).render({ ...render })).not.toThrow();
  });

  test('renders without children', () => {
    expect(() =>
      // eslint-disable-next-line no-undefined
      new Presentation({ ...construct }).render({ ...render, children: undefined })
    ).toThrow();
  });
});
