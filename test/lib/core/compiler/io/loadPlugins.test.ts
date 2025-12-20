import { describe, expect, test, vi } from 'vitest';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const pluginFile = '#test-plugin.js';

const resolvedPath = pathToFileURL(
  path.resolve(pluginFile)
).href;

vi.doMock(resolvedPath, () => ({
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/no-explicit-any
  default: ({ Component }: { Component: any }): any =>
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Component.register(
      class MyComponent extends Component {
        // eslint-disable-next-line @typescript-eslint/class-methods-use-this
        public render(): string {
          return "<html>...</html>";
        }
      }
    ),
}));

vi.doMock('fs', () => ({
  existsSync: vi.fn(() => true),
  readFileSync: vi.fn(() => ''),
}));

vi.doMock('ora', () => ({
  oraPromise: vi.fn(() => ({})),
}));

const { loadPlugins } = await import('#lib/core/compiler/io');

describe('function loadPlugins', () => {
  test('loading a plugin', async () => {
    await expect(loadPlugins([pluginFile])).resolves.not.toThrow();
  });
});
