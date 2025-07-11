import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: resolve(process.cwd(), './') },
      { find: '@/lib', replacement: resolve(process.cwd(), './lib') },
      { find: '@/components', replacement: resolve(process.cwd(), './components') },
    ],
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.expo/**', '**/coverage/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    deps: {
      inline: ['react-native', 'react-native-svg', 'expo-router', 'react-native-safe-area-context', 'lucide-react-native'],
    },
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 10_000,
  },
})
