import { describe, expect, it } from 'vitest'

import { parseDateParam } from './params'

// Helper: get ISO string for a known date
const isoDate = '2025-05-15T14:30:00Z'
const incompleteDate = '2025-05-15'
const nonIsoDate = 'May 15, 2025 14:30:00'
const invalidDate = 'not-a-date'

describe('parseDateParam', () => {
  it('returns a Date for a valid ISO string', () => {
    const result = parseDateParam(isoDate)
    expect(result).toBeInstanceOf(Date)
    expect(result?.toISOString()).toBe('2025-05-15T14:30:00.000Z')
  })

  it('returns a Date for an incomplete date string', () => {
    const result = parseDateParam(incompleteDate)
    expect(result).toBeInstanceOf(Date)
    // Should match the date part but time will be midnight UTC
    expect(result?.getUTCFullYear()).toBe(2025)
    expect(result?.getUTCMonth()).toBe(4) // May is 4 (0-indexed)
    expect(result?.getUTCDate()).toBe(15)
    expect(result?.getUTCHours()).toBe(0)
    expect(result?.getUTCMinutes()).toBe(0)
    expect(result?.getUTCSeconds()).toBe(0)
  })

  it('returns a Date for a valid non-ISO string', () => {
    const result = parseDateParam(nonIsoDate)
    expect(result).toBeInstanceOf(Date)
    // Should match the same time as the ISO string
    expect(result?.getUTCFullYear()).toBe(2025)
    expect(result?.getUTCMonth()).toBe(4) // May is 4 (0-indexed)
    expect(result?.getUTCDate()).toBe(15)
    expect(result?.getUTCHours()).toBe(14)
    expect(result?.getUTCMinutes()).toBe(30)
  })

  it('returns undefined for an invalid date string', () => {
    const result = parseDateParam(invalidDate)
    expect(result).toBeUndefined()
  })

  it('returns undefined for undefined input', () => {
    const result = parseDateParam(undefined)
    expect(result).toBeUndefined()
  })

  it('returns undefined for null input', () => {
    const result = parseDateParam(null as unknown as string | undefined)
    expect(result).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    const result = parseDateParam('')
    expect(result).toBeUndefined()
  })
})
