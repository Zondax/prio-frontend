import { Activity, Timestamp } from '@prio-grpc'
import { describe, expect, it } from 'vitest'

import { type ActivitySlotUpdateData, mergeSlots, updateSlotInMap } from './activities'

describe('Activities Store', () => {
  describe('updateSlotInMap', () => {
    it('should add a new slot to an empty map', () => {
      const currentMap = new Map<string, Activity.ActivitySlot[]>()
      const activityId = '123'
      const slot = new Activity.ActivitySlot()
      slot.setActivityId(activityId)

      const startTime = new Timestamp()
      startTime.fromDate(new Date('2024-01-01T10:00:00Z'))
      slot.setStartTime(startTime)

      const endTime = new Timestamp()
      endTime.fromDate(new Date('2024-01-01T11:00:00Z'))
      slot.setEndTime(endTime)

      const result = updateSlotInMap(currentMap, activityId, slot, false)

      expect(result.size).toBe(1)
      expect(result.get(activityId)).toHaveLength(1)
      expect(result.get(activityId)?.[0]).toBe(slot)
    })

    it('should update an existing slot in the map', () => {
      const currentMap = new Map<string, Activity.ActivitySlot[]>()
      const activityId = '123'
      const slot1 = new Activity.ActivitySlot()
      slot1.setActivityId(activityId)

      const startTime = new Timestamp()
      startTime.fromDate(new Date('2024-01-01T10:00:00Z'))
      slot1.setStartTime(startTime)

      const endTime = new Timestamp()
      endTime.fromDate(new Date('2024-01-01T11:00:00Z'))
      slot1.setEndTime(endTime)

      const slot2 = new Activity.ActivitySlot()
      slot2.setActivityId(activityId)
      slot2.setStartTime(startTime)
      slot2.setEndTime(endTime)
      slot2.setId('new-id')

      currentMap.set(activityId, [slot1])

      const result = updateSlotInMap(currentMap, activityId, slot2, false)

      expect(result.size).toBe(1)
      expect(result.get(activityId)).toHaveLength(1)
      expect(result.get(activityId)?.[0].getId()).toBe('new-id')
    })

    it('should delete a slot from the map', () => {
      const currentMap = new Map<string, Activity.ActivitySlot[]>()
      const activityId = '123'
      const slot = new Activity.ActivitySlot()
      slot.setActivityId(activityId)

      const startTime = new Timestamp()
      startTime.fromDate(new Date('2024-01-01T10:00:00Z'))
      slot.setStartTime(startTime)

      const endTime = new Timestamp()
      endTime.fromDate(new Date('2024-01-01T11:00:00Z'))
      slot.setEndTime(endTime)

      currentMap.set(activityId, [slot])

      const result = updateSlotInMap(currentMap, activityId, slot, true)

      expect(result.size).toBe(1)
      expect(result.get(activityId)).toHaveLength(0)
    })

    it('should not create entry for non-existent activity when deleting', () => {
      const currentMap = new Map<string, Activity.ActivitySlot[]>()
      const activityId = '123'
      const slot = new Activity.ActivitySlot()
      slot.setActivityId(activityId)

      const result = updateSlotInMap(currentMap, activityId, slot, true)

      expect(result.size).toBe(0)
    })
  })

  describe('mergeSlots', () => {
    it('should merge a new slot update', () => {
      const currentData: ActivitySlotUpdateData = {
        slotsByActivityId: new Map<string, Activity.ActivitySlot[]>(),
        slotToUpdate: {
          activityId: '',
          slot: new Activity.ActivitySlot(),
          isDelete: false,
        },
      }

      const slot = new Activity.ActivitySlot()
      slot.setActivityId('123')

      const startTime = new Timestamp()
      startTime.fromDate(new Date('2024-01-01T10:00:00Z'))
      slot.setStartTime(startTime)

      const endTime = new Timestamp()
      endTime.fromDate(new Date('2024-01-01T11:00:00Z'))
      slot.setEndTime(endTime)

      const partialData: Partial<ActivitySlotUpdateData> = {
        slotToUpdate: {
          activityId: '123',
          slot,
          isDelete: false,
        },
      }

      const result = mergeSlots(currentData, partialData)

      expect(result.slotsByActivityId.size).toBe(1)
      expect(result.slotsByActivityId.get('123')).toHaveLength(1)
      expect(result.slotToUpdate).toEqual(partialData.slotToUpdate)
    })

    it('should throw error when no slot update is provided', () => {
      const currentData: ActivitySlotUpdateData = {
        slotsByActivityId: new Map<string, Activity.ActivitySlot[]>(),
        slotToUpdate: {
          activityId: '',
          slot: new Activity.ActivitySlot(),
          isDelete: false,
        },
      }

      const partialData: Partial<ActivitySlotUpdateData> = {}

      expect(() => mergeSlots(currentData, partialData)).toThrow('No slot to update provided')
    })
  })
})
