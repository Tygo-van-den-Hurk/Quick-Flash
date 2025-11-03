import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Quote } from '#lib/core/components/blocks/quote';

describe('class Quote implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(Quote.name)).toBe(Quote);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: 4,
    path: ['root'],
  };

  test('Is creatable', () => {
    expect(() => new Quote({ ...construct })).not.toThrow();
  });

  const render = {
    children: (): string => '',
  };

  test('renders with children', () => {
    expect(() => new Quote({ ...construct }).render({ ...render })).not.toThrow();
  });

  test('does not render without children', () => {
    expect(() =>
      // eslint-disable-next-line no-undefined
      new Quote({ ...construct }).render({ ...render, children: undefined })
    ).toThrow();
  });
});
