import { parseISO } from 'date-fns'

/**
 * Parses a date string parameter into a Date object.
 *
 * This function attempts to convert a string representation of a date into a JavaScript Date object.
 * It first tries to parse the string as an ISO format date (YYYY-MM-DD, with optional time component).
 * If that fails, it falls back to the standard Date constructor which can handle various date formats.
 *
 * @param dateParam - The date string to parse (e.g., '2023-01-15T12:30:00Z', '2023-01-15', 'Jan 15, 2023')
 * @returns A valid Date object if parsing succeeds, undefined otherwise (for null, empty, or invalid date strings)
 */
export const parseDateParam = (dateParam?: string): Date | undefined => {
  if (!dateParam) return undefined

  try {
    // Try parsing with parseISO first (for ISO format strings)
    const parsedDate = parseISO(dateParam)
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate
    }

    // Fallback to standard Date constructor
    const fallbackDate = new Date(dateParam)
    if (!Number.isNaN(fallbackDate.getTime())) {
      return fallbackDate
    }
  } catch (_e) {
    // Silently fail and return undefined for invalid dates
  }

  return undefined
}
