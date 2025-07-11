import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['./**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/e2e/**', '**/node_modules/**', '**/dist/**', '**/.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      exclude: ['**/.next/**'],
      thresholds: {
        lines: 0,
        statements: 0,
        functions: 0,
        branches: 0,
      },
    },
    testTimeout: 10_000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
})
