import { describe, expect, it } from 'vitest'

import { PageRequest, SortingOption } from '../../entities/proto/api/v1/common_pb'
import { createPageRequest, createSortingOption, type PaginationInput } from '../pagination'

describe('pagination utils', () => {
  describe('createSortingOption', () => {
    it('should return undefined if sortData is undefined', () => {
      const result = createSortingOption(undefined)
      expect(result).toBeUndefined()
    })

    it('should return undefined if sortData is empty', () => {
      const result = createSortingOption({})
      expect(result).toBeUndefined()
    })

    it('should create SortingOption with kind only', () => {
      const sortData = { kind: 'test_kind' }
      const result = createSortingOption(sortData)

      expect(result).toBeInstanceOf(SortingOption)
      expect(result?.getKind()).toBe('test_kind')
      expect(result?.getOrderAscending()).toBeFalsy()
    })

    it('should create SortingOption with orderAscending only', () => {
      const sortData = { orderAscending: true }
      const result = createSortingOption(sortData)

      expect(result).toBeInstanceOf(SortingOption)
      expect(result?.getKind()).toBe('')
      expect(result?.getOrderAscending()).toBe(true)
    })

    it('should create SortingOption with both properties', () => {
      const sortData = { kind: 'test_kind', orderAscending: true }
      const result = createSortingOption(sortData)

      expect(result).toBeInstanceOf(SortingOption)
      expect(result?.getKind()).toBe('test_kind')
      expect(result?.getOrderAscending()).toBe(true)
    })
  })

  describe('createPageRequest', () => {
    it('should return undefined if no pagination parameters are provided', () => {
      const input: PaginationInput = {}
      const result = createPageRequest(input)
      expect(result).toBeUndefined()
    })

    it('should create PageRequest with pageSize only', () => {
      const input: PaginationInput = { pageSize: 10 }
      const result = createPageRequest(input)

      expect(result).toBeInstanceOf(PageRequest)
      expect(result?.getPageSize()).toBe(10)
      expect(result?.getCursor()).toBe('')
      expect(result?.getSortingList()).toHaveLength(0)
    })

    it('should create PageRequest with cursor only', () => {
      const input: PaginationInput = { cursor: 'test_cursor' }
      const result = createPageRequest(input)

      expect(result).toBeInstanceOf(PageRequest)
      expect(result?.getPageSize()).toBe(0)
      expect(result?.getCursor()).toBe('test_cursor')
      expect(result?.getSortingList()).toHaveLength(0)
    })

    it('should create PageRequest with sorting only', () => {
      const input: PaginationInput = {
        sort: { kind: 'test_kind', orderAscending: true },
      }
      const result = createPageRequest(input)

      expect(result).toBeInstanceOf(PageRequest)
      expect(result?.getPageSize()).toBe(0)
      expect(result?.getCursor()).toBe('')

      const sortingList = result?.getSortingList()
      expect(sortingList).toHaveLength(1)
      expect(sortingList?.[0].getKind()).toBe('test_kind')
      expect(sortingList?.[0].getOrderAscending()).toBe(true)
    })

    it('should create PageRequest with all parameters', () => {
      const input: PaginationInput = {
        pageSize: 20,
        cursor: 'next_page',
        sort: { kind: 'title', orderAscending: false },
      }
      const result = createPageRequest(input)

      expect(result).toBeInstanceOf(PageRequest)
      expect(result?.getPageSize()).toBe(20)
      expect(result?.getCursor()).toBe('next_page')

      const sortingList = result?.getSortingList()
      expect(sortingList).toHaveLength(1)
      expect(sortingList?.[0].getKind()).toBe('title')
      expect(sortingList?.[0].getOrderAscending()).toBe(false)
    })

    it('should handle undefined sort parameter correctly', () => {
      const input: PaginationInput = {
        pageSize: 20,
        cursor: 'next_page',
        sort: undefined,
      }
      const result = createPageRequest(input)

      expect(result).toBeInstanceOf(PageRequest)
      expect(result?.getPageSize()).toBe(20)
      expect(result?.getCursor()).toBe('next_page')
      expect(result?.getSortingList()).toHaveLength(0)
    })
  })
})
