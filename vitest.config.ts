import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Run tests in all workspace packages
    include: ['./apps/**/*.{test}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', './packages/**/*.{test}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    // Add default coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      thresholds: {
        lines: 0,
        statements: 0,
        functions: 0,
        branches: 0,
      },
    },
    // Set test timeout to 10 seconds
    testTimeout: 10000,
  },
})
