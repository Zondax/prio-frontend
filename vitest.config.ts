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
        lines: 22,
        statements: 22,
        functions: 15,
        branches: 55,
      },
    },
    // Set test timeout to 10 seconds
    testTimeout: 10000,
  },
})
