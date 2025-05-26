'use client'

import { useCollectionsStore, useEndpointStore } from '@prio-state'
import { useCollectionFilters, useCollectionSearchHandler, useNewCollectionDialog } from '@prio-state/feature/collections/hooks'
import { useGrpcSetup } from '@zondax/auth-expo/hooks'
import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'

import { CollectionsContent } from './collections-content'
import { CollectionsHeader, type CollectionsViewFilter } from './collections-header'
import { NewCollectionDialog } from './dialogs/new-collection-dialog'

/**
 * Collections - Component to display a list of collections for React Native
 *
 * @param onCollectionSelect - Callback when a collection is selected
 */
export function Collections({ onCollectionSelect }: { onCollectionSelect: (collectionId: string) => void }) {
  const filtersHook = useCollectionFilters()
  const { filters, filterMode, setFilterMode } = filtersHook
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
  }, [filters, setInput])

  const handleFilterModeChange = useCallback(
    (mode: CollectionsViewFilter) => {
      setFilterMode(mode)
    },
    [setFilterMode]
  )

  const collectionsWithSummary = getData()

  return (
    <View className="flex-1">
      {/* Header with search and filters */}
      <CollectionsHeader
        onCreateClick={handleOpenNewCollectionDialog}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterMode={filterMode}
        onFilterModeChange={handleFilterModeChange}
      />
      {/* Grid */}
      <CollectionsContent
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
    </View>
  )
}
