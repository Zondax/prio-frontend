import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './apps/ext/vitest.config.ts',
  './apps/web/vitest.config.ts',
  './packages/state/vitest.config.ts',
  './packages/stores/vitest.config.ts',
  './packages/auth-core/vitest.config.ts',
  './packages/auth-web/vitest.config.ts',
  './packages/auth-expo/vitest.config.ts',
  './packages/grpc/vitest.config.ts',
])
