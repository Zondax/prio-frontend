import { startOfDay } from 'date-fns'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ActivitySlot } from '../../stores'
import { findExistingSlot, formatTimeWithDayIndicator, isActivityHappeningSoon } from './timeUtils'

describe('formatTimeWithDayIndicator', () => {
  it('formats time within the same day correctly', () => {
    const minutes = 600 // 10:00 AM (600 minutes from midnight)
    const formatFn = vi.fn((min) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`)

    const result = formatTimeWithDayIndicator(minutes, formatFn)

    expect(formatFn).toHaveBeenCalledWith(minutes)
    expect(result.displayTime).toBe('10:00')
    expect(result.isNextDay).toBe(false)
  })

  it('formats time in the next day correctly', () => {
    const minutes = 24 * 60 + 90 // 01:30 AM next day (1530 minutes from first day midnight)
    const formatFn = vi.fn((min) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`)

    const result = formatTimeWithDayIndicator(minutes, formatFn)

    expect(formatFn).toHaveBeenCalledWith(90) // Should pass adjusted time (90 minutes)
    expect(result.displayTime).toBe('1:30')
    expect(result.isNextDay).toBe(true)
  })

  it('handles midnight exactly', () => {
    const minutes = 0 // 00:00 (midnight)
    const formatFn = vi.fn((min) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`)

    const result = formatTimeWithDayIndicator(minutes, formatFn)

    expect(formatFn).toHaveBeenCalledWith(0)
    expect(result.displayTime).toBe('0:00')
    expect(result.isNextDay).toBe(false)
  })

  it('handles midnight of next day exactly', () => {
    const minutes = 24 * 60 // 00:00 (midnight of next day)
    const formatFn = vi.fn((min) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, '0')}`)

    const result = formatTimeWithDayIndicator(minutes, formatFn)

    expect(formatFn).toHaveBeenCalledWith(0) // Should pass adjusted time (0 minutes)
    expect(result.displayTime).toBe('0:00')
    expect(result.isNextDay).toBe(true)
  })
})

describe('findExistingSlot', () => {
  // Mock date to ensure consistent test results
  const mockDate = new Date('2023-01-01T00:00:00Z')

  beforeEach(() => {
    vi.spyOn(global.Date, 'now').mockImplementation(() => mockDate.getTime())
  })

  afterEach(() => {
    vi.spyOn(global.Date, 'now').mockRestore()
  })

  it('finds a slot that matches the activity ID and time', () => {
    // Setup
    const todayStartSeconds = startOfDay(new Date()).getTime() / 1000
    const activityId = 'activity-123'
    const timeMinutes = 600 // 10:00 AM
    const startTimeSeconds = todayStartSeconds + timeMinutes * 60

    const mockStartTime = { getSeconds: () => startTimeSeconds }
    const mockEndTime = { getSeconds: () => startTimeSeconds + 60 * 60 } // 1 hour duration

    const mockSlot = {
      getActivityId: () => activityId,
      getStartTime: () => mockStartTime,
      getEndTime: () => mockEndTime,
    } as unknown as ActivitySlot

    const slots = [
      {
        getActivityId: () => 'other-activity',
        getStartTime: () => ({ getSeconds: () => todayStartSeconds + 300 * 60 }),
        getEndTime: () => ({ getSeconds: () => todayStartSeconds + 360 * 60 }),
      } as unknown as ActivitySlot,
      mockSlot,
      {
        getActivityId: () => activityId,
        getStartTime: () => ({ getSeconds: () => todayStartSeconds + 720 * 60 }),
        getEndTime: () => ({ getSeconds: () => todayStartSeconds + 780 * 60 }),
      } as unknown as ActivitySlot,
    ]

    // Test
    const result = findExistingSlot(slots, activityId, timeMinutes)

    // Verify
    expect(result).toBe(mockSlot)
  })

  it('returns undefined when no matching slot is found', () => {
    // Setup
    const todayStartSeconds = startOfDay(new Date()).getTime() / 1000
    const activityId = 'activity-123'
    const timeMinutes = 600 // 10:00 AM

    const slots = [
      {
        getActivityId: () => 'other-activity',
        getStartTime: () => ({ getSeconds: () => todayStartSeconds + 300 * 60 }),
        getEndTime: () => ({ getSeconds: () => todayStartSeconds + 360 * 60 }),
      } as unknown as ActivitySlot,
      {
        getActivityId: () => activityId,
        getStartTime: () => ({ getSeconds: () => todayStartSeconds + 660 * 60 }), // 11:00 AM, not 10:00 AM
        getEndTime: () => ({ getSeconds: () => todayStartSeconds + 720 * 60 }),
      } as unknown as ActivitySlot,
    ]

    // Test
    const result = findExistingSlot(slots, activityId, timeMinutes)

    // Verify
    expect(result).toBeUndefined()
  })

  it('returns undefined when slots array is empty', () => {
    const result = findExistingSlot([], 'activity-123', 600)
    expect(result).toBeUndefined()
  })
})

describe('isActivityHappeningSoon', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2023-05-15T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns false when event date is undefined', () => {
    const result = isActivityHappeningSoon(undefined)
    expect(result).toBe(false)
  })

  it('returns true when event is within the default time window (1 hour)', () => {
    const eventDate = new Date('2023-05-15T10:30:00Z') // 30 minutes from now
    const result = isActivityHappeningSoon(eventDate)
    expect(result).toBe(true)
  })

  it('returns false when event is outside the default time window', () => {
    const eventDate = new Date('2023-05-15T12:00:00Z') // 2 hours from now
    const result = isActivityHappeningSoon(eventDate)
    expect(result).toBe(false)
  })

  it('returns true when event is within a custom time window', () => {
    const eventDate = new Date('2023-05-15T13:00:00Z') // 3 hours from now
    const customWindow = 4 * 60 * 60 * 1000 // 4 hours in milliseconds
    const result = isActivityHappeningSoon(eventDate, customWindow)
    expect(result).toBe(true)
  })

  it('returns false when event is in the past', () => {
    const eventDate = new Date('2023-05-15T09:30:00Z') // 30 minutes ago
    const result = isActivityHappeningSoon(eventDate)
    expect(result).toBe(false)
  })
})
