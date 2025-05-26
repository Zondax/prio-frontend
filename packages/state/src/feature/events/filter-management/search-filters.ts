import { DateRange, Filter, FilterKind } from '@prio-grpc/entities/proto/api/v1/common_pb'
import { dateToTimestamp } from '@prio-grpc/utils'

/**
 * Creates a search filter for free-text querying
 * @param searchText The text to search for
 * @param fieldName The field to search in (defaults to 'title')
 * @returns A Filter object configured for text search
 */
export function createSearchFilter(searchText: string, fieldName = 'title'): Filter {
  const filter = new Filter()
  filter.setKind(FilterKind.FILTER_KIND_FREE_TEXT)
  filter.setName(fieldName)
  filter.setTextValue(searchText)
  return filter
}

/**
 * Creates a natural language search filter
 * @param searchText The text to search for
 * @returns A Filter object configured for natural language search
 */
export function createNLSearchFilter(searchText: string): Filter {
  const filter = new Filter()
  filter.setKind(FilterKind.FILTER_KIND_NL_QUERY)
  filter.setName('nl_query')
  filter.setNlQuery(searchText)
  return filter
}

/**
 * Creates a unified search filter that can be either natural language or free-text
 * @param searchText The text to search for
 * @param isSmartSearch Whether to use natural language search (true) or free-text search (false)
 * @param fieldName The field to search in for free-text search (defaults to 'title')
 * @returns A Filter object configured for the specified search type
 */
export function createUnifiedSearchFilter(searchText: string, isSmartSearch = false, fieldName = 'title'): Filter {
  return isSmartSearch ? createNLSearchFilter(searchText) : createSearchFilter(searchText, fieldName)
}

/**
 * Creates a date range filter for events
 * @param startDate The start date to filter from (inclusive)
 * @param endDate The end date to filter to (inclusive)
 * @returns A Filter object configured for date range filtering
 */
export function createDateRangeFilter(startDate?: Date, endDate?: Date): Filter {
  const filter = new Filter()
  filter.setKind(FilterKind.FILTER_KIND_DATE_RANGE)
  filter.setName('date_range')

  // Create a date range object
  const dateRange = new DateRange()

  // Set start date if provided
  if (startDate) {
    // Set start date to the beginning of the day (00:00:00)
    const startOfDay = new Date(startDate)
    startOfDay.setHours(0, 0, 0, 0)
    dateRange.setStartDate(dateToTimestamp(startOfDay))
  }

  // Set end date if provided
  if (endDate) {
    // Set end date to the end of the day (23:59:59.999)
    const endOfDay = new Date(endDate)
    endOfDay.setHours(23, 59, 59, 999)

    dateRange.setEndDate(dateToTimestamp(endOfDay))
  }

  // Set the date range on the filter
  filter.setDateRange(dateRange)

  return filter
}

/**
 * Creates a collection ID filter
 * @param collectionId The ID of the collection to filter by
 * @returns A Filter object configured for collection ID filtering
 */
export function createCollectionIdFilter(collectionId: string): Filter {
  const filter = new Filter()
  filter.setKind(FilterKind.FILTER_KIND_COLLECTION_ID)
  filter.setCollectionId(collectionId)
  return filter
}
