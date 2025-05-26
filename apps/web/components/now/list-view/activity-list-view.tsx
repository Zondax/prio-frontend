'use client'

import type { Event, MapMarker } from '@prio-state'
import { calculateTransportInfo, useActivitySlots, useTravelTimes } from '@prio-state/feature/activity'
import { createEventMapMarker } from '@prio-state/feature/map'
import type { Activity, RouteMatrix } from '@prio-state/stores'
import { format24Hourtime } from '@prio-state/utils'
import { useCallback, useMemo } from 'react'

import { WebMap } from '../../map/map'
import { EmptySchedule } from '../empty-schedule'
import { ActivityCard } from './activity-card'
import { TravelTimeBlock } from './travel-time-block'

interface ActivityListViewProps {
  activities: Activity[]
  isLoading: boolean
  routeMatrix?: RouteMatrix
  renderActivityDetails?: (event: Event) => React.ReactNode
  onEventClick?: (event: Event) => void
  selectedDate?: Date
  hoveredEventId?: number | null
  onEventHover?: (event: Event) => void
  onEventHoverEnd?: () => void
}

export default function ActivityListView({
  activities,
  isLoading,
  routeMatrix,
  renderActivityDetails,
  onEventClick,
  selectedDate = new Date(),
  hoveredEventId = null,
  onEventHover,
  onEventHoverEnd,
}: ActivityListViewProps) {
  // Get all activity slots
  const activitySlots = useActivitySlots(activities)

  // Calculate travel times between activities
  const travelTimes = useTravelTimes(activitySlots)

  // Create map markers from activities
  const eventMarkers = useMemo(() => {
    const markers: MapMarker[] = []

    for (const activity of activities) {
      const event = activity.getEvent()
      if (event) {
        const marker = createEventMapMarker(event)
        if (marker) {
          markers.push(marker)
        }
      }
    }

    return markers
  }, [activities])

  // Calculate center coordinates for the map
  const mapCenter = useMemo(() => {
    if (eventMarkers.length > 0) {
      // Use the first marker's coordinates as center
      const firstMarker = eventMarkers[0]
      const lat = firstMarker.getCoordinates()?.getLatitude()
      const lng = firstMarker.getCoordinates()?.getLongitude()

      if (lat && lng) {
        return [lng, lat] as [number, number]
      }
    }
    return undefined
  }, [eventMarkers])

  // Handle marker click
  const handleMarkerClick = useCallback(
    (marker: MapMarker) => {
      if (onEventClick && marker.hasEvent()) {
        const event = marker.getEvent()
        if (event) {
          // Create a full Event object from the MarkerEvent
          const fullEvent = activities
            .find((activity) => {
              const activityEvent = activity.getEvent()
              return activityEvent && activityEvent.getId() === event.getId()
            })
            ?.getEvent()

          if (fullEvent) {
            onEventClick(fullEvent)
          }
        }
      }
    },
    [onEventClick, activities]
  )

  // Show skeleton loader when data is loading
  if (isLoading) {
    return (
      <div className="bg-background h-full flex flex-col">
        <div className="sticky top-0 z-10 flex-none">
          <div className="bg-muted h-[200px] w-full" />
        </div>
        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div key={index}>
                <div className="bg-muted rounded-lg p-4">
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
                  <div className="mt-3 flex justify-between">
                    <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
                    <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
                  </div>
                </div>
                {index < 3 && (
                  <div className="py-2 px-4 my-2">
                    <div className="flex items-center">
                      <div className="h-3 bg-muted-foreground/20 rounded w-1/6 mr-2" />
                      <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!activities.length) {
    return <EmptySchedule selectedDate={selectedDate} className="h-full" />
  }

  return (
    <div className="bg-background h-full flex flex-col max-h-full">
      {/* Map - fixed at top */}
      <div className="sticky top-0 z-10 flex-none">
        <WebMap
          markers={eventMarkers}
          selectedEventId={hoveredEventId}
          center={mapCenter}
          zoom={12}
          style={{ height: '200px' }}
          allowDrag={true}
          allowZoom={true}
          allowRotate={false}
          showControls={true}
          showFullscreenControl={true}
          showGeolocationControl={true}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* Activity list - scrollable */}
      <div className="overflow-y-auto flex-1 min-h-0">
        <div className="space-y-4 pt-2 pb-4 px-4">
          {activities.map((activity, index) => {
            const event = activity.getEvent()
            if (!event) return null

            return (
              <div key={activity.getId()}>
                <ActivityCard
                  event={event}
                  onEventClick={onEventClick || (() => {})}
                  onEventMouseEnter={onEventHover}
                  onEventMouseLeave={onEventHoverEnd}
                  isHovered={hoveredEventId === event.getId()}
                />
                {/* Add travel time block if there's a next activity */}
                {index < activities.length - 1 && travelTimes[index] && (
                  <TravelTimeBlock
                    transports={calculateTransportInfo(travelTimes[index].from, travelTimes[index].to, routeMatrix)}
                    formatTime={format24Hourtime}
                    localTimezone={activities[0]?.getEvent()?.getDate()?.getLocalTimezone()}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
