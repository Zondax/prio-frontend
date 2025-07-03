/**
 * Vitest setup for web app tests
 * Migrated from jest-dom to native Vitest assertions (2025-01)
 */
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
})
