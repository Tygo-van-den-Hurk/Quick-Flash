import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Slide } from '#lib/core/components/slides/slide';

describe('class Slide implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(Slide.name)).toBe(Slide);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: 1,
    path: ['root'],
  };

  test('Is creatable', () => {
    expect(() => new Slide({ ...construct })).not.toThrow();
  });

  const render = {
    children: (): string => '',
  };

  test('renders with children', () => {
    expect(() => new Slide({ ...construct }).render({ ...render })).not.toThrow();
  });

  test('renders without children', () => {
    expect(() =>
      // eslint-disable-next-line no-undefined
      new Slide({ ...construct }).render({ ...render, children: undefined })
    ).not.toThrow();
  });
});
