import type { Event, EventService, GrpcConfig } from '@prio-grpc'
import { createGrpcSingleMethodStore } from '@zondax/stores'
import { useCallback, useRef } from 'react'

import { createEventClient, getEventByIdSingle } from '../../api/event'

// We use an alias to avoid conflicts with the Event export from the event module
export type EventEntity = Event.Event

/**
 * Interface representing the state of an event detail, including loading state
 */
export interface EventDetailState {
  event: EventEntity | null
  isLoading: boolean
}

// Create a singleton store instance outside the hook for proper testing
let storeInstance: ReturnType<typeof createEventDetailStore> | null = null

/**
 * Creates a store to fetch events by ID
 */
function createEventDetailStore() {
  return createGrpcSingleMethodStore<GrpcConfig, EventService.EventServiceClient, number, EventEntity | undefined>({
    createClient: createEventClient,
    method: getEventByIdSingle,
  })
}

/**
 * Hook for managing event details
 * Provides an interface to fetch and handle a specific event by ID
 *
 * @returns Object with methods and state for managing event details
 */
export const useEventDetailStore = () => {
  // We use useRef to ensure the store is only created once per component instance
  const storeRef = useRef<ReturnType<typeof createEventDetailStore> | null>(null)

  // Create the store if it doesn't exist
  if (!storeRef.current) {
    if (!storeInstance) {
      storeInstance = createEventDetailStore()
    }
    storeRef.current = storeInstance
  }

  // Get the store instance
  const store = storeRef.current()

  /**
   * Fetches an event by its ID
   */
  const fetchById = useCallback((eventId: number) => {
    store.setInput(eventId)
  }, []) // Empty dependency array to avoid infinite loops
  // TODO:
  // IMPORTANT: We don’t include `store` as a dependency because,
  // although the reference might change per render, the underlying instance is stable.
  // We should improve this in the future to prevent any potential confusion or subtle bugs but is not a huge issue for now.

  return {
    eventDetailData: store.data,

    isLoading: store.isLoading,
    error: store.error,
    lastUpdated: store.lastUpdated,

    setParams: store.setParams,
    fetchById,
  }
}

// Add a reset function to help with testing
export const _resetEventDetailStore = () => {
  storeInstance = null
}
