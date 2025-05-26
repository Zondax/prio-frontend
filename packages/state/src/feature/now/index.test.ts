import { Activity } from '@prio-grpc'
import { describe, expect, it } from 'vitest'

import { createActivityIndicesMap, createActivityMap } from './index'

// Helper to create a mock activity for testing
function createMockActivity(id: string): Activity.Activity {
  const activity = new Activity.Activity()
  activity.setId(id)
  return activity
}

describe('Now Feature', () => {
  describe('createActivityMap', () => {
    it('should create an empty map for empty array', () => {
      const activities: Activity.Activity[] = []
      const map = createActivityMap(activities)

      expect(map.size).toBe(0)
    })

    it('should create a map with correct activity entries', () => {
      const activity1 = createMockActivity('a1')
      const activity2 = createMockActivity('a2')
      const activity3 = createMockActivity('a3')

      const activities = [activity1, activity2, activity3]
      const map = createActivityMap(activities)

      expect(map.size).toBe(3)
      expect(map.get('a1')).toBe(activity1)
      expect(map.get('a2')).toBe(activity2)
      expect(map.get('a3')).toBe(activity3)
    })

    it('should handle duplicate IDs by keeping the last activity', () => {
      const activity1 = createMockActivity('a1')
      const activity2 = createMockActivity('a1') // Same ID as activity1

      const activities = [activity1, activity2]
      const map = createActivityMap(activities)

      expect(map.size).toBe(1)
      expect(map.get('a1')).toBe(activity2) // The last one should be kept
    })
  })

  describe('createActivityIndicesMap', () => {
    it('should create an empty map for empty array', () => {
      const activities: Activity.Activity[] = []
      const map = createActivityIndicesMap(activities)

      expect(map.size).toBe(0)
    })

    it('should create a map with correct activity indices', () => {
      const activity1 = createMockActivity('a1')
      const activity2 = createMockActivity('a2')
      const activity3 = createMockActivity('a3')

      const activities = [activity1, activity2, activity3]
      const map = createActivityIndicesMap(activities)

      expect(map.size).toBe(3)
      expect(map.get('a1')).toBe(0)
      expect(map.get('a2')).toBe(1)
      expect(map.get('a3')).toBe(2)
    })

    it('should handle duplicate IDs by keeping the last index', () => {
      const activity1 = createMockActivity('a1')
      const activity2 = createMockActivity('a2')
      const activity3 = createMockActivity('a1') // Same ID as activity1

      const activities = [activity1, activity2, activity3]
      const map = createActivityIndicesMap(activities)

      expect(map.size).toBe(2)
      expect(map.get('a1')).toBe(2) // Index of the last instance
      expect(map.get('a2')).toBe(1)
    })
  })
})
