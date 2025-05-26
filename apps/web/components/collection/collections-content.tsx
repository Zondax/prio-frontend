'use client'

import {
  CollectionResponse,
  type EventCollection,
  type EventCollectionWithSummary,
  useCollectionPermissionsStore,
  useDeleteCollectionDialog,
  useEditCollectionDialog,
  useShareCollectionDialog,
} from '@prio-state'
import { useCallback } from 'react'

import { ViewType } from './collections-config'
import { DeleteCollectionDialog, EditCollectionDialog, ShareCollectionDialog } from './dialogs'
import { CollectionsGrid } from './grid/collections-grid'
import { CollectionsTable } from './table/collections-table'

interface CollectionsContentProps {
  viewType: ViewType
  onCollectionSelect: (collectionId: string) => void
  onCreateClick: () => void
  collectionsWithSummary: EventCollectionWithSummary[]
  isLoading: boolean
  loadMore: () => void
  hasReachedEnd: boolean
  removeCollection: (id: string) => void
  updateExistingCollection: (id: string, data: Partial<EventCollection.AsObject>) => void
  isWriting: boolean
}

/**
 * CollectionsContent - Component to display the content of collections
 * Switches between different view types (gallery or table)
 * Manages collections data and modal dialogs for both view types
 *
 * @param viewType - The current view type (gallery or table)
 * @param onCollectionSelect - Callback when a collection is selected
 * @param contentHeight - Available height for the content area, calculated from parent
 */
export function CollectionsContent({
  viewType,
  onCollectionSelect,
  collectionsWithSummary,
  isLoading,
  loadMore,
  hasReachedEnd,
  removeCollection,
  updateExistingCollection,
  isWriting,
  onCreateClick,
}: CollectionsContentProps) {
  const { collectionToDelete, deleteDialogOpen, handleDeleteClick, handleDeleteDialogChange, handleDeleteCollection, handleDeleteSuccess } =
    useDeleteCollectionDialog(removeCollection)

  const { collectionToEdit, editDialogOpen, handleEditClick, handleEditDialogChange, handleUpdateCollection, handleEditSuccess } =
    useEditCollectionDialog(updateExistingCollection)

  const { collectionToShare, shareDialogOpen, handleShareClick, handleShareDialogChange } = useShareCollectionDialog()

  const { isLoading: isLoadingPermissions } = useCollectionPermissionsStore()

  // Function to handle load more collections
  const handleLoadMore = useCallback(() => {
    if (!isLoading && !hasReachedEnd) {
      loadMore()
    }
  }, [isLoading, hasReachedEnd, loadMore])

  return (
    <div className="flex flex-col h-full">
      {viewType === ViewType.GALLERY && (
        <CollectionsGrid
          collectionsWithSummary={collectionsWithSummary}
          isLoading={isLoading}
          onCollectionSelect={onCollectionSelect}
          onDeleteClick={handleDeleteClick}
          onEditClick={handleEditClick}
          onShareClick={handleShareClick}
          loadMore={handleLoadMore}
          onCreateClick={onCreateClick}
        />
      )}

      {viewType === ViewType.TABLE && (
        <CollectionsTable
          collectionsWithSummary={collectionsWithSummary}
          isLoading={isLoading}
          onCollectionSelect={onCollectionSelect}
          onDeleteClick={handleDeleteClick}
          onEditClick={handleEditClick}
          onShareClick={handleShareClick}
          tableHeight={600}
          loadMore={handleLoadMore}
        />
      )}

      {/* Delete Collection Dialog */}
      <DeleteCollectionDialog
        open={deleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        collectionId={collectionToDelete?.getId() || undefined}
        collectionName={collectionToDelete?.getName() || undefined}
        onDelete={handleDeleteCollection}
        isDeleting={isWriting}
        onSuccess={handleDeleteSuccess}
      />

      {/* Edit Collection Dialog */}
      <EditCollectionDialog
        open={editDialogOpen}
        onOpenChange={handleEditDialogChange}
        collection={collectionToEdit || undefined}
        onUpdate={handleUpdateCollection}
        isUpdating={isWriting}
        onSuccess={handleEditSuccess}
      />

      {/* Share Collection Dialog */}
      <ShareCollectionDialog
        open={shareDialogOpen}
        onOpenChange={handleShareDialogChange}
        collectionWithSummary={collectionToShare || undefined}
        updateCollection={updateExistingCollection}
        isLoading={isLoadingPermissions}
      />
    </div>
  )
}
