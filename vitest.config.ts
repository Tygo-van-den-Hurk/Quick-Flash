import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      ignoreEmptyLines: true,
      skipFull: true,
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        perFile: true,
        statements: 90,
      }
    },
    exclude:[ 
      ...configDefaults.exclude, 
      '**/index.ts',
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      './src/cli.ts',
    ],
  }
});