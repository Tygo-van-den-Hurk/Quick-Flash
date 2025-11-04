import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { Presentation } from '#lib/core/components/presentations/presentation';

describe('class Presentation implements Component', () => {
  test('Registered', () => {
    expect(Component.retrieve(Presentation.name)).toBe(Presentation);
  });

  const construct = {
    attributes: {
      title: 'BEST SOFTWARE EVER',
    },
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

  test('renders with children', () => {
    expect(() => new Presentation({ ...construct }).render({ ...render })).not.toThrow();
  });

  test('does not render without children', () => {
    expect(() =>
      // eslint-disable-next-line no-undefined
      new Presentation({ ...construct }).render({ ...render, children: undefined })
    ).toThrow();
  });
});
