import { Filter, FilterKind } from '@prio-grpc/entities/proto/api/v1/common_pb'
import * as prioUtils from '@prio-grpc/utils'
import { describe, expect, it, vi } from 'vitest'

import {
  createCollectionIdFilter,
  createDateRangeFilter,
  createNLSearchFilter,
  createSearchFilter,
  createUnifiedSearchFilter,
} from './search-filters'

// Mock the dateToTimestamp function
vi.mock('@prio-grpc/utils', () => {
  const mockTimestamp = {
    setSeconds: vi.fn().mockReturnThis(),
    setNanos: vi.fn().mockReturnThis(),
  }

  return {
    dateToTimestamp: vi.fn().mockImplementation((date) => {
      return {
        ...mockTimestamp,
        seconds: Math.floor(date.getTime() / 1000),
        nanos: (date.getTime() % 1000) * 1000000,
      }
    }),
  }
})

// Mock the Filter and DateRange classes
vi.mock('@prio-grpc/entities/proto/api/v1/common_pb', async (importOriginal) => {
  const originalModule = (await importOriginal()) as typeof import('@prio-grpc/entities/proto/api/v1/common_pb')

  // Make a custom DateRange mock that will track if start/end dates are set
  class MockDateRange {
    _startDate = null
    _endDate = null

    setStartDate(timestamp: any) {
      this._startDate = timestamp
      return this
    }

    setEndDate(timestamp: any) {
      this._endDate = timestamp
      return this
    }

    hasStartDate() {
      return this._startDate !== null
    }

    hasEndDate() {
      return this._endDate !== null
    }
  }

  // Extend the real Filter class with our mock DateRange
  const mockFilterProto = {
    ...originalModule,
    DateRange: MockDateRange,
    Filter: class MockFilter extends originalModule.Filter {
      _dateRange = null

      setDateRange(dateRange: any) {
        this._dateRange = dateRange
        return this
      }

      getDateRange() {
        return this._dateRange
      }
    },
  }

  return mockFilterProto
})

describe('createSearchFilter', () => {
  it('should create a filter with FREE_TEXT kind', () => {
    const filter = createSearchFilter('concert')

    expect(filter).toBeInstanceOf(Filter)
    expect(filter.getKind()).toBe(FilterKind.FILTER_KIND_FREE_TEXT)
  })

  it('should set the name field to "title" by default', () => {
    const filter = createSearchFilter('jazz')

    expect(filter.getName()).toBe('title')
  })

  it('should set the text value to the search text', () => {
    const searchText = 'rock concert'
    const filter = createSearchFilter(searchText)

    expect(filter.getTextValue()).toBe(searchText)
  })

  it('should use custom field name when provided', () => {
    const filter = createSearchFilter('art', 'description')

    expect(filter.getName()).toBe('description')
  })
})

describe('createNLSearchFilter', () => {
  it('should create a filter with NL_QUERY kind', () => {
    const filter = createNLSearchFilter('events next weekend')

    expect(filter).toBeInstanceOf(Filter)
    expect(filter.getKind()).toBe(FilterKind.FILTER_KIND_NL_QUERY)
  })

  it('should set the name field to "nl_query"', () => {
    const filter = createNLSearchFilter('jazz concerts in san francisco')

    expect(filter.getName()).toBe('nl_query')
  })

  it('should set the nlQuery value to the search text', () => {
    const searchText = 'family friendly events this month'
    const filter = createNLSearchFilter(searchText)

    expect(filter.getNlQuery()).toBe(searchText)
  })
})

describe('createUnifiedSearchFilter', () => {
  it('should create a free text filter when isSmartSearch is false', () => {
    const filter = createUnifiedSearchFilter('concert', false)

    expect(filter.getKind()).toBe(FilterKind.FILTER_KIND_FREE_TEXT)
    expect(filter.getName()).toBe('title')
    expect(filter.getTextValue()).toBe('concert')
  })

  it('should create a natural language filter when isSmartSearch is true', () => {
    const filter = createUnifiedSearchFilter('concert near me', true)

    expect(filter.getKind()).toBe(FilterKind.FILTER_KIND_NL_QUERY)
    expect(filter.getName()).toBe('nl_query')
    expect(filter.getNlQuery()).toBe('concert near me')
  })

  it('should default to free text search when isSmartSearch is not provided', () => {
    const filter = createUnifiedSearchFilter('concert')

    expect(filter.getKind()).toBe(FilterKind.FILTER_KIND_FREE_TEXT)
  })

  it('should use custom field name for free text search when provided', () => {
    const filter = createUnifiedSearchFilter('live music', false, 'description')

    expect(filter.getKind()).toBe(FilterKind.FILTER_KIND_FREE_TEXT)
    expect(filter.getName()).toBe('description')
  })
})

describe('createDateRangeFilter', () => {
  it('should create a filter with DATE_RANGE kind', () => {
    const filter = createDateRangeFilter(new Date(), new Date())

    expect(filter).toBeInstanceOf(Filter)
    expect(filter.getKind()).toBe(FilterKind.FILTER_KIND_DATE_RANGE)
  })

  it('should set the name field to "date_range"', () => {
    const filter = createDateRangeFilter(new Date(), new Date())

    expect(filter.getName()).toBe('date_range')
  })

  it('should set start date to beginning of day if provided', () => {
    const startDate = new Date('2023-05-15T14:30:00')
    const filter = createDateRangeFilter(startDate)

    // Should be set to 00:00:00
    const expectedStartOfDay = new Date('2023-05-15T00:00:00')

    expect(vi.mocked(prioUtils.dateToTimestamp)).toHaveBeenCalledWith(expect.any(Date))
    // Check that the date passed to dateToTimestamp has hours set to 0
    const datePassedToTimestamp = vi.mocked(prioUtils.dateToTimestamp).mock.calls[0][0]
    expect(datePassedToTimestamp.getHours()).toBe(0)
    expect(datePassedToTimestamp.getMinutes()).toBe(0)
    expect(datePassedToTimestamp.getSeconds()).toBe(0)
    expect(datePassedToTimestamp.getMilliseconds()).toBe(0)
  })

  it('should set end date to end of day if provided', () => {
    const endDate = new Date('2023-05-20T10:15:00')
    const filter = createDateRangeFilter(undefined, endDate)

    // Should be set to 23:59:59.999
    const expectedEndOfDay = new Date('2023-05-20T23:59:59.999')

    // dateToTimestamp should be called with a date having hours set to 23
    expect(vi.mocked(prioUtils.dateToTimestamp)).toHaveBeenCalledWith(expect.any(Date))
    const datePassedToTimestamp = vi.mocked(prioUtils.dateToTimestamp).mock.calls[0][0]
    expect(datePassedToTimestamp.getHours()).toBe(23)
    expect(datePassedToTimestamp.getMinutes()).toBe(59)
    expect(datePassedToTimestamp.getSeconds()).toBe(59)
    expect(datePassedToTimestamp.getMilliseconds()).toBe(999)
  })

  it('should work with only start date', () => {
    const startDate = new Date('2023-06-01')
    const filter = createDateRangeFilter(startDate)

    // Get the date range from the filter
    const dateRange = filter.getDateRange()

    // Check that start date was set
    expect(dateRange?.hasStartDate()).toBe(true)

    // Check that end date was not set
    expect(dateRange?.hasEndDate()).toBe(false)
  })

  it('should work with only end date', () => {
    const endDate = new Date('2023-06-30')
    const filter = createDateRangeFilter(undefined, endDate)

    // Get the date range from the filter
    const dateRange = filter.getDateRange()

    // Check that start date was not set
    expect(dateRange?.hasStartDate()).toBe(false)

    // Check that end date was set
    expect(dateRange?.hasEndDate()).toBe(true)
  })

  it('should work with both start and end dates', () => {
    const startDate = new Date('2023-07-01')
    const endDate = new Date('2023-07-31')
    const filter = createDateRangeFilter(startDate, endDate)

    // Get the date range from the filter
    const dateRange = filter.getDateRange()

    // Check that both dates were set
    expect(dateRange?.hasStartDate()).toBe(true)
    expect(dateRange?.hasEndDate()).toBe(true)
  })

  it('should work with no dates provided', () => {
    const filter = createDateRangeFilter()

    // Get the date range from the filter
    const dateRange = filter.getDateRange()

    // Check that neither date was set
    expect(dateRange?.hasStartDate()).toBe(false)
    expect(dateRange?.hasEndDate()).toBe(false)
  })
})

describe('createCollectionIdFilter', () => {
  it('should create a filter with COLLECTION_ID kind', () => {
    const filter = createCollectionIdFilter('abc123')
    expect(filter).toBeInstanceOf(Filter)
    expect(filter.getKind()).toBe(FilterKind.FILTER_KIND_COLLECTION_ID)
  })

  it('should set the collectionId field to the provided value', () => {
    const collectionId = 'my-collection-id'
    const filter = createCollectionIdFilter(collectionId)
    expect(filter.getCollectionId()).toBe(collectionId)
  })
})
