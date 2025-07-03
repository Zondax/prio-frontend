import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

// Workspace folders we want to test against
const workspaceDirs = ['apps', 'libs', 'packages'] as const

// Globs
const testFileGlob = '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
const coverageFileGlob = '**/*.{js,ts,jsx,tsx}'
const excludeGlobs = ['**/node_modules/**', '**/dist/**', '**/build/**', '**/e2e/**', '**/.next/**', 'libs/auth-expo/**']

// Map of package aliases ➜ relative source paths (from repo root)
const aliasRoots: Record<string, string> = {
  '@mono-grpc': 'packages/grpc/src',
  '@zondax/auth-core': 'libs/auth-core/src',
  '@zondax/auth-web': 'libs/auth-web/src',
  '@zondax/ui-common': 'libs/ui-common/src',
  '@mono-state': 'packages/state/src',
}

// Build alias array for Vite/Vitest
const alias = [
  // Next.js @/* alias used inside apps/web
  { find: /^@\/(.*)$/, replacement: resolve(__dirname, 'apps/web/$1') },
  // Workspace package aliases – keeps vitest from trying to resolve via node_modules
  ...Object.entries(aliasRoots).flatMap(([key, target]) => [
    { find: new RegExp(`^${key}/(.*)$`), replacement: resolve(__dirname, `${target}/$1`) },
    { find: key, replacement: resolve(__dirname, target) },
  ]),
  // Lightweight stubs for React Native / Expo behaviour in Node
  { find: 'react-native', replacement: resolve(__dirname, 'vitest-react-native-stub.ts') },
  { find: 'expo-constants', replacement: resolve(__dirname, 'vitest-expo-constants-stub.ts') },
]

export default defineConfig({
  resolve: { alias },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  test: {
    setupFiles: ['./vitest.setup.ts'],
    include: workspaceDirs.map((dir) => `${dir}/${testFileGlob}`),
    exclude: excludeGlobs,
    globals: true,
    environment: 'jsdom',
    // Set test timeout to 10 seconds
    testTimeout: 10_000,
    // Fix EPIPE errors in CI by using threads with limited workers
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: workspaceDirs.map((dir) => `${dir}/${coverageFileGlob}`),
      exclude: [...excludeGlobs, '**/*.config.*', '**/*.test.*', '**/*.spec.*'],
      thresholds: {
        lines: 0,
        statements: 0,
        functions: 0,
        branches: 0,
      },
    },
  },
})
