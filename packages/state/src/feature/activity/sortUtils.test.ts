import { beforeEach, describe, expect, it } from 'vitest'

import { sortActivitiesStaircase } from './sortUtils'

// Helper functions to create mock objects for testing
const createMockTimestamp = (minutes: number): any => ({
  getSeconds: () => Math.floor(new Date().setHours(0, minutes, 0, 0) / 1000),
  getNanos: () => 0,
})

const createMockActivity = (id: string, startMinutes: number, endMinutes: number): any => ({
  getId: () => id,
  getEvent: () => ({
    getDate: () => ({
      getStart: () => createMockTimestamp(startMinutes),
      getEnd: () => createMockTimestamp(endMinutes),
    }),
  }),
  getActivitySlotsList: () => [],
})

const createMockActivitySlot = (activityId: string, startMinutes: number, endMinutes: number): any => ({
  getActivityId: () => activityId,
  getStartTime: () => createMockTimestamp(startMinutes),
  getEndTime: () => createMockTimestamp(endMinutes),
})

describe('sortActivitiesStaircase', () => {
  let activities: any[]
  let slots: any[]

  beforeEach(() => {
    // Create test activities with different start times
    activities = [
      createMockActivity('activity-3', 660, 720), // 11:00 AM
      createMockActivity('activity-1', 480, 540), // 8:00 AM
      createMockActivity('activity-2', 600, 660), // 10:00 AM
      createMockActivity('activity-4', 720, 780), // 12:00 PM
    ]

    // Reset slots
    slots = []
  })

  it('returns original array when autoReorder is false', () => {
    const result = sortActivitiesStaircase(activities, [], false)
    expect(result).toBe(activities) // Should return the same reference
  })

  it('returns original array when activities is empty or null', () => {
    expect(sortActivitiesStaircase([], [])).toEqual([])
    expect(sortActivitiesStaircase(null as any, [])).toBe(null)
  })

  it('sorts activities by start time when no slots are selected', () => {
    const result = sortActivitiesStaircase(activities, [])

    // Should be sorted chronologically
    expect(result.map((a) => a.getId())).toEqual([
      'activity-1', // 8:00 AM
      'activity-2', // 10:00 AM
      'activity-3', // 11:00 AM
      'activity-4', // 12:00 PM
    ])
  })

  it('prioritizes activities with selections then sorts by start time', () => {
    // Add slots for activity-2 and activity-4
    slots = [
      createMockActivitySlot('activity-2', 600, 615), // 10:00-10:15 AM
      createMockActivitySlot('activity-4', 720, 735), // 12:00-12:15 PM
    ]

    const result = sortActivitiesStaircase(activities, slots)

    // Selected activities first (in chronological order), then unselected ones
    expect(result.map((a) => a.getId())).toEqual([
      'activity-2', // Has slot, 10:00 AM
      'activity-4', // Has slot, 12:00 PM
      'activity-1', // No slot, 8:00 AM
      'activity-3', // No slot, 11:00 AM
    ])
  })

  it('maintains chronological order within selection groups', () => {
    // Create more complex slot selection pattern
    slots = [
      createMockActivitySlot('activity-3', 660, 675), // 11:00-11:15 AM
      createMockActivitySlot('activity-1', 480, 495), // 8:00-8:15 AM
    ]

    const result = sortActivitiesStaircase(activities, slots)

    // Selected activities first (chronologically), then unselected ones (chronologically)
    expect(result.map((a) => a.getId())).toEqual([
      'activity-1', // Has slot, 8:00 AM
      'activity-3', // Has slot, 11:00 AM
      'activity-2', // No slot, 10:00 AM
      'activity-4', // No slot, 12:00 PM
    ])
  })

  it('handles case where all activities have selections', () => {
    // Add slots for all activities
    slots = [
      createMockActivitySlot('activity-1', 480, 495),
      createMockActivitySlot('activity-2', 600, 615),
      createMockActivitySlot('activity-3', 660, 675),
      createMockActivitySlot('activity-4', 720, 735),
    ]

    const result = sortActivitiesStaircase(activities, slots)

    // All activities have slots, so they should be sorted chronologically
    expect(result.map((a) => a.getId())).toEqual([
      'activity-1', // 8:00 AM
      'activity-2', // 10:00 AM
      'activity-3', // 11:00 AM
      'activity-4', // 12:00 PM
    ])
  })

  it('creates new array and does not modify the original', () => {
    const originalOrder = [...activities]
    const result = sortActivitiesStaircase(activities, slots)

    // Result should be a different array
    expect(result).not.toBe(activities)

    // Original array should remain unchanged
    expect(activities).toEqual(originalOrder)
  })
})
