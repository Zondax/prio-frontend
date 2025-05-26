import { Common } from '@prio-grpc'
import { describe, expect, it } from 'vitest'

import { type EventPinningData, mergeStatus, updateEventStatusInMap } from './event'

describe('Event Store', () => {
  describe('updateEventStatusInMap', () => {
    it('should add a new event status to an empty map', () => {
      const currentMap = new Map<number, Common.EventStatus>()
      const eventId = 123
      const status = Common.EventStatus.EVENT_STATUS_PINNED

      const result = updateEventStatusInMap(currentMap, eventId, status)

      expect(result.size).toBe(1)
      expect(result.get(eventId)).toBe(status)
    })

    it('should update an existing event status in the map', () => {
      const currentMap = new Map<number, Common.EventStatus>()
      const eventId = 123
      const initialStatus = Common.EventStatus.EVENT_STATUS_NONE
      const newStatus = Common.EventStatus.EVENT_STATUS_PINNED

      currentMap.set(eventId, initialStatus)

      const result = updateEventStatusInMap(currentMap, eventId, newStatus)

      expect(result.size).toBe(1)
      expect(result.get(eventId)).toBe(newStatus)
    })
  })

  describe('mergeStatus', () => {
    it('should merge a new event status update', () => {
      const currentData: EventPinningData = {
        eventStates: new Map<number, Common.EventStatus>(),
        eventToUpdate: {
          eventId: 0,
          status: Common.EventStatus.EVENT_STATUS_NONE,
        },
      }

      const partialData: Partial<EventPinningData> = {
        eventToUpdate: {
          eventId: 123,
          status: Common.EventStatus.EVENT_STATUS_PINNED,
        },
      }

      const result = mergeStatus(currentData, partialData)

      expect(result.eventStates.size).toBe(1)
      expect(result.eventStates.get(123)).toBe(Common.EventStatus.EVENT_STATUS_PINNED)
      expect(result.eventToUpdate).toEqual(partialData.eventToUpdate)
    })

    it('should throw error when no event update is provided', () => {
      const currentData: EventPinningData = {
        eventStates: new Map<number, Common.EventStatus>(),
        eventToUpdate: {
          eventId: 0,
          status: Common.EventStatus.EVENT_STATUS_NONE,
        },
      }

      const partialData: Partial<EventPinningData> = {}

      expect(() => mergeStatus(currentData, partialData)).toThrow('No event to update provided')
    })
  })
})
