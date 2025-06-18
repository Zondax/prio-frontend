import { describe, expect, it } from 'vitest'

import { parseDateParam } from './params'

// Helper: get ISO string for a known date
const isoDate = '2025-05-15T14:30:00Z'
const _incompleteDate = '2025-05-15'
const _nonIsoDate = 'May 15, 2025 14:30:00'
const invalidDate = 'not-a-date'

describe('parseDateParam', () => {
  it('returns a Date for a valid ISO string', () => {
    const result = parseDateParam(isoDate)
    expect(result).toBeInstanceOf(Date)
    expect(result?.toISOString()).toBe('2025-05-15T14:30:00.000Z')
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
