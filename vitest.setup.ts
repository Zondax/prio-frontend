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

// Mock IntersectionObserver for tests
global.IntersectionObserver = class IntersectionObserver {
  constructor(cb: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.cb = cb
    this.options = options
  }
  cb: IntersectionObserverCallback
  options?: IntersectionObserverInit
  root: Element | null = null
  rootMargin = '0px'
  thresholds: ReadonlyArray<number> = [0]
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

// Mock MutationObserver for tests
global.MutationObserver = class MutationObserver {
  constructor(cb: MutationCallback) {
    this.cb = cb
  }
  cb: MutationCallback
  observe() {}
  disconnect() {}
  takeRecords(): MutationRecord[] {
    return []
  }
}

// Create a reusable fonts mock singleton
const fontsMock = {
  ready: Promise.resolve(),
}

// Mock document.fonts for tests that use font loading
const setupDocumentFonts = () => {
  if (!document.fonts) {
    Object.defineProperty(document, 'fonts', {
      value: fontsMock,
      writable: true,
      configurable: true,
    })
  }
}

// Set up initially
setupDocumentFonts()

afterEach(() => {
  cleanup()
  // Ensure fonts mock persists after cleanup
  setupDocumentFonts()
})
