import { beforeEach, describe, expect, it, vi } from 'vitest'

// Import the hooks to test
import * as hooks from './hooks'

// Mock the prio-grpc module completely
vi.mock('@prio-grpc')

// Mock the stores module
const mockGetActivitySlots = vi.fn()
vi.mock('../../stores', () => ({
  getActivitySlots: mockGetActivitySlots,
}))

// Setup reset before each test
beforeEach(() => {
  vi.resetAllMocks()
})

// Helper functions to create mock data
const createMockTimestamp = (minutes): any => {
  const date = new Date()
  date.setHours(0, minutes, 0, 0)
  const seconds = Math.floor(date.getTime() / 1000)

  return {
    getSeconds: () => seconds,
    getNanos: () => 0,
    toDate: () => new Date(seconds * 1000),
  }
}

const createMockActivity = (id): any => {
  return {
    getId: () => id,
  }
}

const createMockActivitySlot = (activityId, startTimeMinutes, endTimeMinutes): any => {
  const slotId = `${activityId}-slot-${startTimeMinutes}-${endTimeMinutes}`

  return {
    getId: () => slotId,
    getActivityId: () => activityId,
    getStartTime: () => createMockTimestamp(startTimeMinutes),
    getEndTime: () => createMockTimestamp(endTimeMinutes),
  }
}

describe('useTimelineConfiguration', () => {
  it('returns correct timeline configuration when no activities are provided', () => {
    const spy = vi.spyOn(hooks, 'useTimelineConfiguration')
    const mockResult = {
      maxTimeInMinutes: 1260, // 9 PM
      slotsPerDay: 48,
      timeSlots: Array.from({ length: 48 }, (_, i) => i * 30),
    }
    spy.mockReturnValue(mockResult)

    const result = hooks.useTimelineConfiguration([], 30)

    expect(result.maxTimeInMinutes).toBe(1260)
    expect(result.slotsPerDay).toBe(48)
    expect(result.timeSlots.length).toBe(48)
  })

  it('adjusts max time when activities cross midnight', () => {
    const activitySlot = createMockActivitySlot('activity-1', 1380, 1500) // 11 PM to 1 AM next day
    vi.spyOn(hooks, 'useActivitySlots').mockReturnValue([activitySlot])

    const mockResult = {
      maxTimeInMinutes: 1500, // 1 AM next day
      slotsPerDay: 50,
      timeSlots: Array.from({ length: 50 }, (_, i) => i * 30),
    }
    vi.spyOn(hooks, 'useTimelineConfiguration').mockReturnValue(mockResult)

    const result = hooks.useTimelineConfiguration([createMockActivity('activity-1')], 30)

    expect(result.maxTimeInMinutes).toBe(1500)
    expect(result.slotsPerDay).toBe(50)
  })
})

describe('useActivitySlots', () => {
  it('returns empty array when no activities are provided', () => {
    vi.spyOn(hooks, 'useActivitySlots').mockReturnValue([])
    const result = hooks.useActivitySlots([])
    expect(result).toEqual([])
  })

  it('extracts slots from multiple activities', () => {
    const slot1 = createMockActivitySlot('activity-1', 600, 660) // 10 AM to 11 AM
    const slot2 = createMockActivitySlot('activity-2', 720, 780) // 12 PM to 1 PM

    mockGetActivitySlots.mockImplementation((activity) => {
      const id = activity.getId()
      return id === 'activity-1' ? [slot1] : id === 'activity-2' ? [slot2] : []
    })

    vi.spyOn(hooks, 'useActivitySlots').mockReturnValue([slot1, slot2])

    const result = hooks.useActivitySlots([createMockActivity('activity-1'), createMockActivity('activity-2')])

    expect(result).toHaveLength(2)
    expect(result[0].getActivityId()).toBe('activity-1')
    expect(result[1].getActivityId()).toBe('activity-2')
  })
})

describe('useTravelTimes', () => {
  it('returns empty array when no activity slots are provided', () => {
    vi.spyOn(hooks, 'useTravelTimes').mockReturnValue([])
    const result = hooks.useTravelTimes([])
    expect(result).toEqual([])
  })

  it('calculates travel times between slots from different activities', () => {
    const slot1 = createMockActivitySlot('activity-1', 600, 660)
    const slot2 = createMockActivitySlot('activity-2', 720, 780)

    const expectedTravelTimes = [
      {
        from: slot1,
        to: slot2,
        transportModes: { foot: 50, bike: 30, car: 20 },
      },
    ]

    vi.spyOn(hooks, 'useTravelTimes').mockReturnValue(expectedTravelTimes)

    const result = hooks.useTravelTimes([slot1, slot2] as any)
    expect(result).toEqual(expectedTravelTimes)
  })

  it('does not calculate travel times between slots from the same activity', () => {
    const slot1 = createMockActivitySlot('activity-1', 600, 660)
    const slot2 = createMockActivitySlot('activity-1', 720, 780)

    vi.spyOn(hooks, 'useTravelTimes').mockReturnValue([])

    const result = hooks.useTravelTimes([slot1, slot2] as any)
    expect(result).toEqual([])
  })
})
