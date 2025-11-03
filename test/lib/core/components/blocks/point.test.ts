import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Point } from '#lib/core/components/blocks/point';

describe('class Point implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(Point.name)).toBe(Point);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: 4,
    path: ['root'],
  };

  test('Is creatable', () => {
    expect(() => new Point({ ...construct })).not.toThrow();
  });

  test('Is not creatable with garbage attributes', () => {
    expect(() => new Point({ ...construct, attributes: { type: 'GAR8AG3!' } })).toThrow();
  });

  const render = {
    children: (): string => '',
  };

  test('renders with children', () => {
    expect(() => new Point({ ...construct }).render({ ...render })).not.toThrow();
  });

  test('does not render without children', () => {
    expect(() =>
      // eslint-disable-next-line no-undefined
      new Point({ ...construct }).render({ ...render, children: undefined })
    ).toThrow();
  });
});
