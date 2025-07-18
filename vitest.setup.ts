/**
 * Root vitest setup for prio-frontend
 * Migrated from jest-dom to native Vitest assertions (2025-01)
 * Enhanced with additional mocks from kedge-frontend (2025-01)
 */
import { EventEmitter as NodeEventEmitter } from 'node:events'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

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
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver for tests
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => []),
}))

// Mock MutationObserver for tests
global.MutationObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => []),
}))

// Mock matchMedia which is used by responsive components
const mockMatchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(), // Deprecated
  removeListener: vi.fn(), // Deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
})

// Also mock as global function for environments that don't have window
global.matchMedia = mockMatchMedia

// Mock scrollIntoView which is not available in jsdom
Element.prototype.scrollIntoView = vi.fn()

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

// Mock Next.js router for components that use it
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Global test setup
beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
  // Ensure fonts mock persists after cleanup
  setupDocumentFonts()
})
