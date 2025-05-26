import { EventsCollections } from '@prio-grpc'
import { type EventCollection, EventCollectionWithSummary } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'

import type { CollectionOperationData, CollectionResponse } from './types'

/**
 * Merge function that combines the current state with partial data
 * Updates the operations map based on the current state and new operation
 * Uses collection ID as the key to track the latest state per collection
 * @param currentData Current state of collection operations
 * @param partialData Partial data for the update
 */
export const mergeCollectionOperations = (
  currentData: CollectionOperationData,
  partialData: Partial<CollectionOperationData>
): CollectionOperationData => {
  if (!partialData.currentOperation) {
    throw new Error('No operation provided')
  }

  const { operation, collection, eventId } = partialData.currentOperation
  const updatedOperations = new Map(currentData.operations)
  let operationKey = collection.getCollection()?.getId()

  // Handle operation key generation
  if (!operationKey) {
    if (operation === 'create') {
      operationKey = `temp-${collection.getCollection()?.getName()}-${Date.now()}`
    } else {
      throw new Error(`Collection ID is required for ${operation} operations`)
    }
  }

  const newOperation = { operation, collection, eventId }
  updatedOperations.set(operationKey, newOperation)

  return {
    operations: updatedOperations,
    currentOperation: { operation, collection, eventId },
  }
}

/**
 * Processes the backend response to update the state
 * @param currentData Current state of operations
 * @param response Backend response
 * @param partialData The partial data that was used for the update
 */
export const handleCollectionResponse = (
  currentData: CollectionOperationData,
  response: CollectionResponse | undefined,
  partialData: Partial<CollectionOperationData>
): CollectionOperationData => {
  // If response is undefined, return the current data unchanged
  if (!response) {
    return currentData
  }

  // Copy the current state
  const updatedOperations = new Map(currentData.operations)
  const currentOp = currentData.currentOperation

  if (!currentOp) {
    return currentData
  }

  const isCreateResponse = response instanceof EventsCollections.CreateEventCollectionResponse
  if (!isCreateResponse) {
    return currentData
  }

  const responseCollection = response.getCollection?.()
  if (!responseCollection || !responseCollection.getCollection()?.getId()) {
    return currentData
  }

  const realId = responseCollection.getCollection()?.getId()
  const tempId = partialData.currentOperation?.collection.getCollection()?.getId()

  // Remove the temporary ID entry
  if (tempId) {
    updatedOperations.delete(tempId)
  }

  if (!realId) {
    console.error('[CollectionStore] Collection ID is required for create operations')
    return currentData
  }

  // Add the collection with its real ID
  updatedOperations.set(realId, {
    operation: 'create',
    collection: responseCollection,
  })

  // Update the current operation to use the real collection
  const updatedCurrentOp = { ...currentOp, collection: responseCollection }

  return {
    operations: updatedOperations,
    currentOperation: updatedCurrentOp,
  }
}

/**
 * Gets collections with optimistic updates merged into the backend data
 * Creates a single coherent view combining confirmed backend data with pending changes
 *
 * @param backendData Data from the read store (backend)
 * @param optimisticData Data from the write store (optimistic updates)
 * @returns Collections with optimistic updates merged in
 */
export function getMergedCollections(
  backendData: EventCollectionWithSummary[],
  optimisticData?: CollectionOperationData
): EventCollectionWithSummary[] {
  // If no optimistic data is available or no operations, return backend data unchanged
  if (!optimisticData || !optimisticData.operations?.size) return backendData

  try {
    // Clone backend data to avoid modifying it directly
    let clonedData = [...backendData]
    const operations = optimisticData.operations

    // process the collected operations in the correct order
    // First creates
    operations.forEach((opData, id) => {
      if (opData.operation === 'create') {
        // Add the new collection to the array
        if (opData.collection) {
          // Only add collections that aren't already in the backend data
          // This prevents duplicates when a collection has been created and assigned a real ID
          const collectionId = opData.collection.getCollection()?.getId()
          if (!collectionId || !clonedData.some((c) => c.getCollection()?.getId() === collectionId)) {
            clonedData.push(opData.collection)
          }
        }
      }
    })

    // Then updates
    operations.forEach((opData, id) => {
      if (opData.operation === 'update') {
        // Find and update the collection in the array
        const updateIndex = clonedData.findIndex((c) => c.getCollection()?.getId() === opData.collection.getCollection()?.getId())
        if (updateIndex >= 0) {
          // Replace with updated collection
          clonedData[updateIndex] = opData.collection
        } else {
          // If we can't find the collection to update, add it
          // This handles cases where an update follows a create with different IDs
          clonedData.push(opData.collection)
        }
      }
    })

    // Finally deletes
    operations.forEach((opData, id) => {
      if (opData.operation === 'delete') {
        // Filter out the deleted collection
        clonedData = clonedData.filter((c) => c.getCollection()?.getId() !== opData.collection.getCollection()?.getId())
      }
    })

    return clonedData
  } catch (error) {
    console.error('[CollectionStore] Error applying optimistic updates:', error)
    // On error, return original backend data
    return backendData
  }
}

/**
 * Converts an EventCollection or EventCollectionWithSummary to EventCollectionWithSummary
 * @param collection The EventCollection or EventCollectionWithSummary to convert
 * @returns A new EventCollectionWithSummary containing the collection
 */
export function createCollectionWithSummary(
  collection: EventCollection,
  original?: EventCollectionWithSummary
): EventCollectionWithSummary {
  const collectionWithSummary = new EventCollectionWithSummary()
  collectionWithSummary.setCollection(collection)
  if (original) {
    collectionWithSummary.setTotalEvents(original.getTotalEvents())
    collectionWithSummary.setPreviewEventsList(original.getPreviewEventsList())
    collectionWithSummary.setUserPermissions(original.getUserPermissions())
  }
  return collectionWithSummary
}
