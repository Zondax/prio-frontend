import { EventCollection, type EventCollectionWithSummary } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { useMemo, useState } from 'react'

import type { CollectionPinningState } from './types'
import {
  extractCollections,
  filterCollectionsByQuery,
  isEventInAnyCollection,
  isEventInCollection,
  toggleEventInCollection as toggleEventInCollectionUtil,
} from './utils'

/**
 * Hook for managing the pinning of events to collections
 * Provides functionality to check if an event is in a collection and toggle its presence
 *
 * @param eventId The ID of the event to check/manage
 * @param collectionsWithSummary Array of collections with their contains_event flag
 * @param addEventToCollection Function to add an event to a collection
 * @param removeEventFromCollection Function to remove an event from a collection
 * @returns Object with methods and state for collection pinning management
 */
export function useCollectionPinning(
  eventId: string,
  collectionsWithSummary: EventCollectionWithSummary[],
  onToggleEventInCollection: (collectionId: string, eventId: string) => Promise<void>
): CollectionPinningState {
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateCollectionDialogOpen, setIsCreateCollectionDialogOpen] = useState(false)

  // Extract collections from collectionsWithSummary
  const collections = useMemo(() => extractCollections(collectionsWithSummary), [collectionsWithSummary])

  // Filter collections based on search query
  const filteredCollections = useMemo(() => filterCollectionsByQuery(collections, searchQuery), [collections, searchQuery])

  // Check if event is in collection using the contains_event flag
  const checkIsInCollection = (collectionId: string) => isEventInCollection(collectionsWithSummary, collectionId)

  // Check if event is in any collection using the contains_event flag
  const checkIsInAnyCollection = () => isEventInAnyCollection(collectionsWithSummary)

  // Toggle event in collection
  const toggleEventInCollection = async (collectionId: string) => {
    await onToggleEventInCollection(collectionId, eventId)
  }

  return {
    collections,
    filteredCollections,
    searchQuery,
    setSearchQuery,
    isInCollection: checkIsInCollection,
    isInAnyCollection: checkIsInAnyCollection,
    toggleEventInCollection,
    isCreateCollectionDialogOpen,
    setIsCreateCollectionDialogOpen,
  }
}
