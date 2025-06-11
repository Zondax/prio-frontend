'use client'

import type { EventCollection, EventCollectionWithSummary } from '@mono-state'
import React, { useCallback } from 'react'
import { FlatList, View } from 'react-native'

import { CollectionSkeleton } from '../collection-skeleton'
import { EmptyCollections } from '../empty-collections'
import { CollectionCard } from './collection-card'

interface CollectionsGridProps {
  collectionsWithSummary: EventCollectionWithSummary[]
  isLoading: boolean
  loadMore?: () => void
  hasMore?: boolean
  onCollectionSelect: (collectionId: string) => void
  onDeleteClick: (collection: EventCollection) => void
  onEditClick: (collection: EventCollection) => void
  onShareClick: (collection: EventCollectionWithSummary) => void
  onCreateClick: () => void
}

/**
 * CollectionsGrid - Component to display collections in a grid layout for React Native
 */
export function CollectionsGrid({
  collectionsWithSummary,
  isLoading,
  loadMore,
  hasMore = true,
  onCollectionSelect,
  onDeleteClick,
  onEditClick,
  onShareClick,
  onCreateClick,
}: CollectionsGridProps) {
  // Handle collection click
  const handleCollectionClick = useCallback(
    (collection: EventCollection) => {
      onCollectionSelect(collection.getId() || '')
    },
    [onCollectionSelect]
  )

  // Render a collection card
  const renderCollection = useCallback(
    ({ item: collectionWithSummary }: { item: EventCollectionWithSummary }) => {
      const userPermissions = collectionWithSummary.getUserPermissions?.()

      return (
        <View className="px-2 mb-2 w-full">
          <CollectionCard
            key={collectionWithSummary.getCollection()?.getId() || ''}
            collectionWithSummary={collectionWithSummary}
            images={collectionWithSummary.getPreviewEventsList().map((e) => e.getImageUrl() || '')}
            eventCount={collectionWithSummary.getTotalEvents()}
            onClick={handleCollectionClick}
            onDelete={onDeleteClick}
            onEdit={onEditClick}
            onShare={onShareClick}
            canEdit={userPermissions?.getCanEdit?.()}
            canShare={userPermissions?.getCanManagePermissions?.()}
            canDelete={userPermissions?.getCanDelete?.()}
          />
        </View>
      )
    },
    [handleCollectionClick, onDeleteClick, onEditClick, onShareClick]
  )

  // Render loading skeletons
  const renderLoadingSkeletons = () => {
    return isLoading ? (
      <>
        <View key="coll-skeleton-0" className="px-2 mb-2 w-full">
          <CollectionSkeleton index={0} />
        </View>
        <View key="coll-skeleton-1" className="px-2 mb-2 w-full">
          <CollectionSkeleton index={1} />
        </View>
        <View key="coll-skeleton-2" className="px-2 mb-2 w-full">
          <CollectionSkeleton index={2} />
        </View>
        <View key="coll-skeleton-3" className="px-2 mb-2 w-full">
          <CollectionSkeleton index={3} />
        </View>
      </>
    ) : null
  }

  // Handle end reached
  const handleEndReached = () => {
    if (!isLoading && hasMore && loadMore) {
      loadMore()
    }
  }

  // Render empty state
  if (collectionsWithSummary.length === 0 && !isLoading) {
    return <EmptyCollections onCreateClick={onCreateClick} />
  }

  return (
    <FlatList
      id="collections-grid"
      data={collectionsWithSummary}
      renderItem={renderCollection}
      keyExtractor={(item) => item.getCollection()?.getId() || Math.random().toString()}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.2}
      className="flex-1"
      ListFooterComponent={renderLoadingSkeletons}
      contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
    />
  )
}
