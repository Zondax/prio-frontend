'use client'

import { useCollectionsStore, useEndpointStore } from '@prio-state'
import { useCollectionFilters, useCollectionSearchHandler, useNewCollectionDialog } from '@prio-state/feature/collections/hooks'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { useEffect, useMemo, useState } from 'react'

import { CollectionsContent } from '@/components/collection/collections-content'
import { CollectionsHeader } from '@/components/collection/collections-header'

import { ViewType } from './collections-config'
import { NewCollectionDialog } from './dialogs/new-collection-dialog'

interface CollectionsProps {
  onCollectionSelect: (collectionId: string) => void
}

/**
 * Collections - Component to display a list of collections
 * Includes header with search and view controls
 * Supports gallery and table views
 *
 * @param createCollection - Callback to open the create collection dialog
 * @param onCollectionSelect - Callback when a collection is selected
 */
export function Collections({ onCollectionSelect }: CollectionsProps) {
  // State for view type
  const [viewType, setViewType] = useState<ViewType>(ViewType.GALLERY)

  const filtersHook = useCollectionFilters()
  const { filters } = filtersHook
  const {
    getData,
    setParams,
    setInput,
    loadNextPage,
    hasReachedEnd,
    isLoading,
    removeCollection,
    updateExistingCollection,
    isWriting,
    createCollection: storeCreateCollection,
  } = useCollectionsStore()
  const { selectedEndpoint } = useEndpointStore()
  useGrpcSetup(setParams, selectedEndpoint)

  // new collection dialog handler
  const { newCollectionDialogOpen, setNewCollectionDialogOpen, handleOpenNewCollectionDialog, handleCreateCollection } =
    useNewCollectionDialog(storeCreateCollection)

  // search handler
  const { searchQuery, handleSearchChange } = useCollectionSearchHandler(filtersHook)

  useEffect(() => {
    setInput({
      // TODO: Sort and more
      filters,
    })
  }, [filters])

  const collectionsWithSummary = useMemo(() => getData(), [getData])

  return (
    <div
      className="flex flex-col h-full"
      style={{
        height:
          collectionsWithSummary.length > 0 || isLoading ? '100%' : 'calc(100vh - var(--topbar-height) - (var(--body-base-padding) * 2))',
      }}
    >
      <CollectionsHeader
        viewType={viewType}
        onViewTypeChange={setViewType}
        onCreateClick={handleOpenNewCollectionDialog}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterMode={filtersHook.filterMode}
        onFilterModeChange={filtersHook.setFilterMode}
      />
      <CollectionsContent
        viewType={viewType}
        onCollectionSelect={onCollectionSelect}
        collectionsWithSummary={collectionsWithSummary}
        isLoading={isLoading}
        loadMore={loadNextPage}
        hasReachedEnd={hasReachedEnd}
        removeCollection={removeCollection}
        updateExistingCollection={updateExistingCollection}
        isWriting={isWriting}
        onCreateClick={handleOpenNewCollectionDialog}
      />
      {/* Dialog for creating a new collection */}
      <NewCollectionDialog
        open={newCollectionDialogOpen}
        onOpenChange={setNewCollectionDialogOpen}
        handleCreateCollection={handleCreateCollection}
      />
    </div>
  )
}
