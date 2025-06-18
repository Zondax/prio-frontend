import { type Activity, type ActivitySlot, createActivityIndicesMap, createActivityMap, type Event, useActivityStore } from '@mono-state'
import {
  calculateTransportInfo,
  findExistingSlot,
  getCurrentTimeInMinutes,
  getEarliestActivity,
  getEarliestReachableSlot,
  getSlotBorders,
  isTimeDisabled,
  isTimeSelected,
  prepareSlotCreation,
  prepareSlotDeletion,
  useActivityDateFilter,
  useActivitySlots,
  useTimelineConfiguration,
  useTravelTimes,
} from '@mono-state/feature/activity'
import { useEndpointStore } from '@mono-state/stores'
import { format24Hourtime, getMinutesFromTimestamp } from '@mono-state/utils'
import { useGrpcSetup } from '@zondax/auth-expo/hooks'
import { useFocusEffect } from 'expo-router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { ActivityBlock } from './activity-block'
import { ActivityDetails } from './activity-details'
import { ActivityList } from './activity-list'
import { CurrentTimeIndicator } from './current-time-indicator'
import { EmptySchedule } from './empty-schedule'
import { ErrorSchedule } from './error-schedule'
import { TimeColumn } from './time-column'
import { TimeGrid } from './time-grid'
import { TimelineLayoutProvider } from './timeline-layout-context'
import { TravelTimeBlock } from './travel-time-block'

interface TimelineSchedulerProps {
  slotDurationMinutes?: number
  showSlotTime?: boolean
  slotHeight?: number
  eventWidth?: number
  formatTime?: (minutes: number) => string
  onActivityClick?: (activityId: string) => void
  onTimeSlotClick?: (activityId: string, time: number) => void
  renderActivityButton?: (activity: Activity, isExpanded: boolean, onClick: () => void) => React.ReactNode
  renderActivityDetails?: (event: Event) => React.ReactNode
  autoReorder?: boolean
  defaultStartTime?: number
  selectedDate?: Date
}

/**
 * Hook to calculate layout dimensions and properties
 */
function useLayoutCalculations(
  activities: Activity[],
  slotsPerDay: number,
  slotHeight: number,
  eventWidth: number,
  slotDurationMinutes: number,
  showSlotTime: boolean
) {
  // Layout calculation constants
  const EVENT_LIST_HEIGHT = 48
  const TOP_OFFSET = 16
  const TIME_COLUMN_WIDTH = 58
  const EVENT_SPACING = 10
  const EVENT_LIST_BOTTOM_SPACING = 4
  const columnGap = 16 // 1rem = 16px

  // Calculate column and grid dimensions
  const columnWidth = useMemo(() => {
    return activities.length > 0 ? Math.max(eventWidth, (100 - (activities.length - 1) * columnGap) / activities.length) : eventWidth
  }, [activities.length, eventWidth, columnGap])

  const gridWidth = useMemo(() => {
    return activities.length > 0 ? activities.length * eventWidth + (activities.length - 1) * columnGap + TIME_COLUMN_WIDTH : 'auto'
  }, [activities.length, eventWidth, columnGap, TIME_COLUMN_WIDTH])

  const gridHeight = slotsPerDay * slotHeight

  // Create layout context value
  const layoutContextValue = useMemo(() => {
    return {
      slotHeight,
      slotDurationMinutes,
      eventWidth,
      columnWidth,
      gridWidth,
      gridHeight,
      topOffset: TOP_OFFSET,
      headerHeight: EVENT_LIST_HEIGHT,
      headerBottomSpacing: EVENT_LIST_BOTTOM_SPACING,
      timeColumnWidth: TIME_COLUMN_WIDTH,
      eventSpacing: EVENT_SPACING,
      showSlotTime,
      columnGap,
    }
  }, [slotHeight, slotDurationMinutes, eventWidth, columnWidth, gridWidth, gridHeight, showSlotTime, columnGap])

  return {
    EVENT_LIST_HEIGHT,
    TIME_COLUMN_WIDTH,
    EVENT_SPACING,
    TOP_OFFSET,
    columnGap,
    columnWidth,
    gridWidth,
    gridHeight,
    layoutContextValue,
  }
}

/**
 * Hook to handle activity selection and find the latest activity window
 */
function useActivitySelection(activities: Activity[], activitySlots: ActivitySlot[], onActivityClick?: (activityId: string) => void) {
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null)

  // Find selected activity
  const selectedActivity = useMemo(() => {
    return activities?.find((e) => e.getId() === expandedActivityId)
  }, [activities, expandedActivityId])

  // Find latest activity window
  const latestActivityWindow = useMemo(() => {
    return activitySlots.length > 0
      ? activitySlots.reduce((latest, current) => {
          const currentEndTime = current.getEndTime()?.getSeconds()
          const latestEndTime = latest.getEndTime()?.getSeconds()
          return currentEndTime && latestEndTime && currentEndTime > latestEndTime ? current : latest
        })
      : null
  }, [activitySlots])

  // Toggle activity selection
  const toggleEventDetails = (activityId: string) => {
    setExpandedActivityId(expandedActivityId === activityId ? null : activityId)
    if (onActivityClick) {
      onActivityClick(activityId)
    }
  }

  // Add close handler
  const handleClose = () => {
    setExpandedActivityId(null)
  }

  return {
    expandedActivityId,
    selectedActivity,
    latestActivityWindow,
    toggleEventDetails,
    handleClose,
  }
}

/**
 * Hook to handle time slot selection
 */
function useTimeSlotSelection(
  activitySlots: ActivitySlot[],
  write: ((slot: ActivitySlot, isDelete: boolean) => Promise<ActivitySlot | undefined>) | undefined,
  slotDurationMinutes: number,
  onTimeSlotClick?: (activityId: string, time: number) => void
) {
  // Handle time slot selection
  const toggleTimeSelection = (activityId: string, time: number) => {
    // Try to find an existing slot for this activity and time
    const existingSlot = findExistingSlot(activitySlots, activityId, time)
    let updateData: ActivitySlot
    let isDelete = false

    if (existingSlot) {
      // Handle deletion - prepare a slot with just the ID but no start/end time
      const deleteSlot = prepareSlotDeletion(existingSlot)
      updateData = deleteSlot
      isDelete = true
    } else {
      // Handle creation
      const { slotData } = prepareSlotCreation(activityId, time, slotDurationMinutes)
      updateData = slotData
    }

    // Call the update function from the store to persist changes
    write?.(updateData, isDelete).catch((error) => {
      console.error('Failed to update activity slot:', error)
    })

    if (onTimeSlotClick) {
      onTimeSlotClick(activityId, time)
    }
  }

  return {
    toggleTimeSelection,
  }
}

export default function TimelineScheduler({
  slotDurationMinutes = 60,
  showSlotTime = false,
  slotHeight = 40,
  eventWidth = 100,
  formatTime = format24Hourtime,
  onActivityClick,
  onTimeSlotClick,
  renderActivityButton,
  renderActivityDetails,
  autoReorder = true,
  defaultStartTime = 8 * 60, // Default to 8:00 AM
  selectedDate = new Date(),
}: TimelineSchedulerProps) {
  // Get activities and route matrix from the store
  const { write, isWriting, isLoading, error, setParams, getData, getSortedActivities, setInput, refresh } = useActivityStore()

  // Setup gRPC configuration with authentication
  const { selectedEndpoint } = useEndpointStore()
  useGrpcSetup(setParams, selectedEndpoint)

  // Apply date filtering based on the selected date
  useActivityDateFilter({ selectedDate, setInput })

  // Refresh activities when screen comes into focus (switching tabs)
  useFocusEffect(
    React.useCallback(() => {
      // When the screen comes into focus, refresh the data
      refresh()
    }, [refresh])
  )

  // Get activities data and route matrix from the store
  const { routeMatrix } = useMemo(() => {
    const data = getData()
    if (!data) return { activities: [], routeMatrix: undefined }

    return {
      activities: data.getActivities()?.getItemsList() ?? [],
      routeMatrix: data.getRouteMatrix(),
    }
  }, [getData])

  // Get the sorted activities in staircase style
  const activities = useMemo(() => {
    return getSortedActivities(autoReorder)
  }, [getSortedActivities, autoReorder])

  // Extract the localTimezone from the first activity
  const localTimezone = useMemo(() => {
    return activities[0]?.getEvent()?.getDate()?.getLocalTimezone()
  }, [activities])

  const gridRef = useRef<ScrollView>(null)
  const horizontalScrollRef = useRef<ScrollView>(null)
  const headerScrollRef = useRef<ScrollView>(null)
  const timeColumnScrollRef = useRef<ScrollView>(null)

  // Get all activity slots (assuming activities are already filtered for today)
  const activitySlots = useActivitySlots(activities)

  // Calculate travel times between activities
  const travelTimes = useTravelTimes(activitySlots)

  // Time configuration for the timeline
  const { timeSlots, slotsPerDay } = useTimelineConfiguration(activities, slotDurationMinutes)

  // Layout calculations and context
  const {
    EVENT_LIST_HEIGHT,
    TIME_COLUMN_WIDTH,
    EVENT_SPACING,
    TOP_OFFSET,
    columnGap,
    gridHeight,
    layoutContextValue,
    gridWidth,
    columnWidth,
  } = useLayoutCalculations(activities, slotsPerDay, slotHeight, eventWidth, slotDurationMinutes, showSlotTime)

  // Activity selection and latest window
  const { expandedActivityId, selectedActivity, latestActivityWindow, toggleEventDetails, handleClose } = useActivitySelection(
    activities,
    activitySlots,
    onActivityClick
  )

  // Time slot selection
  const { toggleTimeSelection } = useTimeSlotSelection(activitySlots, write, slotDurationMinutes, onTimeSlotClick)

  // Add a function to calculate current time scroll position
  const getCurrentTimeScrollPosition = () => {
    const now = new Date()
    const minutes = now.getHours() * 60 + now.getMinutes()
    return (minutes / slotDurationMinutes) * slotHeight
  }

  // Add check to determine if selected date is today
  const isSelectedDateToday = useMemo(() => {
    const today = new Date()
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    )
  }, [selectedDate])
  // Calculate the scroll position based on earliest activity
  const scrollPosition = useMemo(() => {
    const currentTimePosition = getCurrentTimeInMinutes()
    const earliestActivityResult = getEarliestActivity(activities, localTimezone, isSelectedDateToday ? currentTimePosition : null)
    const earliestActivity = earliestActivityResult?.activity
    const startTime = earliestActivityResult?.startTime

    if (earliestActivity && startTime) {
      return (startTime / slotDurationMinutes) * slotHeight
    }
    return null
  }, [activities, slotHeight, slotDurationMinutes, localTimezone, isSelectedDateToday])

  // Only scroll when the selected date changes
  useEffect(() => {
    if (!gridRef.current || scrollPosition === null) return

    const gridElement = gridRef.current
    gridElement.scrollTo({ y: scrollPosition, animated: true })
  }, [selectedDate, scrollPosition])

  // Memoize travel time blocks rendering
  const travelTimeBlocks = useMemo(() => {
    if (isLoading) {
      return null
    }

    // Pre-compute activity mappings for O(1) lookups
    const activityMap = createActivityMap(activities)
    const activityIndices = createActivityIndicesMap(activities)

    return travelTimes.map((travel, index) => {
      const transports = calculateTransportInfo(travel.from, travel.to, routeMatrix)
      const destinationActivity = activityMap.get(travel.to.getActivityId())

      // Get indices from pre-computed map
      const sourceIndex = activityIndices.get(travel.from.getActivityId()) ?? 0
      const destinationIndex = activityIndices.get(travel.to.getActivityId()) ?? 0

      const fromLocationEndTime = travel.from.getEndTime()?.getSeconds() ?? 0
      const toLocationStartTime = travel.to.getStartTime()?.getSeconds() ?? 0

      const startY = (getMinutesFromTimestamp(fromLocationEndTime, localTimezone) / slotDurationMinutes) * slotHeight + EVENT_LIST_HEIGHT
      const endY = (getMinutesFromTimestamp(toLocationStartTime, localTimezone) / slotDurationMinutes) * slotHeight + EVENT_LIST_HEIGHT

      return (
        <TravelTimeBlock
          key={`${travel.from.getActivityId()}-${travel.to.getActivityId()}`}
          position={{
            startY,
            endY,
          }}
          transports={transports}
          formatTime={formatTime}
          localTimezone={localTimezone}
          destinationActivity={destinationActivity}
          sourceIndex={sourceIndex}
          destinationIndex={destinationIndex}
        />
      )
    })
  }, [activities, travelTimes, routeMatrix, localTimezone, slotDurationMinutes, slotHeight, EVENT_LIST_HEIGHT, formatTime, isLoading])

  // Memoize activity blocks rendering
  const activityBlocks = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <View
          key={`skeleton-${index}`}
          style={[
            styles.skeletonBlock,
            {
              top: TOP_OFFSET + index * (slotHeight + EVENT_SPACING),
              left: (index % 3) * (eventWidth + columnGap),
              width: columnWidth,
              height: gridHeight,
            },
          ]}
          className="bg-muted rounded-md opacity-70"
        />
      ))
    }

    return activities.map((activity: Activity, index: number) => {
      const event = activity.getEvent()
      if (!event) return null

      const earliestReachableSlot = getEarliestReachableSlot(
        activity.getId(),
        latestActivityWindow,
        slotDurationMinutes,
        routeMatrix,
        localTimezone
      )

      return (
        <ActivityBlock
          key={activity.getId()}
          event={event}
          activityId={activity.getId()}
          index={index}
          timeHandlers={{
            formatTime,
            isTimeSelected: (activityId, time) => isTimeSelected(activitySlots, activityId, time, localTimezone),
            isTimeDisabled: (activityId, time) => isTimeDisabled(activitySlots, activityId, time, localTimezone),
            toggleTimeSelection,
            getSlotBorders: (activityId, time) => getSlotBorders(activitySlots, activityId, time, slotDurationMinutes, localTimezone),
          }}
          travelInfo={{
            earliestReachableSlot,
            latestSelectionTime: latestActivityWindow?.getEndTime()
              ? getMinutesFromTimestamp(latestActivityWindow.getEndTime()?.getSeconds() ?? 0, localTimezone)
              : null,
            latestSelection: latestActivityWindow,
            routeMatrix,
          }}
          localTimezone={localTimezone}
        />
      )
    })
  }, [
    isLoading,
    activities,
    EVENT_LIST_HEIGHT,
    TOP_OFFSET,
    slotHeight,
    EVENT_SPACING,
    columnGap,
    eventWidth,
    gridHeight,
    latestActivityWindow,
    slotDurationMinutes,
    routeMatrix,
    formatTime,
    activitySlots,
    localTimezone,
    toggleTimeSelection,
  ])

  // Function to sync horizontal scrolling between header and grid
  const handleHorizontalScroll = (event: any) => {
    const { x } = event.nativeEvent.contentOffset
    if (headerScrollRef.current) {
      headerScrollRef.current.scrollTo({ x, animated: false })
    }
  }

  // Function to sync vertical scrolling between time column and grid
  const handleVerticalScroll = (event: any) => {
    const { y } = event.nativeEvent.contentOffset
    if (timeColumnScrollRef.current) {
      timeColumnScrollRef.current.scrollTo({ y, animated: false })
    }
  }

  // Function to handle retry when errors occur
  const handleRetry = () => {
    // Refresh the data from the API
    refresh()
  }

  // Check if there are no activities to display
  const hasNoActivities = !isLoading && activities.length === 0

  // Show error if present
  if (error) {
    return <ErrorSchedule error={error} onRetry={handleRetry} />
  }

  if (hasNoActivities) {
    return <EmptySchedule selectedDate={selectedDate} className="mx-4" />
  }

  return (
    <TimelineLayoutProvider value={layoutContextValue}>
      <View style={[styles.container]} className="bg-background">
        <>
          {/* Custom Activity header with synced scrolling */}
          <ActivityList
            activities={activities}
            headerScrollRef={headerScrollRef}
            isLoading={isLoading}
            expandedActivityId={expandedActivityId}
            toggleEventDetails={toggleEventDetails}
          />

          {/* Main scrollable grid */}
          <View style={[styles.gridContainerHorizontal, { position: 'relative' }]}>
            {/* Time column with synced vertical scrolling */}
            <TimeColumn
              timeSlots={timeSlots}
              formatTime={formatTime}
              localTimezone={localTimezone}
              scrollRef={timeColumnScrollRef}
              showRawTimezone={true}
            />

            <ScrollView
              ref={horizontalScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              onScroll={handleHorizontalScroll}
              scrollEventThrottle={16}
              contentContainerStyle={{ paddingLeft: TIME_COLUMN_WIDTH }}
            >
              <ScrollView
                ref={gridRef}
                style={[styles.gridContainer]}
                contentContainerStyle={{
                  height: gridHeight,
                  width: typeof gridWidth === 'string' ? 'auto' : gridWidth - TIME_COLUMN_WIDTH,
                }}
                showsVerticalScrollIndicator={false}
                bounces={false}
                decelerationRate="fast"
                snapToInterval={slotHeight}
                snapToAlignment="start"
                onScroll={handleVerticalScroll}
                scrollEventThrottle={16}
              >
                {/* Background time grid */}
                <TimeGrid timeSlots={timeSlots} />

                {/* Current time indicator line - only show if selected date is today */}
                {isSelectedDateToday && <CurrentTimeIndicator slotHeight={slotHeight} slotDurationMinutes={slotDurationMinutes} />}

                {/* Travel time blocks */}
                {travelTimeBlocks}

                {/* Activity blocks */}
                {activityBlocks}
              </ScrollView>
            </ScrollView>
          </View>

          {/* Details panel for the selected event */}
          {selectedActivity && (
            <ActivityDetails selectedActivity={selectedActivity} renderActivityDetails={renderActivityDetails} onClose={handleClose} />
          )}
        </>
      </View>
    </TimelineLayoutProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gridContainer: {
    flex: 1,
  },
  gridContainerHorizontal: {
    flex: 1,
  },
  eventsGrid: {
    flex: 1,
    position: 'relative',
  },
  skeletonBlock: {
    position: 'absolute',
    zIndex: 20,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  skeletonHeaderItem: {
    height: 36,
    borderRadius: 6,
    marginBottom: 6,
  },
  activityButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityButtonText: {
    fontSize: 13,
  },
  errorText: {
    marginBottom: 12,
    fontSize: 13,
    paddingHorizontal: 12,
  },
})
