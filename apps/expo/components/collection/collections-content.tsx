'use client'

import type { EventCollectionWithSummary } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { useDeleteCollectionDialog, useEditCollectionDialog, useShareCollectionDialog } from '@prio-state/feature/collections/hooks'
import React from 'react'
import { View } from 'react-native'

import { DeleteCollectionDialog } from './dialogs/delete-collection-dialog'
import { EditCollectionDialog } from './dialogs/edit-collection-dialog'
import { ShareCollectionDialog } from './dialogs/share-collection-dialog'
import { CollectionsGrid } from './grid/collections-grid'

interface CollectionsContentProps {
  collectionsWithSummary: EventCollectionWithSummary[]
  isLoading: boolean
  loadMore: () => void
  hasReachedEnd: boolean
  removeCollection: (id: string) => Promise<any>
  updateExistingCollection: (id: string, data: Partial<any>) => Promise<any>
  isWriting: boolean
  onCollectionSelect: (collectionId: string) => void
  onCreateClick: () => void
}

export function CollectionsContent({
  collectionsWithSummary,
  isLoading,
  loadMore,
  hasReachedEnd,
  removeCollection,
  updateExistingCollection,
  isWriting,
  onCollectionSelect,
  onCreateClick,
}: CollectionsContentProps) {
  const { collectionToDelete, deleteDialogOpen, handleDeleteClick, handleDeleteDialogChange, handleDeleteCollection, handleDeleteSuccess } =
    useDeleteCollectionDialog(removeCollection)

  const { collectionToEdit, editDialogOpen, handleEditClick, handleEditDialogChange, handleUpdateCollection, handleEditSuccess } =
    useEditCollectionDialog(updateExistingCollection)

  const { collectionToShare, shareDialogOpen, handleShareClick, handleShareDialogChange } = useShareCollectionDialog()

  return (
    <View style={{ flex: 1 }}>
      <CollectionsGrid
        collectionsWithSummary={collectionsWithSummary}
        isLoading={isLoading}
        loadMore={loadMore}
        hasMore={!hasReachedEnd}
        onCollectionSelect={onCollectionSelect}
        onDeleteClick={handleDeleteClick}
        onEditClick={handleEditClick}
        onShareClick={handleShareClick}
        onCreateClick={onCreateClick}
      />
      {/* Delete Dialog */}
      <DeleteCollectionDialog
        open={deleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
        collectionId={collectionToDelete?.getId?.()}
        collectionName={collectionToDelete?.getName?.()}
        onDelete={handleDeleteCollection}
        isDeleting={isWriting}
        onSuccess={handleDeleteSuccess}
      />
      {/* Edit Dialog */}
      <EditCollectionDialog
        open={editDialogOpen}
        onOpenChange={handleEditDialogChange}
        collection={collectionToEdit || undefined}
        onUpdate={handleUpdateCollection}
        isUpdating={isWriting}
        onSuccess={handleEditSuccess}
      />
      {/* Share Dialog */}
      <ShareCollectionDialog
        open={shareDialogOpen}
        onOpenChange={handleShareDialogChange}
        collectionWithSummary={collectionToShare || undefined}
        updateCollection={updateExistingCollection}
        isLoading={isWriting}
      />
    </View>
  )
}
