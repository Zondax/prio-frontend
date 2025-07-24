import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
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
      '@/site': resolve(__dirname, './site'),
      '@/app': resolve(__dirname, './app'),
      '@mono-grpc': resolve(__dirname, '../../packages/grpc/src'),
      '@mono-state': resolve(__dirname, '../../packages/state/src'),
      '@mono-ui': resolve(__dirname, '../../packages/ui/src'),
      '@zondax/auth-core': resolve(__dirname, '../../libs/auth-core/src'),
      '@zondax/auth-web': resolve(__dirname, '../../libs/auth-web/src'),
      '@zondax/ui-web': resolve(__dirname, '../../libs/ui-common/src'),
      '@zondax/ui-web/server': resolve(__dirname, '../../libs/ui-common/src/server'),
      '@zondax/ui-web/client': resolve(__dirname, '../../libs/ui-common/src/client'),
    },
  },
})
