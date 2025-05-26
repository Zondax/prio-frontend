import type { Event, EventService, GrpcConfig } from '@prio-grpc'
import { createGrpcSingleMethodStore } from '@zondax/stores'
import { useCallback, useRef } from 'react'

import { type EventInput, createEventClient, getEventMapMarkers } from '../api/event'

export { MapMarker, MapMarkerKind } from '@prio-grpc/entities/proto/api/v1/event_pb'

/**
 * Creates a store for fetching event map markers from the API
 * Uses the basic grpc store pattern for simple read operations
 * @returns A store for fetching map marker data
 */
function createMapMarkersStore() {
  return createGrpcSingleMethodStore<GrpcConfig, EventService.EventServiceClient, EventInput, Event.GetEventMapMarkersResponse>({
    createClient: createEventClient,
    method: getEventMapMarkers,
  })
}

/**
 * React hook for fetching and managing event map markers
 * Provides a simplified store for map data that doesn't require pagination
 *
 * @returns Object with methods and state for map marker management
 */
export const useEventMapMarkersStore = () => {
  const storeRef = useRef<ReturnType<typeof createMapMarkersStore> | null>(null)

  // Ensure store is created only once
  if (!storeRef.current) storeRef.current = createMapMarkersStore()

  const store = storeRef.current()

  /**
   * Sets parameters for the store
   */
  const setParams = useCallback((params: GrpcConfig) => {
    store.setParams(params)
  }, [])

  /**
   * Sets the input for the store
   */
  const setInput = useCallback((input: EventInput) => {
    store.setInput(input)
  }, [])

  return {
    // Data
    markers: store.data?.getMarkersList() || [],

    // Status
    isLoading: store.isLoading,
    error: store.error,

    // Methods
    setParams,
    setInput,
  }
}
