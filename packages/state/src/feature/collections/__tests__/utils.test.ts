import { describe, expect, it } from 'vitest'

import { EventCollection, EventCollectionWithSummary } from '../../../stores'
import { extractCollection } from '../utils'

describe('feature/collections/utils', () => {
  describe('extractCollection', () => {
    it('should return object with undefined values for undefined collection data', () => {
      const result = extractCollection(undefined)
      expect(result.collectionWithSummary).toBeUndefined()
      expect(result.totalEvents).toBeUndefined()
    })

    it('should return object with undefined values for empty collection data array', () => {
      const result = extractCollection([])
      expect(result.collectionWithSummary).toBeUndefined()
      expect(result.totalEvents).toBeUndefined()
    })

    it('should return the collection summary even if it has no collection object', () => {
      const collectionWithSummary = new EventCollectionWithSummary()
      // Not setting the collection property
      const result = extractCollection([collectionWithSummary])
      expect(result.collectionWithSummary).toBe(collectionWithSummary)
      expect(result.totalEvents).toBe(0)
    })

    it('should extract the collection summary and total events from the first item in the array', () => {
      const collection = new EventCollection()
      const id = 'test-collection-id'
      collection.setId(id)

      const collectionWithSummary = new EventCollectionWithSummary()
      collectionWithSummary.setCollection(collection)
      collectionWithSummary.setTotalEvents(10)

      const result = extractCollection([collectionWithSummary])

      expect(result.collectionWithSummary).toBeDefined()
      expect(result.collectionWithSummary).toBe(collectionWithSummary)
      expect(result.collectionWithSummary?.getCollection()?.getId()).toBe(id)
      expect(result.totalEvents).toBe(10)
    })

    it('should extract the collection summary from the first item even if multiple items exist', () => {
      const collection1 = new EventCollection()
      collection1.setId('collection-1')

      const collection2 = new EventCollection()
      collection2.setId('collection-2')

      const collectionWithSummary1 = new EventCollectionWithSummary()
      collectionWithSummary1.setCollection(collection1)
      collectionWithSummary1.setTotalEvents(5)

      const collectionWithSummary2 = new EventCollectionWithSummary()
      collectionWithSummary2.setCollection(collection2)
      collectionWithSummary2.setTotalEvents(10)

      const result = extractCollection([collectionWithSummary1, collectionWithSummary2])

      expect(result.collectionWithSummary).toBeDefined()
      expect(result.collectionWithSummary?.getCollection()?.getId()).toBe('collection-1')
      expect(result.totalEvents).toBe(5)
    })
  })
})
