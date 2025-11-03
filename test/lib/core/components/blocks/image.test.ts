import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Image } from '#lib/core/components/blocks/image';

describe('class Image implements Component', () => {
  test('Registered', () => {
    expect(Component.retrieve(Image.name)).toBe(Image);
  });

  const construct = {
    attributes: {
      source: 'http://example.com/',
    },
    focusMode: 'default' as const,
    id: '',
    level: 4,
    path: ['root'],
  };

  test('Is creatable with src', () => {
    expect(() => new Image({ ...construct })).not.toThrow();
  });

  test('Is not creatable with src', () => {
    expect(() => new Image({ ...construct, attributes: {} })).toThrow();
  });

  const render = {
    children: (): string => '',
  };

  test('renders without children', () => {
    expect(() =>
      // eslint-disable-next-line no-undefined
      new Image({ ...construct }).render({ ...render, children: undefined })
    ).not.toThrow();
  });

  test('does not render with children', () => {
    expect(() => new Image({ ...construct }).render({ ...render })).toThrow();
  });
});
