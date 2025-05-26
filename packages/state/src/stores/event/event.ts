import { Common, type EventService, type GrpcConfig, Event as GrpcEvent } from '@prio-grpc'
import { createGrpcOptimisticStore, createPageableStore } from '@zondax/stores'
import { useCallback, useRef } from 'react'

import { type EventInput, type EventListMetadata, createEventClient, getEventList, upsertEventState } from '../../api/event'

export type Event = GrpcEvent.Event
export type FilterTag = GrpcEvent.FilterTag
export { FilterTagType, MapMarker, MapMarkerKind, MarkerEvent } from '@prio-grpc/entities/proto/api/v1/event_pb'

export type EventStatus = Common.EventStatus
export type UpdateEventStatusFn = (eventId: number, status: Common.EventStatus) => void

/**
 * Data structure for event pinning operations
 * Contains both the full map of event states by ID and the specific event being updated
 */
export interface EventPinningData {
  eventStates: Map<number, Common.EventStatus>
  eventToUpdate: {
    eventId: number
    status: Common.EventStatus
  }
}

/**
 * Creates a store for fetching events from the API
 * Uses the pageable store pattern for read operations with pagination
 * @returns A store for fetching event data with pagination, filtering and sorting
 */
function createReadStore() {
  return createPageableStore<GrpcConfig, EventService.EventServiceClient, EventInput, GrpcEvent.Event, EventListMetadata>({
    createClient: createEventClient,
    fetch: getEventList,
  })
}

/**
 * Creates a store for managing event pinning with optimistic updates
 * Uses the optimistic store pattern to provide immediate UI feedback
 * @returns A store with write capabilities and optimistic UI updates
 */
function createWriteStore() {
  return createGrpcOptimisticStore<GrpcConfig, EventService.EventServiceClient, EventPinningData, boolean>(
    {
      createClient: createEventClient,
      read: async () => ({
        eventStates: new Map<number, Common.EventStatus>(),
        eventToUpdate: {
          eventId: 0,
          status: Common.EventStatus.EVENT_STATUS_NONE,
        },
      }),
      write: async (client, params, data) => {
        const { eventToUpdate } = data
        if (!eventToUpdate || !eventToUpdate.eventId) {
          throw new Error('No event specified for update')
        }

        const status = eventToUpdate.status
        const response = await upsertEventState(client, params, eventToUpdate.eventId, status)
        return response.getSuccess()
      },
      handlers: {
        mergeUpdate: mergeStatus,
      },
    },
    {
      debounceTime: 0,
    }
  )
}

/**
 * Gets events with optimistic pinning updates merged into the backend data
 * Creates a single coherent view combining confirmed backend data with pending changes
 *
 * @param backendData Data from the read store (backend)
 * @param optimisticData Data from the write store (optimistic updates)
 * @returns Events with optimistic pinning updates merged in
 */
function getMergedEvents(backendData: GrpcEvent.GetEventsResponse, optimisticData?: EventPinningData): GrpcEvent.GetEventsResponse {
  // If no optimistic data is available, return backend data unchanged
  if (!optimisticData?.eventStates.size) return backendData

  try {
    // Clone backend data to avoid modifying it directly
    const clonedData = backendData.clone()
    const events = clonedData.getEventsList()

    if (!events?.length) return clonedData

    // Update each event's pinned status with optimistic data
    for (const event of events) {
      const eventId = event.getId()
      if (!eventId) continue

      // If we have updated pinned status for this event in optimistic data, use it
      if (optimisticData.eventStates.has(eventId)) {
        const status = optimisticData.eventStates.get(eventId)
        if (status !== undefined) {
          event.setStatus(status)
        }
      }
    }

    return clonedData
  } catch (error) {
    console.error('[EventStore] Error applying optimistic updates:', error)
    // On error, return original backend data
    return backendData
  }
}

/**
 * Updates an event's status in the map
 *
 * @param currentMap Current map of event statuses by ID
 * @param eventId Event ID to update
 * @param status New status to set
 * @returns Updated map with changes applied
 */
export function updateEventStatusInMap(
  currentMap: Map<number, Common.EventStatus>,
  eventId: number,
  status: Common.EventStatus
): Map<number, Common.EventStatus> {
  // Create a copy of the current map
  const updatedMap = new Map<number, Common.EventStatus>(currentMap)

  // Update the status for this event
  updatedMap.set(eventId, status)

  return updatedMap
}

/**
 * React hook for managing event data with optimistic updates
 * Provides a unified interface for reading and writing event data
 * Compatible with the pageable store interface while adding optimistic updates
 *
 * @returns Object with methods and state for event management
 */
export const useEventStore = () => {
  const readStoreRef = useRef<ReturnType<typeof createReadStore> | null>(null)
  const writeStoreRef = useRef<ReturnType<typeof createWriteStore> | null>(null)

  // Ensure stores are created only once
  if (!readStoreRef.current) readStoreRef.current = createReadStore()
  if (!writeStoreRef.current) writeStoreRef.current = createWriteStore()

  const readStore = readStoreRef.current()
  const writeStore = writeStoreRef.current()

  /**
   * Sets parameters for both read and write stores
   */
  const setParams = useCallback(
    (params: GrpcConfig) => {
      readStore.setParams(params)
      writeStore.setParams(params)
    },
    [readStore.setParams, writeStore.setParams]
  )

  /**
   * Updates the status of an event with optimistic updates
   * Uses the update method of the write store to handle optimistic updates
   *
   * @param eventId The ID of the event to update
   * @param status The new status to set
   * @returns Promise resolving to the operation result
   */
  const updateEventStatus = useCallback(
    (eventId: number, status: Common.EventStatus) => {
      const partialData: Partial<EventPinningData> = {
        eventToUpdate: {
          eventId,
          status,
        },
      }

      if (writeStore.update) {
        writeStore.update(partialData)
      }
    },
    [writeStore.update]
  )

  /**
   * Gets all data with optimistic updates applied
   * Returns a unified view with optimistic updates
   */
  const getMergedData = useCallback(() => {
    if (!readStore.data || readStore.data.length === 0) return []

    // If there are no optimistic updates, return the original data
    const writeData = writeStore.getData()
    if (!writeData || !writeData.eventStates.size) return readStore.data

    // Create a GetEventsResponse from the events data
    const response = new GrpcEvent.GetEventsResponse()
    response.setEventsList(readStore.data)

    // Merge with optimistic updates
    const mergedResponse = getMergedEvents(response, writeData)
    return mergedResponse.getEventsList()
  }, [readStore.data, writeStore.getData])

  const memoizedSetInput = useCallback(
    (input: Partial<EventInput>) => {
      // readStore is guaranteed to be non-null after initialization phase
      if (readStore && typeof readStore.setInput === 'function') {
        readStore.setInput(input)
      }
    },
    [readStore] // readStore instance is stable
  )

  return {
    // Pageable store interface with merged data
    data: getMergedData(),
    metadata: readStore.metadata,
    metrics: readStore.metrics,
    hasReachedEnd: readStore.hasReachedEnd,
    loadNextPage: readStore.loadNextPage,
    isLoading: readStore.isLoading || readStore.isInitLoading,
    error: readStore.error,
    setInput: memoizedSetInput,

    // Common properties
    setParams,

    // Write methods
    updateEventStatus,
    isWriting: writeStore.isWriting,
  }
}

/**
 * Merge function that handles the actual status update logic
 * Updates the status map based on the current state and partial data
 * @param storeData Current data from the store - provided by the store itself
 * @param partialData Partial data for the update - provided by us
 */
export const mergeStatus = (storeData: EventPinningData, partialData: Partial<EventPinningData>): EventPinningData => {
  if (!partialData.eventToUpdate) {
    throw new Error('No event to update provided')
  }

  const { eventId, status } = partialData.eventToUpdate

  // Get the current map from store data
  const currentMap = storeData.eventStates || new Map<number, Common.EventStatus>()
  const updatedMap = updateEventStatusInMap(currentMap, eventId, status)

  return {
    eventStates: updatedMap,
    eventToUpdate: partialData.eventToUpdate,
  }
}
