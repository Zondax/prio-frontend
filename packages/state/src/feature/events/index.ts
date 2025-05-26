import { Filter, FilterKind, GeoBoundingBox, Point } from '@prio-grpc/entities/proto/api/v1/common_pb'
import type { Event } from '@prio-grpc/entities/proto/api/v1/event_pb'

import type { MapBounds } from '../map'
import { isEventPinned } from './pin-management'

export * from './config'
export * from './filter-management/disambiguation'
export * from './filter-management/search-filters'
export * from './filter-management/useEventFilters'
export * from './hooks'
export * from './pin-management'
export * from './utils'
/**
 * Filter options for client-side event filtering
 */
export interface EventFilterOptions {
  /** When true, only shows pinned events */
  pinnedOnly?: boolean
}

/**
 * Gets the events to display based on specified filter options
 *
 * IMPORTANT: This function does NOT replace or bypass the store filtering system.
 * It complements backend filters by providing client-side filtering ONLY for
 * optimistic updates that haven't been processed by the backend yet.
 *
 * Use this function when:
 * - You need immediate UI feedback after status changes (like unpinning an event)
 * - Your UI is showing a filtered view and needs to immediately update after status changes
 * - You're already using backend filters but need optimistic updates to appear immediately
 *   WITHOUT refreshing all data from the backend
 *
 * @param events The list of events from the store (already with optimistic updates applied)
 * @param options The filter options to apply client-side
 * @returns The filtered list of events ready to display
 */
export function getDisplayEvents(events: Event[] | undefined, options: EventFilterOptions = {}): Event[] | undefined {
  if (!events) return events

  // Start with all events
  let filteredEvents = [...events]

  // Pinned status filter
  if (options.pinnedOnly) {
    filteredEvents = filteredEvents.filter((event) => isEventPinned(event))
  }

  return filteredEvents
}

/**
 * Helper function to create a geo bounding box filter for map queries
 *
 * @param topLeftLat Top-left corner latitude
 * @param topLeftLng Top-left corner longitude
 * @param bottomRightLat Bottom-right corner latitude
 * @param bottomRightLng Bottom-right corner longitude
 * @returns A Filter configured with a geo bounding box
 */
export function createGeoBoundingBoxFilter(topLeftLat: number, topLeftLng: number, bottomRightLat: number, bottomRightLng: number): Filter {
  const geoBox = new GeoBoundingBox()

  const topLeft = new Point()
  topLeft.setLatitude(topLeftLat)
  topLeft.setLongitude(topLeftLng)
  geoBox.setTopLeft(topLeft)

  const bottomRight = new Point()
  bottomRight.setLatitude(bottomRightLat)
  bottomRight.setLongitude(bottomRightLng)
  geoBox.setBottomRight(bottomRight)

  const filter = new Filter()
  filter.setKind(FilterKind.FILTER_KIND_GEO_BOUNDING_BOX)
  filter.setGeoBox(geoBox)

  return filter
}

/**
 * Helper function to add geographic bounds filter to the provided filters
 * If a geo filter already exists, it will be replaced with the new one
 */
export const addGeoBoundsFilter = (bounds: MapBounds, filters: Filter[] = []): Filter[] => {
  // Remove any existing geographic filter
  const filteredFilters = filters.filter((filter) => filter.getName() !== 'geo_bounding_box')

  // Create new geographic bounding box filter
  const geoFilter = createGeoBoundingBoxFilter(
    bounds.topLeft.latitude,
    bounds.topLeft.longitude,
    bounds.bottomRight.latitude,
    bounds.bottomRight.longitude
  )

  // Return new array with geo filter added
  return [...filteredFilters, geoFilter]
}

export { Filter, FilterKind }
