import type { Event } from '@prio-grpc'

import { formatDateWithTimezone, formatTimeWithTimezone } from '../../utils/time'

export function eventHasLocation(event: Event.Event) {
  const location = event.getLocation()
  const coordinates = location?.getCoordinates()
  const hasLocation = !!coordinates?.getLatitude() && !!coordinates?.getLongitude()
  return hasLocation
}

/**
 * Extracted data from an Event object
 */
export interface FormattedEventData {
  id: string
  title: string
  description: string
  eventDate: Date | undefined
  date: string | undefined
  time: string | undefined
  coordinates: any | undefined
  location: string
  imageUrl: string | undefined
  sourceName: string
  sourceUrl: string
  event: Event.Event
}

/**
 * Extracts common data fields from an Event object
 */
export function extractEventData(e: Event.Event): FormattedEventData {
  console.log(e)

  const id = e.getId().toString()

  const title = e.getTitle()
  const description = e.getDescription()
  const eventDate = e.getDate()?.getStart()?.toDate()
  const date = eventDate ? formatDateWithTimezone(eventDate) : undefined
  const localTimeZone = e.getDate()?.getLocalTimezone()
  const time = eventDate ? formatTimeWithTimezone(eventDate, localTimeZone) : undefined
  const coordinates = e.getLocation()?.getCoordinates()
  const location = coordinates ? coordinates.toString() : ''
  const imageUrl = e.getImage()

  const eventSource = e.getSource()
  const sourceName = eventSource?.getName() || ''
  const sourceUrl = eventSource?.getUrl() || ''

  return {
    event: e,
    id,
    title,
    description,
    eventDate,
    date,
    time,
    coordinates,
    location,
    imageUrl,
    sourceName,
    sourceUrl,
  }
}
