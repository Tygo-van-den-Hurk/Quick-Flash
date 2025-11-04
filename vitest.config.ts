import { configDefaults, defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      all: true,
      include: ['lib/**/*.ts'],
      provider: 'istanbul',
      reportOnFailure: true,
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