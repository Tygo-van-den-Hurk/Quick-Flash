import { describe, expect, test } from 'vitest';
import { Component } from '#lib/core/components/class';
import { QuestionSlide } from '#lib/core/components/slides/question-slide';

describe('class QuestionSlide implements Component', () => {
  test('Is registered as a component', () => {
    expect(Component.retrieve(QuestionSlide.name)).toBe(QuestionSlide);
  });

  const construct = {
    attributes: {},
    focusMode: 'default' as const,
    id: '',
    level: 1,
    path: ['root'],
  };

  test('Is creatable', () => {
    expect(() => new QuestionSlide({ ...construct })).not.toThrow();
  });

  const render = {
    children: (): string => '',
  };

  test('renders with children', () => {
    expect(() => new QuestionSlide({ ...construct }).render({ ...render })).not.toThrow();
  });

  test('renders without children', () => {
    expect(() =>
      // eslint-disable-next-line no-undefined
      new QuestionSlide({ ...construct }).render({ ...render, children: undefined })
    ).not.toThrow();
  });
});
