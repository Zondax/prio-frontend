'use client'

import type { EventCollection } from '@prio-state'
import { useMultiEventCollectionActions } from '@prio-state/feature/collections'
import { createCanManageEventsFilter } from '@prio-state/feature/collections/filter-management/search-filters'
import { useCollectionsStore, useEndpointStore } from '@prio-state/stores'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { useCallback, useEffect, useMemo } from 'react'

import { NewCollectionDialog } from '@/components/collection/dialogs/new-collection-dialog'
import { MultiSelectionBar } from '@/components/multi-selection-bar'
import type { ActionConfig } from '@/components/multi-selection-bar/types'

import { PinDropdownContent } from './pin-dropdown-content'

/**
 * Props for the EventsMultiSelectionBar component
 */
interface EventsMultiSelectionBarProps {
  /** Function to handle bulk pinning of multiple events */
  handleBulkPin: (eventIds: number[]) => boolean
  selectedEventIds: string[]
  clearSelection: () => void
}

/**
 * EventsMultiSelectionBar - Component for managing multiple selected events and their collections
 *
 * This component provides a UI for selecting events and adding them to collections.
 * It uses a dedicated hook for collection operations and a UI component for the selection bar.
 */
export function EventsMultiSelectionBar({ handleBulkPin, selectedEventIds, clearSelection }: EventsMultiSelectionBarProps) {
  const { selectedEndpoint } = useEndpointStore()
  const { getData, addEventToCollection, createCollection, isLoading, setInput, setParams } = useCollectionsStore()

  // Set up the GRPC client
  useGrpcSetup(setParams, selectedEndpoint)

  // Load collections once on component mount
  useEffect(() => {
    setInput({
      filters: [createCanManageEventsFilter()],
    })
  }, [setInput])

  // Use the new multi-event collection actions hook
  const { collections, search, dialog, actions, actionTexts } = useMultiEventCollectionActions(selectedEventIds, {
    getCollections: () => {
      const collectionsWithSummary = getData()
      return collectionsWithSummary.map((c) => c.getCollection()).filter((c): c is EventCollection => c != null)
    },
    addEventToCollection,
    createCollection: async (name, options, eventId) => {
      await createCollection(name, options, eventId)
      return true
    },
    handleBulkPin,
  })

  // Handler for adding events to a collection (used in dropdown)
  const handleAddToCollection = useCallback(
    async (collectionId: string) => {
      return await actions.addEventsToCollection(collectionId)
    },
    [actions]
  )

  // Actions for the multi-selection bar
  const multiSelectionActions: ActionConfig[] = useMemo(
    () => [
      {
        text: actionTexts.addToCollection.label,
        dropdownContent: ({ onSuccess }) => (
          <PinDropdownContent
            isPinned={false}
            handlePinToggle={() => {}}
            collections={collections}
            searchQuery={search.searchQuery}
            handleSearchChange={search.handleSearchChange}
            isInCollection={() => false}
            toggleEventInCollection={async (collectionId) => {
              const result = await handleAddToCollection(collectionId)
              if (result) onSuccess()
            }}
            setIsCreateCollectionDialogOpen={dialog.setIsCreateCollectionDialogOpen}
            setSearchQuery={search.setSearchQuery}
            hidePin={true}
            actionText={actionTexts.addToCollection.action}
            isLoading={isLoading}
          />
        ),
        successText: actionTexts.addToCollection.success,
      },
      {
        text: actionTexts.favorites.label,
        onAction: actions.handleBulkPin,
        variant: 'secondary',
        successText: actionTexts.favorites.success,
      },
    ],
    [
      collections,
      search.searchQuery,
      search.handleSearchChange,
      handleAddToCollection,
      isLoading,
      dialog.setIsCreateCollectionDialogOpen,
      search.setSearchQuery,
      actions.handleBulkPin,
      actionTexts,
    ]
  )

  return (
    <>
      <MultiSelectionBar<string>
        selectedItems={selectedEventIds}
        onClearSelection={clearSelection}
        itemType="events"
        actions={multiSelectionActions}
        autoClearOnSuccess={true}
      />

      <NewCollectionDialog
        open={dialog.isCreateCollectionDialogOpen}
        onOpenChange={(open) => {
          if (!isLoading || !open) {
            dialog.setIsCreateCollectionDialogOpen(open)
          }
        }}
        handleCreateCollection={actions.handleCreateCollection}
      />
    </>
  )
}
