/**
 * Root vitest setup for prio-frontend
 * Migrated from jest-dom to native Vitest assertions (2025-01)
 */
import { EventEmitter as NodeEventEmitter } from 'node:events'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

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

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb
  }
  cb: ResizeObserverCallback
  observe() {}
  unobserve() {}
  disconnect() {}
}

afterEach(() => {
  cleanup()
})
