import { Event } from '@prio-grpc'
import { MapMarker, MapMarkerKind, type MarkerEvent } from '@prio-grpc/entities/proto/api/v1/event_pb'

import type { Coordinate, MapBounds } from './types'

export const THEME_MODES = {
  streets: 'streets',
  light: 'light',
  dark: 'dark',
}

/**
 * Calculate initial bounding box based on center and zoom level
 * @param center - The center coordinate of the map
 * @param zoom - The current zoom level of the map
 * @returns MapBounds object representing the initial bounding box
 */
export function calculateInitialBounds(center: Coordinate, zoom: number): MapBounds {
  // Approximate calculation for initial bounding box
  // At zoom level 12, each degree is roughly 111km at the equator
  // These values are approximations and will be refined when the map loads
  const latOffset = 0.1 / 2 ** (zoom - 10) // Adjust lat offset based on zoom
  const lngOffset = 0.15 / 2 ** (zoom - 10) // Adjust lng offset based on zoom

  return {
    topLeft: { latitude: center.latitude + latOffset, longitude: center.longitude - lngOffset },
    bottomRight: { latitude: center.latitude - latOffset, longitude: center.longitude + lngOffset },
  }
}

/**
 * Creates a single event marker from a marker event
 * @param event - The marker event to create a marker for
 * @param parentMarker - The parent marker (used to get coordinates)
 * @returns A new MapMarker instance for the event
 */
export function createSingleEventMarker(event: MarkerEvent, parentMarker?: MapMarker): MapMarker {
  const singleMarker = new MapMarker()
  singleMarker.setKind(MapMarkerKind.MAP_MARKER_KIND_EVENT_ITEM)
  singleMarker.setEvent(event)
  if (parentMarker?.hasCoordinates()) {
    singleMarker.setCoordinates(parentMarker.getCoordinates())
  } else {
    singleMarker.setCoordinates(event.getLocation()?.getCoordinates())
  }
  return singleMarker
}

/**
 * Creates a map marker for an event
 * @param event The event to create a marker for
 * @returns A MapMarker instance or null if the event has no coordinates
 */
export function createEventMapMarker(event: Event.Event): Event.MapMarker | null {
  const coordinates = event.getLocation()?.getCoordinates()
  if (!coordinates) return null

  const mapMarker = new Event.MapMarker()
  mapMarker.setKind(Event.MapMarkerKind.MAP_MARKER_KIND_EVENT_ITEM)
  mapMarker.setCoordinates(coordinates)
  mapMarker.setEvent(getMarkerEvent(event))

  return mapMarker
}

function getMarkerEvent(event: Event.Event): Event.MarkerEvent {
  const markerEvent = new Event.MarkerEvent()
  markerEvent.setId(event.getId())
  markerEvent.setTitle(event.getTitle())
  markerEvent.setImage(event.getImage())
  markerEvent.setLocationType(event.getLocationType())

  const startDate = event.getDate()?.getStart()?.toDate()
  if (startDate) {
    markerEvent.setStartDate(startDate.toISOString())
  }
  const localTimezone = event.getDate()?.getLocalTimezone()
  if (localTimezone) {
    markerEvent.setLocalTimezone(localTimezone)
  }

  return markerEvent
}

export function getLocationIQKey(): string {
  // Check which token exists and prioritize mobile-specific token
  const expoToken = process.env.EXPO_PUBLIC_LOCATIONIQ_TOKEN
  const nextToken = process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN

  return expoToken || nextToken || 'pk.placeholder'
}

export function getMapStyle(mode: (typeof THEME_MODES)[keyof typeof THEME_MODES]): string {
  const locationiqToken = getLocationIQKey()

  return `https://tiles.locationiq.com/v3/${mode}/vector.json?key=${locationiqToken}`
}
