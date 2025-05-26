import { useCallback, useState } from 'react'

import type { EventCollection, EventCollectionWithSummary } from '../../../stores'
import type { CollectionFormData } from '../types'

interface DeleteCollectionDialogResult {
  collectionToDelete: EventCollection | null
  deleteDialogOpen: boolean
  handleDeleteClick: (collection: EventCollection) => void
  handleDeleteDialogChange: (open: boolean) => void
  handleDeleteCollection: (collectionId: string) => Promise<void>
  handleDeleteSuccess: () => void
}

/**
 * Custom hook to handle delete collection dialog state and logic.
 */
export function useDeleteCollectionDialog(removeCollection: (collectionId: string) => void): DeleteCollectionDialogResult {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState<EventCollection | null>(null)

  const handleDeleteClick = useCallback((collection: EventCollection) => {
    setCollectionToDelete(collection)
    setDeleteDialogOpen(true)
  }, [])

  const handleDeleteDialogChange = useCallback((open: boolean) => {
    setDeleteDialogOpen(open)
    if (!open) {
      setCollectionToDelete(null)
    }
  }, [])

  const handleDeleteCollection = useCallback(
    async (collectionId: string) => {
      await removeCollection(collectionId)
    },
    [removeCollection]
  )

  const handleDeleteSuccess = useCallback(() => {
    setDeleteDialogOpen(false)
    setCollectionToDelete(null)
  }, [])

  return {
    collectionToDelete,
    deleteDialogOpen,
    handleDeleteClick,
    handleDeleteDialogChange,
    handleDeleteCollection,
    handleDeleteSuccess,
  }
}

interface EditCollectionDialogResult {
  collectionToEdit: EventCollection | null
  editDialogOpen: boolean
  handleEditClick: (collection: EventCollection) => void
  handleEditDialogChange: (open: boolean) => void
  handleUpdateCollection: (collectionId: string, data: Partial<EventCollection.AsObject>) => Promise<void>
  handleEditSuccess: () => void
}

/**
 * Custom hook to handle edit collection dialog state and update logic.
 */
export function useEditCollectionDialog(
  updateExistingCollection: (collectionId: string, data: Partial<EventCollection.AsObject>) => void
): EditCollectionDialogResult {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [collectionToEdit, setCollectionToEdit] = useState<EventCollection | null>(null)

  const handleEditClick = useCallback((collection: EventCollection) => {
    setCollectionToEdit(collection)
    setEditDialogOpen(true)
  }, [])

  const handleEditDialogChange = useCallback((open: boolean) => {
    setEditDialogOpen(open)
    if (!open) {
      setCollectionToEdit(null)
    }
  }, [])

  const handleUpdateCollection = useCallback(
    async (collectionId: string, data: Partial<EventCollection.AsObject>) => {
      await updateExistingCollection(collectionId, data)
    },
    [updateExistingCollection]
  )

  const handleEditSuccess = useCallback(() => {
    setEditDialogOpen(false)
    setCollectionToEdit(null)
  }, [])

  return {
    collectionToEdit,
    editDialogOpen,
    handleEditClick,
    handleEditDialogChange,
    handleUpdateCollection,
    handleEditSuccess,
  }
}

interface ShareCollectionDialogResult {
  collectionToShare: EventCollectionWithSummary | null
  shareDialogOpen: boolean
  handleShareClick: (collectionWithSummary: EventCollectionWithSummary) => void
  handleShareDialogChange: (open: boolean) => void
}

/**
 * Custom hook to handle share collection dialog state and logic.
 */
export function useShareCollectionDialog(): ShareCollectionDialogResult {
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [collectionToShare, setCollectionToShare] = useState<EventCollectionWithSummary | null>(null)

  const handleShareClick = useCallback((collectionWithSummary: EventCollectionWithSummary) => {
    setCollectionToShare(collectionWithSummary)
    setShareDialogOpen(true)
  }, [])

  const handleShareDialogChange = useCallback((open: boolean) => {
    setShareDialogOpen(open)
    if (!open) {
      setCollectionToShare(null)
    }
  }, [])

  return {
    collectionToShare,
    shareDialogOpen,
    handleShareClick,
    handleShareDialogChange,
  }
}

interface NewCollectionDialogResult {
  newCollectionDialogOpen: boolean
  setNewCollectionDialogOpen: (open: boolean) => void
  handleOpenNewCollectionDialog: () => void
  handleCreateCollection: (data: CollectionFormData) => Promise<void>
}

/**
 * Custom hook to handle new collection dialog state and creation logic.
 * @param storeCreateCollection - Function to create a new collection.
 */
export function useNewCollectionDialog(
  storeCreateCollection: (name: string, options: { description?: string; visibility?: any }, eventId?: string) => Promise<any>
): NewCollectionDialogResult {
  const [newCollectionDialogOpen, setNewCollectionDialogOpen] = useState(false)

  const handleOpenNewCollectionDialog = useCallback(() => setNewCollectionDialogOpen(true), [])

  const handleCreateCollection = useCallback(
    async (data: CollectionFormData) => {
      await storeCreateCollection(
        data.name,
        {
          description: data.description,
          visibility: data.visibility,
        },
        data.eventId
      )
    },
    [storeCreateCollection]
  )

  return {
    newCollectionDialogOpen,
    setNewCollectionDialogOpen,
    handleOpenNewCollectionDialog,
    handleCreateCollection,
  }
}
