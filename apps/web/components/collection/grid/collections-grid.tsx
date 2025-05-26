'use client'

import * as VirtualizedGridModule from '@/components/virtualized-grid'
import type { GenericItem } from '@/components/virtualized-grid/types'
import { LOAD_MORE_THRESHOLD } from '@/lib/infinite-scroll'
import { EventCollection, type EventCollectionWithSummary } from '@prio-state'
import type React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'

const VirtualizedGrid = VirtualizedGridModule.default

import { EmptyCollection } from '../empty-collections'
import { CollectionCard } from './collections-card'
import { CollectionSkeleton } from './collections-card-skeleton'

// Default constants for the grid
const DEFAULT_ROW_HEIGHT = 300
const DEFAULT_GRID_SPACING = 16
const DEFAULT_OVERSCAN_ROWS = 3

/**
 * CollectionsGrid - Component to display collections in a grid layout
 * Uses virtualization for efficient rendering of large collection lists
 *
 * @param collections - Array of collection data
 * @param loadMore - Function to load more collections when scrolling
 * @param hasMore - Whether there are more collections to load
 * @param onCollectionSelect - Callback when a collection is selected
 * @param onDeleteClick - Callback when delete action is triggered
 * @param onEditClick - Callback when edit action is triggered
 * @param onShareClick - Callback when share action is triggered
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
}: {
  collectionsWithSummary: EventCollectionWithSummary[]
  isLoading: boolean
  loadMore?: () => void
  hasMore?: boolean
  onCollectionSelect: (collectionId: string) => void
  onDeleteClick: (collection: EventCollection) => void
  onEditClick: (collection: EventCollection) => void
  onShareClick: (collectionWithSummary: EventCollectionWithSummary) => void
  onCreateClick: () => void
}) {
  // State for grid container ref
  const gridContainerRef = useRef<HTMLDivElement>(null)
  // State for spacing
  const [spacing, setSpacing] = useState<number | { x: number; y: number }>(DEFAULT_GRID_SPACING)

  const handleCollectionClick = useCallback(
    (collectionId: string) => {
      onCollectionSelect(collectionId)
    },
    [onCollectionSelect]
  )

  // Memoize the adapted items for VirtualizedGrid.
  // Each item must conform to the GenericItem interface.
  // And will now also carry its original data for its renderFunc.
  interface AdaptedGridItemWithData extends GenericItem {
    originalData: EventCollectionWithSummary
  }

  const adaptedItemsForGrid: AdaptedGridItemWithData[] = useMemo(() => {
    return collectionsWithSummary.map((collectionData, index) => ({
      originalData: collectionData,
      renderTag: 'div', // Satisfy GenericItem.renderTag
      // Corrected renderFunc signature: style is not passed as a parameter here.
      // VirtualizedGrid applies necessary styles to the element returned by this function.
      renderFunc: (item: GenericItem, idx: number): React.ReactNode => {
        const currentItem = item as AdaptedGridItemWithData
        const { originalData: currentCollectionData } = currentItem

        // const userPermissions = currentCollectionData.getUserPermissions?.();
        const collection = currentCollectionData.getCollection()

        return (
          // The style for positioning (top, left, width, height) will be applied by VirtualizedGrid
          // to the wrapper of whatever this function returns. So, this div is for content structure.
          <div>
            <CollectionCard
              collection={collection || new EventCollection()} // Ensure collection is not undefined
              images={currentCollectionData.getPreviewEventsList().map((e) => e.getImageUrl() || '')}
              eventCount={currentCollectionData.getTotalEvents()}
              onClick={() => handleCollectionClick(collection?.getId() || '')}
              onDelete={() => onDeleteClick(collection || new EventCollection())}
              onEdit={() => onEditClick(collection || new EventCollection())}
              onShare={() => onShareClick(currentCollectionData)}
              // TODO: Wire up actual permissions if UserPermissions type is resolved and data available
              // canEdit={userPermissions?.getCanEdit?.()}
              // canShare={userPermissions?.getCanManagePermissions?.()}
              // canDelete={userPermissions?.getCanDelete?.()}
            />
          </div>
        )
      },
    }))
  }, [collectionsWithSummary, handleCollectionClick, onDeleteClick, onEditClick, onShareClick])

  // renderActualGridItem (the renderItem prop) is removed as it's not supported by VirtualizedGrid.
  // Rendering is now handled by the renderFunc on each item in adaptedItemsForGrid.

  const renderSkeleton = useCallback((index: number): React.ReactNode => {
    return <CollectionSkeleton key={`loading-skeleton-${index}`} />
  }, [])

  const handleLoadMore = useCallback(() => {
    if (hasMore && loadMore) {
      // TODO: Implement scroll percentage logic if needed here or rely on VirtualizedGrid's internal loadMore triggering
      loadMore()
    }
  }, [hasMore, loadMore])

  // Determine grid columns and spacing dynamically (simplified, can be expanded)
  // This is just a placeholder for dynamic column/spacing logic if needed.
  // VirtualizedGrid might handle responsive columns internally based on its own props like columnConfig.

  if (isLoading && collectionsWithSummary.length === 0) {
    // Show skeletons filling the viewport if initial load and no items yet
    // This needs a count of skeletons, e.g., based on viewport size or a fixed number.
    // For simplicity, let's render a few.
    const skeletonCount = 6 // Placeholder
    return (
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <CollectionSkeleton key={`initial-loading-skeleton-${i}`} /> // More specific key
        ))}
      </div>
    )
  }

  if (!isLoading && collectionsWithSummary.length === 0) {
    return <EmptyCollection onCreateClick={onCreateClick} />
  }

  return (
    <div className="h-full w-full" ref={gridContainerRef}>
      <VirtualizedGrid
        items={adaptedItemsForGrid}
        // renderItem prop is removed
        renderSkeleton={renderSkeleton}
        isLoading={isLoading}
        loadMore={handleLoadMore}
        hasMore={hasMore}
        rowHeight={DEFAULT_ROW_HEIGHT} // Renamed from rowHeight for clarity with VirtualizedGrid's probable prop name
        // cols={DEFAULT_COLUMN_COUNT} // VirtualizedGrid might use columnConfig or similar instead
        // parentRef={gridContainerRef} // VirtualizedGrid usually takes parentRef for measurements
        spacing={spacing}
        loadMoreThreshold={LOAD_MORE_THRESHOLD}
        // TODO: Check VirtualizedGrid for props like columnConfig, topPadding, etc.
        // Example: columnConfig={{ sm: 1, md: 2, lg: DEFAULT_COLUMN_COUNT }}
        // Example: topPadding={16}
      />
    </div>
  )
}
