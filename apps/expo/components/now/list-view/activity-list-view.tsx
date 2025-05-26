'use client'

import { type Activity, type Event, type MapMarker, useActivityStore } from '@prio-state'
import { calculateTransportInfo, useActivityDateFilter, useActivitySlots, useTravelTimes } from '@prio-state/feature/activity'
import { createEventMapMarker } from '@prio-state/feature/map'
import { useEndpointStore } from '@prio-state/stores'
import { format24Hourtime } from '@prio-state/utils'
import { useGrpcSetup } from '@zondax/auth-expo/hooks'
import React, { useMemo } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { MobileMap } from '@/components/map/map'
import { Skeleton } from '@/components/ui/skeleton'

import { EmptySchedule } from '../empty-schedule'
import { ActivityCard } from './activity-card'
import { TravelTimeBlock } from './travel-time-block'

interface ActivityListViewProps {
  renderActivityDetails?: (event: Event) => React.ReactNode
  onEventClick?: (event: Event) => void
  selectedDate?: Date
}

export default function ActivityListView({ renderActivityDetails, onEventClick, selectedDate = new Date() }: ActivityListViewProps) {
  const insets = useSafeAreaInsets()
  const { setParams, getData, getSortedActivities, setInput, isLoading } = useActivityStore()
  const { selectedEndpoint } = useEndpointStore()
  const [hoveredEventId, setHoveredEventId] = React.useState<number | null>(null)

  // Apply date filtering based on the selected date
  useActivityDateFilter({ selectedDate, setInput })

  // Setup gRPC configuration with authentication
  useGrpcSetup(setParams, selectedEndpoint)

  // Get activities data from the store
  const { routeMatrix } = React.useMemo(() => {
    const data = getData()
    if (!data) return { activities: [], routeMatrix: undefined }

    return {
      routeMatrix: data.getRouteMatrix(),
    }
  }, [getData])

  // Get the sorted activities in staircase style
  const activities = useMemo(() => {
    return getSortedActivities(true)
  }, [getSortedActivities])

  // Get all activity slots
  const activitySlots = useActivitySlots(activities)

  // Calculate travel times between activities
  const travelTimes = useTravelTimes(activitySlots)

  // Create map markers from activities
  const eventMarkers = React.useMemo(() => {
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
  const mapCenter = React.useMemo(() => {
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
  const handleMarkerClick = React.useCallback(
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

  const handleEventFocus = React.useCallback((event: Event) => {
    setHoveredEventId(event.getId())
  }, [])

  const handleEventBlur = React.useCallback(() => {
    setHoveredEventId(null)
  }, [])

  const renderItem = ({ item, index }: { item: Activity; index: number }) => {
    const event = item.getEvent()
    if (!event) return null

    return (
      <View>
        <ActivityCard
          event={event}
          onEventClick={onEventClick || (() => {})}
          onEventMouseEnter={handleEventFocus}
          onEventMouseLeave={handleEventBlur}
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
      </View>
    )
  }

  const renderEmptyComponent = () => {
    if (isLoading) {
      return <ActivityListSkeleton />
    }

    return (
      <View style={styles.emptyContainer}>
        <EmptySchedule selectedDate={selectedDate} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} className="bg-background">
      {/* Map - fixed at top */}
      <View style={styles.mapContainer}>
        <MobileMap
          markers={eventMarkers}
          selectedEventId={hoveredEventId}
          center={mapCenter}
          zoom={12}
          style={styles.map}
          allowDrag={true}
          allowZoom={true}
          allowRotate={false}
          showControls={true}
          showGeolocationControl={true}
          isLoading={isLoading}
          onMarkerClick={handleMarkerClick}
        />
      </View>

      {isLoading ? (
        <ActivityListSkeleton />
      ) : (
        <FlatList
          data={activities}
          renderItem={renderItem}
          keyExtractor={(item) => item.getId()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  )
}

const ActivityListSkeleton = () => {
  return (
    <View style={styles.listContent}>
      {[...Array(3)].map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <View style={styles.skeletonHeader}>
            <Skeleton className="h-6 w-28 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </View>
          <View style={styles.skeletonContent}>
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-3/4 rounded-md mt-2" />
            <Skeleton className="h-5 w-1/2 rounded-md mt-2" />
          </View>
          <View style={styles.skeletonFooter}>
            <Skeleton className="h-4 w-24 rounded-md" />
          </View>
          {index < 2 && (
            <View style={styles.skeletonTravelBlock}>
              <Skeleton className="h-10 w-1/2 rounded-md" />
            </View>
          )}
          {index < 2 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    height: 200,
    width: '100%',
  },
  map: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Add padding to account for the floating button
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  skeletonCard: {
    paddingVertical: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skeletonContent: {
    marginBottom: 12,
  },
  skeletonFooter: {
    alignItems: 'flex-end',
  },
  skeletonTravelBlock: {
    marginTop: 12,
    padding: 8,
    alignItems: 'center',
  },
})
