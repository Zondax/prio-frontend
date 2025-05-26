import { useCallback, useEffect, useState } from 'react'

import { type EventCollection, EventCollectionVisibilityType } from '../../../stores'
import type { CollectionFormData } from '../types'

/**
 * Interface for the useDeleteCollection hook parameters
 */
interface UseDeleteCollectionProps {
  collectionId?: string
  onDelete: (collectionId: string) => Promise<void>
  onSuccess?: () => void
  onOpenChange: (open: boolean) => void
  isDeleting?: boolean
}

/**
 * Custom hook to handle delete collection dialog state and deletion logic.
 * @param storeDeleteCollection - Function to delete a collection by id.
 * @returns Object containing dialog open state, open handler, delete handler, and state.
 */
export function useDeleteCollection({ collectionId, onDelete, onSuccess, onOpenChange, isDeleting }: UseDeleteCollectionProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDelete = async () => {
    if (!collectionId) return

    setIsProcessing(true)

    try {
      // Delete the collection using the provided function
      await onDelete(collectionId)

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error deleting collection:', error)
    } finally {
      setIsProcessing(false)
      onOpenChange(false)
    }
  }

  // Use either the external isDeleting state or the local processing state
  const isDisabled = !collectionId || isDeleting || isProcessing
  const showDeletingText = isDeleting || isProcessing

  return {
    handleDelete,
    isDisabled,
    showDeletingText,
  }
}

/**
 * Interface for the useEditCollection hook parameters
 */
interface UseEditCollectionProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection?: EventCollection
  onUpdate: (collectionId: string, data: Partial<EventCollection.AsObject>) => Promise<void>
  isUpdating?: boolean
  onSuccess?: () => void
}

export const useEditCollection = ({ open, onOpenChange, collection, onUpdate, isUpdating = false, onSuccess }: UseEditCollectionProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  // Initialize form values when collection changes
  useEffect(() => {
    if (collection && open) {
      setName(collection.getName())
      setDescription(collection.getDescription())
      setIsPrivate(collection.getVisibility() === EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE)
    }
  }, [collection, open])

  const handleSubmit = async () => {
    if (!collection || !name.trim()) return

    setIsProcessing(true)

    try {
      // Convert privacy setting to visibility type
      const visibility = isPrivate
        ? EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE
        : EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC

      // Update collection using the provided function
      await onUpdate(collection.getId(), {
        name: name.trim(),
        description: description.trim(),
        visibility,
      })

      // Call success callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error('Error updating collection:', error)
    } finally {
      setIsProcessing(false)
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    if (!isProcessing && !isUpdating) {
      setError('')
      onOpenChange(false)
    }
  }

  // Use either the external isUpdating state or the local processing state
  const isSaving = isUpdating || isProcessing

  return {
    name,
    setName,
    description,
    setDescription,
    isPrivate,
    setIsPrivate,
    isSaving,
    handleSubmit,
    handleClose,
    error,
  }
}

// Define a new interface for new collection dialog
interface UseNewCollectionProps {
  eventId?: string
  onOpenChange: (open: boolean) => void
  onCreate: (data: CollectionFormData) => Promise<void>
  onSuccess?: () => void
}

export const useNewCollection = ({ onOpenChange, onCreate, onSuccess, eventId }: UseNewCollectionProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async () => {
    if (!name.trim()) return
    setIsSubmitting(true)
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        visibility: isPrivate ? 1 : 2,
        eventId,
      })
      setName('')
      setDescription('')
      setIsPrivate(false)
      onOpenChange(false)
    } catch (error) {
      setError('Failed to create collection')
    } finally {
      setIsSubmitting(false)
    }
  }, [name, description, isPrivate, onCreate, onOpenChange, eventId, onSuccess])

  const handleClose = () => {
    if (!isSubmitting) {
      setName('')
      setDescription('')
      setIsPrivate(true)
      setError('')
      onOpenChange(false)
    }
  }

  return {
    name,
    setName,
    description,
    setDescription,
    isPrivate,
    setIsPrivate,
    error,
    handleSubmit,
    handleClose,
    isSubmitting,
  }
}
