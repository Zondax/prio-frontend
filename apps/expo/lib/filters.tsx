import { parseDateParam } from '@mono-state'
import { createDateRangeFilter, type Filter } from '@mono-state/feature/events'
import type { UnknownOutputParams } from 'expo-router'

// Extract date filter from URL parameters
export const getDateFilterFromUrl = (searchParams: UnknownOutputParams): Filter | undefined => {
  const startDateParam = searchParams.startDate ? String(searchParams.startDate) : undefined
  const endDateParam = searchParams.endDate ? String(searchParams.endDate) : undefined

  const startDate = parseDateParam(startDateParam)
  const endDate = parseDateParam(endDateParam)

  // Create date range filter if valid dates are provided
  if (startDate || endDate) {
    return createDateRangeFilter(startDate, endDate)
  }

  return undefined
}
