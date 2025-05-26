import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      { find: 'expo-constants', replacement: resolve(__dirname, './src/utils/mock-expo-constants.ts') },
      { find: '@zondax/auth-core', replacement: resolve(__dirname, '../auth-core/src/index.ts') },
      { find: '@prio-grpc', replacement: resolve(__dirname, '../grpc/src/index.ts') },
    ],
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
