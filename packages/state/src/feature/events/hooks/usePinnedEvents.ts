import { EventStatus } from '@prio-grpc/entities/proto/api/v1/common_pb'
import { useCallback, useState } from 'react'

import type { Event } from '../../../stores'
import type { UpdateEventStatusFn } from '../../../stores/event/event'
import { isEventPinnedById, togglePinWithLocalState } from '../pin-management'

/**
 * usePinnedEvents
 * Hook to manage local pinning state for events and provide pin toggle/check handlers.
 * TODO: This is a temporary patch. We shouldn't handle local state here.
 * We're losing the store's optimistic update, but we're doing it because
 * we need to refactor the integration between the map and event detail.
 * The immediate feedback works well when the event comes from explore
 * (we could use the events store), but it doesn't work well when the event
  // comes from the map. This is a temporary solution until we refactor
 * @param events - The list of events to check pin status against
 * @param updateEventStatus - Callback to update event status (pin/unpin) remotely
 */
export function usePinnedEvents(events: Event[], updateEventStatus: UpdateEventStatusFn) {
  const [localPinnedEvents, setLocalPinnedEvents] = useState<Record<string, boolean>>({})

  // Toggle pin with either external handler or local state
  const togglePin = useCallback(
    (event: Event) => {
      return togglePinWithLocalState(event, localPinnedEvents, setLocalPinnedEvents, updateEventStatus)
    },
    [localPinnedEvents, updateEventStatus]
  )

  // Function to check if an event is pinned
  const checkEventPinnedById = useCallback(
    (eventId: string) => {
      return isEventPinnedById(eventId, localPinnedEvents, events)
    },
    [localPinnedEvents, events]
  )

  // Function to handle bulk pinning for multiple events
  const handleBulkPin = useCallback(
    (eventIds: (string | number)[]) => {
      for (const eventId of eventIds) {
        const event = events.find((e) => e.getId().toString() === eventId.toString())
        if (event) {
          togglePin(event)
        }
      }
      return true
    },
    [events, togglePin]
  )

  return {
    togglePin,
    checkEventPinnedById,
    handleBulkPin,
  }
}
