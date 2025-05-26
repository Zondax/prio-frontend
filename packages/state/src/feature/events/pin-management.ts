import { Common, type Event } from '@prio-grpc'
import { Filter, FilterKind } from '@prio-grpc/entities/proto/api/v1/common_pb'

import type { UpdateEventStatusFn } from '../../stores/event/event'

/**
 * Handles pinning/unpinning an event by updating its status
 * Abstracts the logic for event status management to be reused across platforms
 *
 * @param event The event to toggle pinning on
 * @param updateEventStatus Function from the store to update event status
 */
export function toggleEventPin(event: Event.Event, updateEventStatus: UpdateEventStatusFn): void {
  if (!event) return

  // Get current status and toggle it
  const currentStatus = event.getStatus()
  const newStatus =
    currentStatus === Common.EventStatus.EVENT_STATUS_PINNED ? Common.EventStatus.EVENT_STATUS_NONE : Common.EventStatus.EVENT_STATUS_PINNED

  // Call the updateEventStatus method with the numeric ID and new status
  updateEventStatus(event.getId(), newStatus)
}

/**
 * Creates a pin toggle handler that can be directly passed to components
 *
 * @param updateEventStatus Function from the store to update event status
 * @returns A function that takes an event and toggles its pin status
 */
export function toggleEventPinHandler(updateEventStatus: UpdateEventStatusFn): (event: Event.Event) => void {
  return (event: Event.Event) => toggleEventPin(event, updateEventStatus)
}

/**
 * Checks if an event is pinned (has PINNED status)
 * @param event The Event object to check
 * @returns Boolean indicating whether the event is pinned
 */
export function isEventPinned(event: Event.Event): boolean {
  return event.getStatus() === Common.EventStatus.EVENT_STATUS_PINNED
}

/**
 * Toggles the pin status of an event
 * @param currentStatus The current status of the event
 * @returns The new status (PINNED if not already pinned, NONE otherwise)
 */
export function togglePinnedStatus(currentStatus: Common.EventStatus): Common.EventStatus {
  return currentStatus === Common.EventStatus.EVENT_STATUS_PINNED
    ? Common.EventStatus.EVENT_STATUS_NONE
    : Common.EventStatus.EVENT_STATUS_PINNED
}

/**
 * Creates a filter for pinned events
 * @param isPinned Whether to filter for pinned events
 * @returns A Filter object configured to filter by pinned status
 */
export function createPinnedFilter(isPinned: boolean): Filter {
  const filter = new Filter()
  filter.setKind(FilterKind.FILTER_KIND_STATUS)
  filter.setName('status')
  filter.setEventStatus(isPinned ? Common.EventStatus.EVENT_STATUS_PINNED : Common.EventStatus.EVENT_STATUS_NONE)
  return filter
}

/**
 * TODO: This is a temporary solution
 *
 * Current problem:
 * 1. The map uses markers while explore uses events from eventsStore
 * 2. When an event is displayed in EventDetail, if it comes from the map,
 *    it might not exist in eventsStore and could break when checking its status
 * 3. Local state is needed to maintain consistency between views as
 *    markers and store events don't share the same data source
 *
 * We have to refactor in the future to avoid using local state for this.
 */

/**
 * Toggle pin with optimistic updates for immediate UI feedback
 * This is a temporary patch to handle local state until proper refactoring
 * of map and event detail integration
 *
 * @param event The event to toggle pinning on
 * @param localPinnedEvents Record of local pinned state by event ID
 * @param setLocalPinnedEvents Function to update local pinned state
 * @param updateEventStatus Function from the store to update event status
 * @returns Promise from the API request
 */
export function togglePinWithLocalState(
  event: Event.Event,
  localPinnedEvents: Record<string, boolean>,
  setLocalPinnedEvents: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void,
  updateEventStatus: UpdateEventStatusFn
): void {
  const eventId = event.getId().toString()

  // Check pinned status (first from local state, then from event)
  const currentIsPinned = eventId in localPinnedEvents ? localPinnedEvents[eventId] : isEventPinned(event)
  const newIsPinned = !currentIsPinned

  // Update local state for optimistic UI
  setLocalPinnedEvents((prev) => ({
    ...prev,
    [eventId]: newIsPinned,
  }))

  if (newIsPinned) {
    console.log('status none', event.getId())
    event.setStatus(Common.EventStatus.EVENT_STATUS_NONE)
  } else {
    console.log('status pinned', event.getId())
    event.setStatus(Common.EventStatus.EVENT_STATUS_PINNED)
  }

  // Call the api handler directly with the correct status
  updateEventStatus(event.getId(), newIsPinned ? Common.EventStatus.EVENT_STATUS_PINNED : Common.EventStatus.EVENT_STATUS_NONE)
}

/**
 * Helper function to find event by ID and check if it's pinned
 * Uses both the provided event finder and local state as fallback
 *
 * @param eventId The ID of the event to check
 * @param findEventById Function to find an event by its ID
 * @param localPinnedEvents Local state that tracks pinned events
 * @returns Boolean indicating whether the event is pinned
 */
export function isEventPinnedById(eventId: string, localPinnedEvents: Record<string, boolean>, events: Event.Event[]): boolean {
  // First check the event's current status
  const event = events.find((e: Event.Event) => e.getId().toString() === eventId)
  if (event) {
    return isEventPinned(event)
  }

  // If no event found, fall back to local state
  // This maintains pin status for events that might not be in the current events list,
  // such as when an event is pinned from the map view but hasn't been loaded in the explore view yet
  return eventId in localPinnedEvents ? localPinnedEvents[eventId] : false
}
