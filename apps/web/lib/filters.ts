import { parseDateParam } from '@prio-state'
import { type Filter, createDateRangeFilter } from '@prio-state/feature/events'

// Extract date filter from URL parameters
export const getDateFilterFromUrl = (searchParams: URLSearchParams): Filter | undefined => {
  const startDateParam = searchParams.get('startDate') ?? undefined
  const endDateParam = searchParams.get('endDate') ?? undefined

  const startDate = parseDateParam(startDateParam)
  const endDate = parseDateParam(endDateParam)

  // Create date range filter if valid dates are provided
  if (startDate || endDate) {
    return createDateRangeFilter(startDate, endDate)
  }

  return undefined
}
