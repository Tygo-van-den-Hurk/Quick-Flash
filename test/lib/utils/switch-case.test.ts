import { FromCamelCase, FromPascalCase } from '#lib';
import { describe, expect, test } from 'vitest';

describe('namespace FromCamelCase', () => {
  // Tests for the `FromCamelCase` namespace:

  test('FromCamelCase.toKebabCase("Hello") === "hello")', () => {
    expect(FromCamelCase.toKebabCase('Hello')).toBe('hello');
  });

  test('FromCamelCase.toKebabCase("HelloWorld") === "hello-world")', () => {
    expect(FromCamelCase.toKebabCase('HelloWorld')).toBe('hello-world');
  });

  test('FromCamelCase.toSnakeCase("Hello") === "hello")', () => {
    expect(FromCamelCase.toSnakeCase('Hello')).toBe('hello');
  });

  test('FromCamelCase.toSnakeCase("HelloWorld") === "hello-world")', () => {
    expect(FromCamelCase.toSnakeCase('HelloWorld')).toBe('hello_world');
  });
});

describe('namespace FromPascalCase', () => {
  // Tests for the `FromPascalCase` namespace:

  test('FromPascalCase.toKebabCase("Hello") === "hello")', () => {
    expect(FromPascalCase.toKebabCase('Hello')).toBe('hello');
  });

  test('FromPascalCase.toKebabCase("HelloWorld") === "hello-world")', () => {
    expect(FromPascalCase.toKebabCase('HelloWorld')).toBe('hello-world');
  });

  test('FromPascalCase.toSnakeCase("Hello") === "hello")', () => {
    expect(FromPascalCase.toSnakeCase('Hello')).toBe('hello');
  });

  test('FromPascalCase.toSnakeCase("HelloWorld") === "hello-world")', () => {
    expect(FromPascalCase.toSnakeCase('HelloWorld')).toBe('hello_world');
  });
});
