import type { EventCollection } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { useCallback, useState } from 'react'

import type { CollectionFormData } from '../types'
import { useEventCollections } from '../useEventCollections'

/**
 * Hook to handle multi-event selection actions for collections.
 * Includes adding events to collections, creating collections with events, bulk pinning, and dialog state management.
 * @param selectedEventIds Array of selected event IDs
 * @param options Integration options for external stores (e.g., bulk pin)
 */
export function useMultiEventCollectionActions(
  selectedEventIds: string[],
  options: {
    getCollections: () => EventCollection[]
    addEventToCollection: (collectionId: string, eventId: string) => void
    createCollection: (name: string, options: { description: string; visibility: number }, eventId?: string) => Promise<boolean>
    handleBulkPin: (eventIds: number[]) => boolean
    isLoading?: boolean
  }
) {
  // State for the create collection dialog
  const [isCreateCollectionDialogOpen, setIsCreateCollectionDialogOpen] = useState(false)

  // Compose the event collections hook
  const { collections, searchQuery, setSearchQuery, handleSearchChange, addEventsToCollection, createCollectionWithEvents } =
    useEventCollections(selectedEventIds, {
      getCollections: options.getCollections,
      addEventToCollection: options.addEventToCollection,
      createCollection: options.createCollection,
    })

  // Bulk pin (favorites)
  const handleBulkPin = useCallback(async (): Promise<void> => {
    if (selectedEventIds.length === 0) return
    try {
      const numericEventIds = selectedEventIds.map((id) => (typeof id === 'string' ? Number.parseInt(id, 10) : id))
      await options.handleBulkPin(numericEventIds)
    } catch (error) {
      // Optional error handling

      console.error('Error adding events to favorites:', error)
    }
  }, [selectedEventIds, options.handleBulkPin])

  // Create collection with selected events
  const handleCreateCollection = useCallback(
    async (data: CollectionFormData): Promise<void> => {
      const success = await createCollectionWithEvents(data)
      if (success) {
        setIsCreateCollectionDialogOpen(false)
      }
    },
    [createCollectionWithEvents]
  )

  // Centralized texts for actions
  const actionTexts = {
    addToCollection: {
      label: 'Add to collection',
      success: 'Added to collection!',
      action: 'Add selected events',
    },
    favorites: {
      label: 'Add/Remove from favorites',
      success: 'Processed!',
    },
  }

  return {
    collections,
    search: {
      searchQuery,
      setSearchQuery,
      handleSearchChange,
    },
    dialog: {
      isCreateCollectionDialogOpen,
      setIsCreateCollectionDialogOpen,
    },
    actions: {
      addEventsToCollection,
      createCollectionWithEvents,
      handleBulkPin,
      handleCreateCollection,
    },
    actionTexts,
  }
}
