import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { EventEmitter as NodeEventEmitter } from 'node:events'

// Ensure DOM is cleaned after each test when using the monorepo-level runner
// Provide a minimal global expo object for expo-modules-core expectations
if (!(globalThis as any).expo) {
  ;(globalThis as any).expo = {}
}
;(globalThis as any).expo.EventEmitter = NodeEventEmitter as any

// React Native / Expo apps expect a global __DEV__ flag provided by Metro
if (typeof (globalThis as any).__DEV__ === 'undefined') {
  ;(globalThis as any).__DEV__ = false
}

afterEach(() => {
  cleanup()
})
