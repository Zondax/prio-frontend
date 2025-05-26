import { EventsCollections } from '@prio-grpc'
import { EventCollection, EventCollectionWithSummary } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { beforeEach, describe, expect, it } from 'vitest'

import type { CollectionOperationData } from '../types'
import { createCollectionWithSummary, getMergedCollections, handleCollectionResponse, mergeCollectionOperations } from '../utils'

// Mock setup functions
function createTestCollection(id?: string, name = 'Test Collection'): EventCollectionWithSummary {
  const collection = new EventCollection()
  if (id) collection.setId(id)
  collection.setName(name)

  const collectionWithSummary = new EventCollectionWithSummary()
  collectionWithSummary.setCollection(collection)
  return collectionWithSummary
}

describe('stores/collection/utils', () => {
  describe('mergeCollectionOperations', () => {
    let currentData: CollectionOperationData

    beforeEach(() => {
      currentData = {
        operations: new Map(),
        currentOperation: undefined,
      }
    })

    it('should throw an error if no operation is provided', () => {
      expect(() => mergeCollectionOperations(currentData, {})).toThrow('No operation provided')
    })

    it('should add a create operation with temporary ID if no ID exists', () => {
      const collection = createTestCollection(undefined, 'New Collection')
      const partialData = {
        currentOperation: {
          operation: 'create' as const,
          collection,
        },
      }

      const result = mergeCollectionOperations(currentData, partialData)

      expect(result.operations.size).toBe(1)
      expect(result.currentOperation).toEqual(partialData.currentOperation)

      // The key should be a temporary ID with the collection name
      const operationKey = Array.from(result.operations.keys())[0]
      expect(operationKey).toContain('temp-New Collection-')
    })

    it('should throw an error for non-create operations without ID', () => {
      const collection = createTestCollection(undefined, 'Collection Without ID')
      const partialData = {
        currentOperation: {
          operation: 'update' as const,
          collection,
        },
      }

      expect(() => mergeCollectionOperations(currentData, partialData)).toThrow('Collection ID is required for update operations')
    })

    it('should add an operation to the map with collection ID as key', () => {
      const collection = createTestCollection('col-123', 'Existing Collection')
      const partialData = {
        currentOperation: {
          operation: 'update' as const,
          collection,
        },
      }

      const result = mergeCollectionOperations(currentData, partialData)

      expect(result.operations.size).toBe(1)
      expect(result.operations.has('col-123')).toBe(true)
      expect(result.currentOperation).toEqual(partialData.currentOperation)
    })
  })

  describe('handleCollectionResponse', () => {
    let currentData: CollectionOperationData

    beforeEach(() => {
      currentData = {
        operations: new Map(),
        currentOperation: {
          operation: 'create' as const,
          collection: createTestCollection('temp-123', 'New Collection'),
        },
      }
      // Add the temporary ID operation to the map
      currentData.operations.set('temp-123', currentData.currentOperation)
    })

    it('should return current data if response is undefined', () => {
      const result = handleCollectionResponse(currentData, undefined, {
        currentOperation: currentData.currentOperation,
      })
      expect(result).toBe(currentData)
    })

    it('should return current data if current operation is undefined', () => {
      const response = new EventsCollections.CreateEventCollectionResponse()
      const dataWithoutCurrentOp = { ...currentData, currentOperation: undefined }

      const result = handleCollectionResponse(dataWithoutCurrentOp, response, {
        currentOperation: undefined,
      })

      expect(result).toBe(dataWithoutCurrentOp)
    })

    it('should return current data if response is not CreateEventCollectionResponse', () => {
      const response = {} as any // Not the correct response type

      const result = handleCollectionResponse(currentData, response, {
        currentOperation: currentData.currentOperation,
      })

      expect(result).toBe(currentData)
    })

    it('should update operations map with real ID from response', () => {
      // Create response with a real collection ID
      const response = new EventsCollections.CreateEventCollectionResponse()
      const realCollection = createTestCollection('real-456', 'New Collection')
      response.setCollection(realCollection)

      const result = handleCollectionResponse(currentData, response, {
        currentOperation: currentData.currentOperation,
      })

      // The temp ID should be removed
      expect(result.operations.has('temp-123')).toBe(false)

      // The real ID should be added
      expect(result.operations.has('real-456')).toBe(true)

      // The current operation should use the real collection
      expect(result.currentOperation?.collection).toBe(realCollection)
    })
  })

  describe('getMergedCollections', () => {
    it('should return backend data if no optimistic data is provided', () => {
      const backendData = [createTestCollection('col-1', 'Collection 1'), createTestCollection('col-2', 'Collection 2')]

      const result = getMergedCollections(backendData, undefined)
      expect(result).toBe(backendData)
    })

    it('should return backend data if operations map is empty', () => {
      const backendData = [createTestCollection('col-1', 'Collection 1'), createTestCollection('col-2', 'Collection 2')]

      const optimisticData: CollectionOperationData = {
        operations: new Map(),
        currentOperation: undefined,
      }

      const result = getMergedCollections(backendData, optimisticData)
      expect(result).toBe(backendData)
    })

    it('should add "create" operations to the merged result', () => {
      const backendData = [createTestCollection('col-1', 'Collection 1')]

      const newCollection = createTestCollection('new-col', 'New Collection')
      const optimisticData: CollectionOperationData = {
        operations: new Map([
          [
            'new-col',
            {
              operation: 'create' as const,
              collection: newCollection,
            },
          ],
        ]),
        currentOperation: undefined,
      }

      const result = getMergedCollections(backendData, optimisticData)

      expect(result).toHaveLength(2)
      expect(result[0].getCollection()?.getId()).toBe('col-1')
      expect(result[1].getCollection()?.getId()).toBe('new-col')
    })

    it('should apply "update" operations to the merged result', () => {
      const backendData = [createTestCollection('col-1', 'Collection 1'), createTestCollection('col-2', 'Collection 2')]

      const updatedCollection = createTestCollection('col-1', 'Updated Collection 1')
      const optimisticData: CollectionOperationData = {
        operations: new Map([
          [
            'col-1',
            {
              operation: 'update' as const,
              collection: updatedCollection,
            },
          ],
        ]),
        currentOperation: undefined,
      }

      const result = getMergedCollections(backendData, optimisticData)

      expect(result).toHaveLength(2)
      expect(result[0]).toBe(updatedCollection)
      expect(result[1].getCollection()?.getId()).toBe('col-2')
    })

    it('should apply "delete" operations to the merged result', () => {
      const backendData = [createTestCollection('col-1', 'Collection 1'), createTestCollection('col-2', 'Collection 2')]

      const collectionToDelete = createTestCollection('col-1', 'Collection 1')
      const optimisticData: CollectionOperationData = {
        operations: new Map([
          [
            'col-1',
            {
              operation: 'delete' as const,
              collection: collectionToDelete,
            },
          ],
        ]),
        currentOperation: undefined,
      }

      const result = getMergedCollections(backendData, optimisticData)

      expect(result).toHaveLength(1)
      expect(result[0].getCollection()?.getId()).toBe('col-2')
    })

    it('should handle all operations together in correct order', () => {
      const backendData = [createTestCollection('col-1', 'Collection 1'), createTestCollection('col-2', 'Collection 2')]

      const newCollection = createTestCollection('col-3', 'Collection 3')
      const updatedCollection = createTestCollection('col-2', 'Updated Collection 2')
      const collectionToDelete = createTestCollection('col-1', 'Collection 1')

      const optimisticData: CollectionOperationData = {
        operations: new Map([
          [
            'col-3',
            {
              operation: 'create' as const,
              collection: newCollection,
            },
          ],
          [
            'col-2',
            {
              operation: 'update' as const,
              collection: updatedCollection,
            },
          ],
          [
            'col-1',
            {
              operation: 'delete' as const,
              collection: collectionToDelete,
            },
          ],
        ]),
        currentOperation: undefined,
      }

      const result = getMergedCollections(backendData, optimisticData)

      expect(result).toHaveLength(2)
      // col-1 should be deleted
      expect(result.find((c) => c.getCollection()?.getId() === 'col-1')).toBeUndefined()
      // col-2 should be updated
      expect(
        result
          .find((c) => c.getCollection()?.getId() === 'col-2')
          ?.getCollection()
          ?.getName()
      ).toBe('Updated Collection 2')
      // col-3 should be added
      expect(result.find((c) => c.getCollection()?.getId() === 'col-3')).toBeDefined()
    })
  })

  describe('createCollectionWithSummary', () => {
    it('should create a new collection with summary from a basic collection', () => {
      const collection = new EventCollection()
      collection.setId('col-123')
      collection.setName('Test Collection')

      const result = createCollectionWithSummary(collection)

      expect(result).toBeInstanceOf(EventCollectionWithSummary)
      expect(result.getCollection()).toBe(collection)
      expect(result.getTotalEvents()).toBe(0)
      expect(result.getPreviewEventsList()).toEqual([])
    })

    it('should copy properties from original when provided', () => {
      const collection = new EventCollection()
      collection.setId('col-123')

      const original = new EventCollectionWithSummary()
      original.setTotalEvents(5)

      const result = createCollectionWithSummary(collection, original)

      expect(result.getCollection()).toBe(collection)
      expect(result.getTotalEvents()).toBe(5)
    })
  })
})
