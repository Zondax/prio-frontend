'use client'

import type { EventCollection, EventCollectionWithSummary } from '@prio-state'
import { useCallback, useMemo, useRef } from 'react'

import VirtualizedTable from '@/components/virtualized-table'

import { getCollectionsColumns } from './collections-table-columns'
import { CollectionTableSkeleton } from './collections-table-skeleton'

interface CollectionsTableProps {
  tableHeight: number
  collectionsWithSummary: EventCollectionWithSummary[]
  isLoading: boolean
  loadMore?: () => void
  onCollectionSelect: (collectionId: string) => void
  onDeleteClick: (collection: EventCollection) => void
  onEditClick: (collection: EventCollection) => void
  onShareClick: (collectionWithSummary: EventCollectionWithSummary) => void
}

/**
 * CollectionsTable - Component to display collections in a table layout
 * Uses virtualization for efficient rendering of large collection lists
 *
 * @param collectionsWithSummary - Array of collection data
 * @param onCollectionSelect - Callback when a collection is selected
 * @param onDeleteClick - Callback when delete action is triggered
 * @param onEditClick - Callback when edit action is triggered
 * @param onShareClick - Callback when share action is triggered
 */
export function CollectionsTable({
  collectionsWithSummary,
  isLoading,
  tableHeight,
  loadMore,
  onCollectionSelect,
  onDeleteClick,
  onEditClick,
  onShareClick,
}: CollectionsTableProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const collections = collectionsWithSummary.map((c) => c.getCollection())
  // Memoize the columns definition
  const columns = useMemo(
    () =>
      getCollectionsColumns({
        onDelete: onDeleteClick,
        onEdit: onEditClick,
        onShare: onShareClick,
      }),
    [onDeleteClick, onEditClick, onShareClick]
  )

  // Handle collection selection
  const handleCollectionSelect = useCallback(
    (collection: EventCollection) => {
      onCollectionSelect(collection.getId() || '')
    },
    [onCollectionSelect]
  )

  return (
    <div id="collections-table" ref={containerRef} className="h-full w-full">
      <VirtualizedTable
        data={collections.filter((c) => c !== null) as EventCollection[]}
        columns={columns}
        isLoading={isLoading}
        onRowClick={handleCollectionSelect}
        rowHeight={75}
        overscan={5}
        renderSkeleton={(index) => <CollectionTableSkeleton key={index} />}
        tableHeight={tableHeight}
        className="w-full"
      />
    </div>
  )
}
