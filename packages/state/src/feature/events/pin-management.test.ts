import { Common, type Event } from '@prio-grpc'
import { describe, expect, it, vi } from 'vitest'

import { isEventPinned, toggleEventPin, toggleEventPinHandler, togglePinnedStatus } from './pin-management'

describe('isEventPinned', () => {
  it('returns true when event status is PINNED', () => {
    // Setup mock event with pinned status
    const mockEvent = {
      getStatus: () => Common.EventStatus.EVENT_STATUS_PINNED,
    } as unknown as Event.Event

    // Test
    const result = isEventPinned(mockEvent)

    // Verify
    expect(result).toBe(true)
  })

  it('returns false when event status is not PINNED', () => {
    // Setup mock event with non-pinned status
    const mockEvent = {
      getStatus: () => Common.EventStatus.EVENT_STATUS_NONE,
    } as unknown as Event.Event

    // Test
    const result = isEventPinned(mockEvent)

    // Verify
    expect(result).toBe(false)
  })

  it('returns false for other statuses', () => {
    // Setup mock event with other status
    const mockEvent = {
      getStatus: () => Common.EventStatus.EVENT_STATUS_UNSPECIFIED,
    } as unknown as Event.Event

    // Test
    const result = isEventPinned(mockEvent)

    // Verify
    expect(result).toBe(false)
  })
})

describe('togglePinnedStatus', () => {
  it('returns PINNED status when current status is NONE', () => {
    // Test
    const result = togglePinnedStatus(Common.EventStatus.EVENT_STATUS_NONE)

    // Verify
    expect(result).toBe(Common.EventStatus.EVENT_STATUS_PINNED)
  })

  it('returns NONE status when current status is PINNED', () => {
    // Test
    const result = togglePinnedStatus(Common.EventStatus.EVENT_STATUS_PINNED)

    // Verify
    expect(result).toBe(Common.EventStatus.EVENT_STATUS_NONE)
  })

  it('returns PINNED status when current status is UNSPECIFIED', () => {
    // Test
    const result = togglePinnedStatus(Common.EventStatus.EVENT_STATUS_UNSPECIFIED)

    // Verify
    expect(result).toBe(Common.EventStatus.EVENT_STATUS_PINNED)
  })
})

describe('toggleEventPin', () => {
  it('calls updateEventStatus with correct parameters when toggling from NONE to PINNED', () => {
    // Setup
    const mockEvent = {
      getId: () => 123,
      getStatus: () => Common.EventStatus.EVENT_STATUS_NONE,
    } as unknown as Event.Event

    const mockUpdateEventStatus = vi.fn().mockResolvedValue(true)

    // Test
    toggleEventPin(mockEvent, mockUpdateEventStatus)

    // Verify
    expect(mockUpdateEventStatus).toHaveBeenCalledWith(123, Common.EventStatus.EVENT_STATUS_PINNED)
    expect(mockUpdateEventStatus).toHaveBeenCalledTimes(1)
  })

  it('calls updateEventStatus with correct parameters when toggling from PINNED to NONE', () => {
    // Setup
    const mockEvent = {
      getId: () => 456,
      getStatus: () => Common.EventStatus.EVENT_STATUS_PINNED,
    } as unknown as Event.Event

    const mockUpdateEventStatus = vi.fn().mockResolvedValue(true)

    // Test
    toggleEventPin(mockEvent, mockUpdateEventStatus)

    // Verify
    expect(mockUpdateEventStatus).toHaveBeenCalledWith(456, Common.EventStatus.EVENT_STATUS_NONE)
    expect(mockUpdateEventStatus).toHaveBeenCalledTimes(1)
  })

  it('does nothing when event is undefined', () => {
    // Setup
    const mockUpdateEventStatus = vi.fn().mockResolvedValue(true)

    // Test
    toggleEventPin(undefined as unknown as Event.Event, mockUpdateEventStatus)

    // Verify
    expect(mockUpdateEventStatus).not.toHaveBeenCalled()
  })
})

describe('toggleEventPinHandler', () => {
  it('returns a function that calls toggleEventPin with the correct parameters', () => {
    // Setup
    const mockUpdateEventStatus = vi.fn().mockResolvedValue(true)
    const mockEvent = {
      getId: () => 789,
      getStatus: () => Common.EventStatus.EVENT_STATUS_NONE,
    } as unknown as Event.Event

    // Create the handler
    const handler = toggleEventPinHandler(mockUpdateEventStatus)

    // Test
    handler(mockEvent)

    // Verify
    expect(mockUpdateEventStatus).toHaveBeenCalledWith(789, Common.EventStatus.EVENT_STATUS_PINNED)
    expect(mockUpdateEventStatus).toHaveBeenCalledTimes(1)
  })

  it('creates a handler that can be called multiple times with different events', () => {
    // Setup
    const mockUpdateEventStatus = vi.fn().mockResolvedValue(true)

    const mockEvent1 = {
      getId: () => 123,
      getStatus: () => Common.EventStatus.EVENT_STATUS_NONE,
    } as unknown as Event.Event

    const mockEvent2 = {
      getId: () => 456,
      getStatus: () => Common.EventStatus.EVENT_STATUS_PINNED,
    } as unknown as Event.Event

    // Create the handler
    const handler = toggleEventPinHandler(mockUpdateEventStatus)

    // Test
    handler(mockEvent1)
    handler(mockEvent2)

    // Verify
    expect(mockUpdateEventStatus).toHaveBeenCalledTimes(2)
    expect(mockUpdateEventStatus).toHaveBeenNthCalledWith(1, 123, Common.EventStatus.EVENT_STATUS_PINNED)
    expect(mockUpdateEventStatus).toHaveBeenNthCalledWith(2, 456, Common.EventStatus.EVENT_STATUS_NONE)
  })
})
