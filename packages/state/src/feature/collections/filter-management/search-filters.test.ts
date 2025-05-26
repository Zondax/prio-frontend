import { EventCollectionFilter, EventCollectionFilterType } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { describe, expect, it, vi } from 'vitest'

import { createIdFilter } from './search-filters'

// Mock the EventCollectionFilter class
vi.mock('@prio-grpc/entities/proto/api/v1/eventscollections_pb', () => {
  return {
    EventCollectionFilter: class MockEventCollectionFilter {
      _type = null
      _id = null
      _name = null
      setType(type: any) {
        this._type = type
        return this
      }

      getType() {
        return this._type
      }

      setName(name: string) {
        this._name = name
        return this
      }

      getName() {
        return this._name
      }

      setId(id: string) {
        this._id = id
        return this
      }

      getId() {
        return this._id
      }
    },
    EventCollectionFilterType: {
      EVENT_COLLECTION_FILTER_ID: 'EVENT_COLLECTION_FILTER_ID',
    },
  }
})

describe('createIdFilter', () => {
  it('should create a filter with EVENT_COLLECTION_FILTER_ID type', () => {
    const filter = createIdFilter('abc123')

    expect(filter).toBeInstanceOf(EventCollectionFilter)
    expect(filter.getType()).toBe(EventCollectionFilterType.EVENT_COLLECTION_FILTER_ID)
  })

  it('should set the id field to the provided value', () => {
    const collectionId = 'my-collection-id'
    const filter = createIdFilter(collectionId)

    expect(filter.getId()).toBe(collectionId)
  })

  it('should handle numeric id strings', () => {
    const numericId = '12345'
    const filter = createIdFilter(numericId)

    expect(filter.getId()).toBe(numericId)
  })

  it('should handle UUIDs as id strings', () => {
    const uuidId = '550e8400-e29b-41d4-a716-446655440000'
    const filter = createIdFilter(uuidId)

    expect(filter.getId()).toBe(uuidId)
  })
})
