/* eslint-disable @typescript-eslint/no-unsafe-return */
import { describe, expect, test, vi } from 'vitest';

const pluginFile = '#test-plugin.js';

// Mock the absolute path that will actually be imported
vi.mock('#test-plugin.js', () => ({
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
  default: ({ Component }: { Component: any }) =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Component.register(
      class MyComponent extends Component {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/class-methods-use-this
        public hierarchy = () => '*';
        public render(): string {
          return this.hierarchy();
        }
      }
    ),
}));

vi.mock('fs', () => ({
  existsSync: vi.fn((path) => path !== '#'),
  readFileSync: vi.fn(
    () => `
    export default ({ Component }) => Component.register(
      class MyComponent extends Component {
        hierarchy = () => '*';
        render({ children }) {
          if (children) return children();
          else return 'THIS IS AN EXAMPLE';
        }
      }
    );`
  ),
}));

vi.mock('ora', () => ({
  oraPromise: vi.fn(() => ({})),
}));

import { loadPlugins } from '#lib/core/compiler/io';

describe('function loadPlugins', () => {
  test('loading a plugin', async () => {
    await expect(loadPlugins([pluginFile])).resolves.not.toThrow();
  });
});
