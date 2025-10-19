import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    exclude:[ 
      ...configDefaults.exclude, 
      '**/index.ts',
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      './src/cli.ts',
    ],
    coverage: {
      thresholds: {
        functions: 90,
        lines: 90,
        branches: 90,
        statements: 90,
        perFile: true,
      }
    }
  }
});