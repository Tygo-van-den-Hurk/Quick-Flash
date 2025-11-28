/* eslint-disable max-classes-per-file */

import {
  Registry,
  type RegistryConstructorArguments,
  addXmlNameSpace,
  createVariations,
  createVariationsByRemovingSubstring,
} from '#lib/core/registry';
import { describe, expect, test } from 'vitest';
import type { RequireAll } from '#lib/types';

// Tests: createVariations

describe('function createVariations', () => {
  test('Does not create kebab-case when not asked to', () => {
    const input = 'TestTest';
    const output = createVariations([input], false);
    expect(output).toContain(input);
    expect(output).not.toContain('test-test');
  });

  test('Does create kebab-case when asked to', () => {
    const input = 'TestTest';
    const output = createVariations([input], true);
    expect(output).toContain(input);
    expect(output).toContain('test-test');
  });
});

// Tests: createVariationsByRemovingSubstring

describe('function createVariationsByRemovingSubstring', () => {
  test('removes substring out of array', () => {
    const starter = 'TestEntry';
    const input = createVariations([starter], true);
    const substrings = createVariations(['Entry'], true);
    const output = createVariationsByRemovingSubstring(input, substrings);
    expect(output).toContain(starter);
    expect(output).toContain('Test');
    expect(output, output.toString()).toContain('test');
  });
});

// Tests: addXmlNameSpace

describe('function addXmlNameSpace', () => {
  test('Adds plugin prefix for plugins', () => {
    const plugin = true;
    const input = 'Test';
    const output = addXmlNameSpace([input], plugin);
    expect(output).toContain(input);
    expect(output).toContain(`plugin:${input}`);
  });

  test('Adds slyde prefix for non-plugins', () => {
    const plugin = false;
    const input = 'Test';
    const output = addXmlNameSpace([input], plugin);
    expect(output).toContain(input);
    expect(output).toContain(`slyde:${input}`);
  });
});

// Tests: Registry

describe('class Registry', () => {
  test('Creates instance with arguments', () => {
    const extensiveAliases = false;
    const name = 'test-0';
    const substrings = [] as readonly string[];
    const opts = {
      extensiveAliases,
      name,
      substrings,
    } satisfies RequireAll<RegistryConstructorArguments>;
    const registry = new Registry(opts);
    expect(registry).toBeInstanceOf(Registry);
    expect(registry.name).toBe(name);
    expect(registry.extensiveAliases).toBe(extensiveAliases);
    expect(registry.substrings).toStrictEqual(substrings);
  });

  test('Registry.inject(class Class {})', () => {
    const Class = Registry.inject(
      class Class {
        public str?: string;
      }
    );

    expect(Class.registry).toBeInstanceOf(Registry);
    expect(Class.registry.name).toBe(Class.name);
  });

  test('Registry.inject.with({ ... })(class C {})', () => {
    const extensiveAliases = false;
    const name = 'test-1';
    const substrings = [] as readonly string[];
    const Class = Registry.inject.with({ extensiveAliases, name, substrings })(
      class Class {
        public str?: string;
      }
    );

    expect(Class.registry).toBeInstanceOf(Registry);
    expect(Class.registry.name).toBe(name);
    expect(Class.registry.extensiveAliases).toBe(extensiveAliases);
    expect(Class.registry.substrings).toStrictEqual(substrings);
  });

  test('Registry.register(class C {}) means Registry.keys contains "C"', () => {
    const extensiveAliases = false;
    const name = 'test-1';
    const substrings = [] as readonly string[];
    const Class = Registry.inject.with({ extensiveAliases, name, substrings })(
      class Class {
        public str?: string;
      }
    );

    const Class2 = class Class2 extends Class {};
    expect(Class.keys()).not.toContain(Class2.name);
    Class.register(Class2);
    expect(Class.keys()).toContain(Class2.name);
    expect(Class.retrieve(Class2.name)).toStrictEqual(Class2);
  });

  test('Registry.register.with({ ... })(class C {})', () => {
    const extensiveAliases = false;
    const name = 'test-2';
    const substrings = [] as readonly string[];
    const Class = Registry.inject.with({ extensiveAliases, name, substrings })(
      class Class {
        public str?: string;
      }
    );

    const newName = 'find me';
    const aliases = ['also'] as readonly string[];
    const Class2 = class Class2 extends Class {};
    expect(Class.keys()).not.toContain(newName);
    expect(Class.keys()).not.toContain(Class2.name);
    for (const alias of aliases) expect(Class.keys()).not.toContain(alias);
    Class.register.with({ aliases, name: newName })(Class2);
    expect(Class.keys()).not.toContain(Class2.name);
    for (const alias of aliases) expect(Class.keys()).toContain(alias);
    expect(Class.keys()).toContain(newName);
  });
});
