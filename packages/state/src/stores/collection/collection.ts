import { EventsCollections, type GrpcConfig } from '@prio-grpc'
import { EventCollection, type EventCollectionWithSummary } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { useCallback, useRef } from 'react'

import type { CollectionInput } from '../../api/collection'
import { createReadStore, createWriteStore } from './store'
import { createCollectionWithSummary, getMergedCollections } from './utils'

export {
  EventCollection,
  EventCollectionVisibilityType,
  UpdateEventCollectionResponse,
  DeleteEventCollectionResponse,
  CreateEventCollectionResponse,
  EventCollectionPermissionType,
} from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'

/**
 * React hook for managing collection data
 * Provides a unified interface for reading and writing collection data
 * Compatible with the pageable store interface
 *
 * @returns Object with methods and state for collection management
 */
export const useCollectionsStore = () => {
  const readStoreRef = useRef<ReturnType<typeof createReadStore> | null>(null)
  const writeStoreRef = useRef<ReturnType<typeof createWriteStore> | null>(null)

  // Ensure stores are created only once
  if (!readStoreRef.current) readStoreRef.current = createReadStore()
  if (!writeStoreRef.current) writeStoreRef.current = createWriteStore()

  const readStore = readStoreRef.current()
  const writeStore = writeStoreRef.current()

  /**
   * Sets parameters for all stores
   */
  const setParams = useCallback((params: GrpcConfig) => {
    readStore.setParams(params)
    writeStore.setParams(params)
  }, [])

  /**
   * Sets the input for the read store
   */
  const setInput = useCallback((input: CollectionInput) => {
    readStore.setInput(input)
  }, [])

  /**
   * Retrieves combined data from both read and write stores
   * Returns a unified view of collections with optimistic updates applied
   */
  const getData = () => {
    const readData = readStore.data
    if (!readData) return readData

    const writeData = writeStore.getData()

    const mergedData = getMergedCollections(readData, writeData)
    return mergedData
  }

  /**
   * Creates a new collection
   * @param name The name of the collection to create
   * @param options Optional additional properties for the collection
   * @returns Promise resolving to the creation result
   */
  const createNewCollection = useCallback((name: string, options?: Partial<EventCollection.AsObject>) => {
    // Create a new partial collection for the update
    const partialCollection = new EventCollection()

    // Set the required fields
    partialCollection.setName(name)

    // Set optional fields from options if provided
    if (options?.description) {
      partialCollection.setDescription(options.description)
    }

    // Set default visibility if not provided
    const visibility = options?.visibility ?? EventsCollections.EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE
    partialCollection.setVisibility(visibility)

    const collectionWithSummary = createCollectionWithSummary(partialCollection)
    // Use wait_for_response mode to ensure we get the real ID back
    return writeStore.update?.(
      {
        currentOperation: {
          operation: 'create',
          collection: collectionWithSummary,
        },
      },
      {
        mode: 'wait_for_response',
      }
    )
  }, [])

  /**
   * Creates a new collection and adds an event to it
   * @param name The name of the collection to create
   * @param eventId The ID of the event to add to the new collection
   * @param options Optional additional properties for the collection
   * @returns Promise resolving to the new collection ID if successful
   */
  const createCollection = useCallback(
    async (name: string, options?: Partial<EventCollection.AsObject>, eventId?: string) => {
      try {
        const result = await createNewCollection(name, options)
        if (!eventId) {
          return result
        }

        // Type assertion to handle the specific response from createCollection
        const createResponse = result as EventsCollections.CreateEventCollectionResponse
        const collection = createResponse.getCollection()

        if (!collection) {
          throw new Error('Failed to create collection: No collection returned')
        }

        const collectionId = collection.getCollection()?.getId()

        if (!collectionId) {
          throw new Error('Failed to create collection: No collection ID returned')
        }

        // Add the event to the newly created collection
        await addEventToCollection(collectionId, eventId)

        return collectionId
      } catch (error) {
        console.error('Failed to create collection with event:', error)
        throw error
      }
    },
    [createNewCollection]
  )

  /**
   * Removes a collection
   * @param collectionId The ID of the collection to remove
   * @returns Promise resolving to the delete operation result
   */
  const removeCollection = useCallback((collectionId: string) => {
    if (!collectionId) {
      throw new Error('No collection ID provided for deletion')
    }

    // Create an empty collection with just the ID for the delete operation
    const collection = new EventCollection()
    collection.setId(collectionId)

    const collectionWithSummary = createCollectionWithSummary(collection)

    writeStore.update?.({
      currentOperation: {
        operation: 'delete',
        collection: collectionWithSummary,
      },
    })
  }, [])

  /**
   * Updates an existing collection
   * @param collectionId The ID of the collection to update
   * @param data The updated collection data
   * @returns Promise resolving to the update operation result
   */
  const updateExistingCollection = useCallback(
    (collectionId: string, data: Partial<EventCollection.AsObject>) => {
      if (!collectionId) {
        throw new Error('Collection ID is required for updates')
      }

      const original = getData()?.find((c: EventCollectionWithSummary) => c.getCollection()?.getId() === collectionId)
      if (!original) {
        throw new Error('Original collection not found')
      }
      const originalObj = original.getCollection()?.toObject() ?? {}
      const merged = { ...originalObj, ...data }

      const updatedCollection = original.getCollection()?.clone()
      if (!updatedCollection) {
        throw new Error('Failed to clone collection')
      }
      updatedCollection.setId(collectionId)
      if (merged.name) updatedCollection.setName(merged.name)
      if (merged.description) updatedCollection.setDescription(merged.description)
      if (merged.visibility !== undefined) updatedCollection.setVisibility(merged.visibility)
      const collectionWithSummary = createCollectionWithSummary(updatedCollection, original)

      writeStore.update?.({
        currentOperation: {
          operation: 'update',
          collection: collectionWithSummary,
        },
      })
    },
    [readStore]
  )

  /**
   * Adds an event to a collection
   * @param collectionId The ID of the collection to add the event to
   * @param eventId The ID of the event to add
   * @returns Promise resolving to the add event operation result
   */
  const addEventToCollection = useCallback((collectionId: string, eventId: string) => {
    const updatedCollection = new EventCollection()
    updatedCollection.setId(collectionId)
    const collectionWithSummary = createCollectionWithSummary(updatedCollection)
    writeStore.update?.({
      currentOperation: {
        operation: 'add_event',
        collection: collectionWithSummary,
        eventId,
      },
    })
  }, [])

  /**
   * Removes an event from a collection
   * @param collectionId The ID of the collection to remove the event from
   * @param eventId The ID of the event to remove
   * @returns Promise resolving to the remove event operation result
   */
  const removeEventFromCollection = useCallback((collectionId: string, eventId: string) => {
    const updatedCollection = new EventCollection()
    updatedCollection.setId(collectionId)
    const collectionWithSummary = createCollectionWithSummary(updatedCollection)
    writeStore.update?.({
      currentOperation: {
        operation: 'remove_event',
        collection: collectionWithSummary,
        eventId,
      },
    })
  }, [])

  return {
    getData,
    metadata: readStore.metadata,
    metrics: readStore.metrics,
    hasReachedEnd: readStore.hasReachedEnd,
    loadNextPage: readStore.loadNextPage,
    isLoading: readStore.isLoading || readStore.isInitLoading,
    error: readStore.error,
    setInput,

    // Common properties
    setParams,

    // Write methods
    createCollection,
    removeCollection,
    updateExistingCollection,
    addEventToCollection,
    removeEventFromCollection,
    isWriting: writeStore.isWriting,
  }
}
