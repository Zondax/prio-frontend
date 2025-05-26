import { useEffect, useMemo } from 'react'

import { createIdFilter, extractCollection, getDisplayEvents } from '../../../feature'
import {
  type Event,
  type EventCollection,
  type EventCollectionWithSummary,
  type UpdateEventStatusFn,
  useCollectionsStore,
  useEventStore,
} from '../../../stores'
import { useEventFilters } from '../../events/filter-management'
import { createCollectionIdFilter } from '../../events/filter-management/search-filters'

interface UseCollectionByIdResult {
  collectionWithSummary: EventCollectionWithSummary | undefined
  totalEvents?: number
  isCollectionLoading: boolean
  isUpdatingCollection: boolean
  updateExistingCollection: (collectionId: string, data: Partial<EventCollection.AsObject>) => void
  setCollectionParams: (params: any) => void
}

/**
 * useCollectionById
 *
 * Custom hook to encapsulate the logic for fetching and managing a single collection.
 *
 * @param {string} id - The collection ID
 * @returns {UseCollectionByIdResult} - Collection, loading states, update handler, etc.
 */
export function useCollectionById(id: string): UseCollectionByIdResult {
  const {
    setParams: setCollectionParams,
    setInput: setCollectionInput,
    getData: getCollectionData,
    isLoading: isCollectionLoading,
    updateExistingCollection,
    isWriting: isUpdatingCollection,
  } = useCollectionsStore()

  // Create collection filter
  const collectionFilter = useMemo(() => {
    const filter = createIdFilter(id)
    return {
      filters: [filter],
    }
  }, [id])

  // Make collection api call
  useEffect(() => {
    setCollectionInput(collectionFilter)
  }, [setCollectionInput, collectionFilter])

  // Extract collection from response
  const { collectionWithSummary, totalEvents } = useMemo(() => {
    const collectionData = getCollectionData()
    return extractCollection(collectionData)
  }, [getCollectionData])

  return {
    collectionWithSummary,
    totalEvents,
    isCollectionLoading,
    isUpdatingCollection,
    updateExistingCollection,
    setCollectionParams,
  }
}

interface UseCollectionEventsResult {
  events: Event[]
  isEventLoading: boolean
  loadNextPage: () => void
  updateEventStatus: UpdateEventStatusFn
  setEventParams: (params: any) => void
}

/**
 * useCollectionEvents
 *
 * Custom hook to encapsulate the logic for fetching and managing events for a single collection.
 *
 * @param {string} collectionId - The collection ID
 * @returns {UseCollectionEventsResult} - Events, loading states, event update handler, etc.
 */
export function useCollectionEvents(collectionId: string): UseCollectionEventsResult {
  const {
    setParams: setEventParams,
    setInput: setEventInput,
    isLoading: isEventLoading,
    data: eventsData,
    metadata,
    updateEventStatus,
    loadNextPage,
  } = useEventStore()
  const { sort, showPinnedOnly, nlSessionId } = useEventFilters({ metadata })

  // Create event filter
  const eventFilter = useMemo(() => {
    const filter = createCollectionIdFilter(collectionId)
    return {
      filters: [filter],
      sort: sort.current,
      nlSessionId: nlSessionId,
    }
  }, [collectionId, sort.current, nlSessionId])

  // Make event api call
  useEffect(() => {
    setEventInput(eventFilter)
  }, [setEventInput, eventFilter])

  // Get events with proper filtering
  const events = useMemo(() => {
    return getDisplayEvents(eventsData, { pinnedOnly: showPinnedOnly }) ?? []
  }, [eventsData, showPinnedOnly])

  return {
    events,
    isEventLoading,
    loadNextPage,
    updateEventStatus,
    setEventParams,
  }
}
