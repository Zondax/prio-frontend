import type { GrpcConfig } from '@prio-grpc'
import { EventCollection, EventCollectionWithSummary } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { createGrpcOptimisticStore, createPageableStore } from '@zondax/stores'

import {
  type CollectionInput,
  type CollectionListMetadata,
  addEventToCollection,
  createCollection,
  deleteCollection,
  getEventsCollections,
  removeEventsFromCollection,
  updateCollection,
} from '../../api/collection'
import { createEventsCollectionsClient } from './client'
import type { CollectionOperation, CollectionOperationData, CollectionResponse } from './types'
import { handleCollectionResponse, mergeCollectionOperations } from './utils'

/**
 * Creates a store for fetching collections from the API
 * Uses the pageable store pattern for read operations with pagination
 * @returns A store for fetching collection data with pagination, filtering and sorting
 */
export function createReadStore() {
  return createPageableStore<
    GrpcConfig,
    ReturnType<typeof createEventsCollectionsClient>,
    CollectionInput,
    EventCollectionWithSummary,
    CollectionListMetadata
  >({
    createClient: createEventsCollectionsClient,
    fetch: getEventsCollections,
  })
}

/**
 * Creates a store for managing collections with create, update, and delete operations
 * Uses the optimistic store pattern to provide immediate UI feedback
 * @returns A store with write capabilities
 */
export function createWriteStore() {
  function createCollectionWithSummary(collection: EventCollection): EventCollectionWithSummary {
    const collectionWithSummary = new EventCollectionWithSummary()
    collectionWithSummary.setCollection(collection)
    return collectionWithSummary
  }

  return createGrpcOptimisticStore<
    GrpcConfig,
    ReturnType<typeof createEventsCollectionsClient>,
    CollectionOperationData,
    CollectionResponse
  >({
    createClient: createEventsCollectionsClient,
    read: async () => ({
      operations: new Map<string, CollectionOperation>(),
      currentOperation: {
        operation: 'create',
        collection: createCollectionWithSummary(new EventCollection()),
      },
    }),
    write: async (client, params, data) => {
      if (!data || !data.currentOperation) {
        throw new Error('No collection data provided for operation')
      }

      const { operation, collection, eventId } = data.currentOperation
      const baseCollection = collection.getCollection()
      if (!baseCollection) {
        throw new Error('No valid EventCollection found in operation')
      }

      switch (operation) {
        case 'create':
          return createCollection(client, params, baseCollection)
        case 'update':
          if (!baseCollection.getId()) {
            throw new Error('Collection ID is required for updates')
          }
          return updateCollection(client, params, baseCollection.getId(), baseCollection)
        case 'delete':
          if (!baseCollection.getId()) {
            throw new Error('Collection ID is required for deletion')
          }
          return deleteCollection(client, params, baseCollection.getId())
        case 'add_event':
          if (!baseCollection.getId()) {
            throw new Error('Collection ID is required for adding events')
          }
          if (!eventId) {
            throw new Error('Event ID is required for adding events to collection')
          }
          return addEventToCollection(client, params, baseCollection.getId(), eventId)
        case 'remove_event':
          if (!baseCollection.getId()) {
            throw new Error('Collection ID is required for removing events')
          }
          if (!eventId) {
            throw new Error('Event ID is required for removing events from collection')
          }
          return removeEventsFromCollection(client, params, baseCollection.getId(), [eventId])
        default:
          throw new Error(`Unsupported operation: ${operation}`)
      }
    },
    handlers: {
      mergeUpdate: mergeCollectionOperations,
      processResponse: handleCollectionResponse,
    },
  })
}
