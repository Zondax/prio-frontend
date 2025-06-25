import { sha256 } from '@noble/hashes/sha2'
import { bytesToHex } from '@noble/hashes/utils'
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

/**
 * Extract UTM parameters from search params
 * Works with both server components (via props.searchParams) and client components (via useSearchParams())
 */
export function getUtmParams(searchParams: { [key: string]: string | string[] | undefined } | undefined | null) {
  const resolvedParams = searchParams

  if (!resolvedParams) {
    return {}
  }

  return {
    utm_source: typeof resolvedParams?.utm_source === 'string' ? resolvedParams.utm_source : undefined,
    utm_medium: typeof resolvedParams?.utm_medium === 'string' ? resolvedParams.utm_medium : undefined,
    utm_campaign: typeof resolvedParams?.utm_campaign === 'string' ? resolvedParams.utm_campaign : undefined,
    utm_term: typeof resolvedParams?.utm_term === 'string' ? resolvedParams.utm_term : undefined,
    utm_content: typeof resolvedParams?.utm_content === 'string' ? resolvedParams.utm_content : undefined,
  }
}

/**
 * Build a URL with any query parameters
 */
export function buildUrl(baseUrl: string, params: Record<string, string | undefined>) {
  let path = baseUrl

  // Add parameters if present
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  if (queryParams) {
    path += `?${queryParams}`
  }

  return path
}

// Helper function to format dates for display
// Uses a consistent format for both server and client to avoid hydration errors
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, 'MMM d, HH:mm')
}

// Client-only function for relative time formatting
// Use this with useEffect after hydration is complete
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString)

  if (isToday(date)) {
    const distance = formatDistanceToNow(date, { addSuffix: false })
    return distance === 'less than a minute' ? 'Just now' : `${distance} ago`
  }

  if (isYesterday(date)) {
    return 'Yesterday'
  }

  // For recent dates (within a week)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 7) {
    return formatDistanceToNow(date, { addSuffix: true })
  }

  // For older dates, show the formatted date
  return format(date, 'MMM d')
}

/**
 * Generates a SHA256 hash from a string using the @noble/hashes library.
 * Useful for creating stable keys from content for React lists.
 * @param str The input string.
 * @returns A hex encoded string hash.
 */
export const hashString = (str: string): string => {
  if (str.length === 0) {
    // Return a consistent, short string for empty input.
    // Using a descriptive fixed key is better than hashing an empty string,
    // as different "empty" concepts (e.g., null vs. undefined vs. "") might result in the same hash.
    return 'empty_string_key_val' // Or any other distinct fixed string.
  }
  const messageBytes = new TextEncoder().encode(str) // Convert string to Uint8Array
  const hashBytes = sha256(messageBytes) // Perform SHA256 hash
  return bytesToHex(hashBytes) // Convert hash bytes to a hex string
}
