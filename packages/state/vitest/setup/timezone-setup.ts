/**
 * Vitest Timezone Setup
 *
 * This setup file provides utilities for handling timezone-specific tests consistently
 * across different environments (local development, CI, various host machines).
 *
 * It includes:
 * - Helper functions for mocking dates in a timezone-consistent way
 * - Methods to temporarily use fake timers and reset them after tests
 *
 * Usage in tests:
 * ```
 * import { withFixedDate } from '@mono-state/vitest/setup/timezone-setup'
 *
 * it('should format time correctly regardless of host timezone', () => {
 *   withFixedDate(new Date('2023-10-10T10:00:00Z'), () => {
 *     const result = formatTimeWithTimezone(date, '+2')
 *     expect(result).toBe('12:00 PM (GMT+2)')
 *   })
 * })
 * ```
 */
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

// Reset all mocks automatically after each test
afterEach(() => {
  vi.restoreAllMocks()
})

// Store original timezone environment variables
let originalTimezone: string | undefined
let originalNodeTz: string | undefined

/**
 * Sets up a fixed timezone environment for all tests in the suite
 */
beforeAll(() => {
  // Save the original timezone settings
  originalTimezone = process.env.TZ
  originalNodeTz = process.env.NODE_TZ

  // Set a fixed timezone for consistent test behavior
  process.env.TZ = 'UTC'
  process.env.NODE_TZ = 'UTC'
})

/**
 * Restores the original timezone environment after all tests complete
 */
afterAll(() => {
  // Restore original timezone settings
  if (originalTimezone) {
    process.env.TZ = originalTimezone
  } else {
    process.env.TZ = undefined
  }

  if (originalNodeTz) {
    process.env.NODE_TZ = originalNodeTz
  } else {
    process.env.NODE_TZ = undefined
  }
})

/**
 * Executes a callback function with a fixed date
 * This is useful for tests that need to run with specific date/time values
 * regardless of the actual time or timezone of the host machine
 *
 * @param date - The fixed date to use during the callback execution
 * @param callback - The function to execute with the fixed date
 * @returns The result from the callback
 */
export function withFixedDate<T>(date: Date, callback: () => T): T {
  // Save original Date functionality
  const originalNow = Date.now

  // Use Vitest's fake timers
  vi.useFakeTimers()
  vi.setSystemTime(date)

  try {
    // Execute callback with fixed date
    return callback()
  } finally {
    // Restore original timer functionality
    // biome-ignore lint/correctness/useHookAtTopLevel: this is a vitest utility, not a React hook
    vi.useRealTimers()
    Date.now = originalNow
  }
}

/**
 * Creates a mock implementation for Date constructor to simulate specific timezone behavior
 * This allows tests to verify behavior with dates in specific timezones
 *
 * @param adjustHours - The number of hours to adjust mock dates by
 * @returns A function that can be used to mock Date
 */
export function createDateMock(adjustHours = 0) {
  return function mockDate(this: Date, ...args: any[]) {
    if (args.length === 0) {
      // When called with no args, return current date
      const current = new Date(Date.now())
      current.setHours(current.getHours() + adjustHours)
      return current
    }

    // When called with args, pass through but adjust for "timezone"
    // @ts-ignore - using Function constructor for dynamic args
    const realDate = new (Function.prototype.bind.apply(Date, [null, ...args]))()

    realDate.setHours(realDate.getHours() + adjustHours)
    return realDate
  } as DateConstructor
}
