import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    setupFiles: ['./vitest/setup/timezone-setup.ts', './vitest/setup/react-mock.ts'],
  },
  resolve: {
    alias: {
      '@mono-grpc': path.resolve(__dirname, '../grpc/src'),
      '@zondax/stores': path.resolve(__dirname, '../stores/src'),
      '@mono-state/vitest': path.resolve(__dirname, './vitest'),
    },
  },
})
