import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Text } from '#lib/core/components/blocks/text';

describe('class Text implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(Text.name)).toBe(Text);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: 4,
    path: ['root'],
  };

  test('Is creatable', () => {
    expect(() => new Text({ ...construct })).not.toThrow();
  });

  const render = {
    children: (): string => '',
  };

  test('renders with children', () => {
    expect(() => new Text({ ...construct }).render({ ...render })).not.toThrow();
  });

  test('does not render without children', () => {
    expect(() =>
      // eslint-disable-next-line no-undefined
      new Text({ ...construct }).render({ ...render, children: undefined })
    ).toThrow();
  });
});
