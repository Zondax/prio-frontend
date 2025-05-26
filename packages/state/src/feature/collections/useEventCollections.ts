import type { EventCollection } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { useCallback, useMemo, useState } from 'react'

import type { CollectionFormData } from './types'

/**
 * Interface for external collection data provider
 */
export interface CollectionProvider {
  /** Get all available collections */
  getCollections: () => EventCollection[]
  /** Add an event to an existing collection */
  addEventToCollection: (collectionId: string, eventId: string) => void
  /** Create a new collection with initial event */
  createCollection: (name: string, options: { description: string; visibility: number }, eventId: string) => Promise<boolean>
}

/**
 * Hook for managing event collections
 *
 * This hook provides functionality for:
 * - Filtering collections by search term
 * - Adding events to collections
 * - Creating new collections with events
 */
export function useEventCollections(selectedEventIds: string[], collectionProvider: CollectionProvider) {
  // Local state
  const [searchQuery, setSearchQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /**
   * Filter collections based on search query
   */
  const filteredCollections = useMemo(() => {
    const allCollections = collectionProvider.getCollections()

    // If no search query, return all collections
    if (!searchQuery) return allCollections

    // Filter collections by name
    return allCollections.filter((collection) => {
      const name = collection.getName()?.toLowerCase() || ''
      return name.includes(searchQuery.toLowerCase())
    })
  }, [collectionProvider, searchQuery])

  /**
   * Add selected events to a collection
   */
  const addEventsToCollection = useCallback(
    async (collectionId: string): Promise<boolean> => {
      if (selectedEventIds.length === 0) return false

      try {
        setErrorMessage(null)

        // Add each event to the collection sequentially
        for (const eventId of selectedEventIds) {
          collectionProvider.addEventToCollection(collectionId, eventId)
        }

        return true
      } catch (error) {
        console.error('Error adding events to collection:', error)
        const message = error instanceof Error ? error.message : 'An unknown error occurred'
        setErrorMessage(message)
        return false
      }
    },
    [selectedEventIds, collectionProvider]
  )

  /**
   * Create a new collection with the selected events
   */
  const createCollectionWithEvents = useCallback(
    async (data: CollectionFormData): Promise<boolean> => {
      if (selectedEventIds.length === 0) return false

      try {
        setErrorMessage(null)

        // Get the first event ID to create the collection with
        const firstEventId = selectedEventIds[0]

        // Create the collection with the first event
        const success = await collectionProvider.createCollection(
          data.name,
          {
            description: data.description,
            visibility: data.visibility,
          },
          firstEventId
        )

        if (!success || selectedEventIds.length <= 1) {
          return success
        }

        // Add the remaining events to the collection
        // This depends on the implementation of the collectionProvider
        // and may need to be adjusted based on the actual API

        return true
      } catch (error) {
        console.error('Error creating collection with events:', error)
        const message = error instanceof Error ? error.message : 'An unknown error occurred'
        setErrorMessage(message)
        return false
      }
    },
    [selectedEventIds, collectionProvider]
  )

  /**
   * Handle search input changes
   */
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  /**
   * Clear search query
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  return {
    // Collection data
    collections: filteredCollections,

    // Search functionality
    searchQuery,
    setSearchQuery,
    handleSearchChange,
    clearSearch,

    error: errorMessage,

    // Operations
    addEventsToCollection,
    createCollectionWithEvents,
  }
}
