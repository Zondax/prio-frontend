'use client'

import { type Activity, type ActivitySlot, type Event, createActivityIndicesMap, createActivityMap, useActivityStore } from '@prio-state'
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
} from '@prio-state/feature/activity'
import { useEndpointStore } from '@prio-state/stores'
import { format24Hourtime, getMinutesFromTimestamp } from '@prio-state/utils'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useMediaQuery } from '@/hooks/use-media-query'

import { EventDetailsPreview } from '../explore/event-preview'
import { ActivityBlock } from './activity-block'
import { ActivityList } from './activity-list'
import { CurrentTimeIndicator } from './current-time-indicator'
import { EmptySchedule } from './empty-schedule'
import { ErrorSchedule } from './error-schedule'
import ActivityListView from './list-view/activity-list-view'
import { ViewToggleButton } from './list-view/view-toggle-button'
import { useViewType } from './list-view/view-type-context'
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
  hoveredEventId?: number | null
  onEventClick?: (event: Event) => void
  onEventHover?: (event: Event) => void
  onEventHoverEnd?: () => void
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
  const TIME_COLUMN_WIDTH = 100
  const EVENT_SPACING = 10
  const columnGap = 16 // 1rem = 16px

  // Calculate column and grid dimensions
  const columnWidth = useMemo(() => {
    return activities.length > 0
      ? `max(${eventWidth}px, calc((100% - ${(activities.length - 1) * columnGap}px) / ${activities.length}))`
      : `${eventWidth}px`
  }, [activities.length, eventWidth, columnGap])

  const gridWidth = useMemo(() => {
    return activities.length > 0 ? '100%' : `${activities.length * eventWidth + (activities.length - 1) * columnGap}px`
  }, [activities.length, eventWidth, columnGap])

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
  onTimeSlotClick?: (activityId: string, time: number) => void,
  localTimezone?: string
) {
  // Handle time slot selection
  const toggleTimeSelection = (activityId: string, time: number) => {
    // Try to find an existing slot for this activity and time
    const existingSlot = findExistingSlot(activitySlots, activityId, time, localTimezone)
    let updateData: ActivitySlot
    let isDelete = false

    if (existingSlot) {
      // Handle deletion - prepare a slot with just the ID but no start/end time
      const deleteSlot = prepareSlotDeletion(existingSlot)
      updateData = deleteSlot
      isDelete = true
    } else {
      // Handle creation
      const { slotData } = prepareSlotCreation(activityId, time, slotDurationMinutes, localTimezone)
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
  slotHeight = 48,
  eventWidth = 120,
  formatTime = format24Hourtime,
  onActivityClick,
  onTimeSlotClick,
  renderActivityButton,
  autoReorder = true,
  selectedDate = new Date(),
}: TimelineSchedulerProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const { viewType } = useViewType()
  const [hoveredEventId, setHoveredEventId] = useState<number | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Get activities and route matrix from the store
  const { write, isWriting, isLoading, error, setParams, getData, getSortedActivities, setInput, refresh } = useActivityStore()

  // Setup gRPC configuration with authentication
  const { selectedEndpoint } = useEndpointStore()
  useGrpcSetup(setParams, selectedEndpoint)

  // Apply date filtering based on the selected date
  useActivityDateFilter({ selectedDate, setInput })

  // Get route matrix from the store
  const { routeMatrix } = useMemo(() => {
    const data = getData()
    if (!data) return { activities: [], routeMatrix: undefined }

    return {
      routeMatrix: data.getRouteMatrix(),
    }
  }, [getData, isLoading, isWriting])

  // Get the sorted activities in staircase style
  const activities = useMemo(() => {
    return getSortedActivities(autoReorder)
  }, [getSortedActivities, autoReorder])

  // Extract the localTimezone from the first activity
  const localTimezone = useMemo(() => {
    return activities[0]?.getEvent()?.getDate()?.getLocalTimezone()
  }, [activities])

  const gridRef = useRef<HTMLDivElement>(null)

  // Get all activity slots (assuming activities are already filtered for today)
  const activitySlots = useActivitySlots(activities)

  // Calculate travel times between activities
  const travelTimes = useTravelTimes(activitySlots)

  // Time configuration for the timeline
  const { timeSlots, slotsPerDay } = useTimelineConfiguration(activities, slotDurationMinutes)

  // Layout calculations and context
  const { EVENT_LIST_HEIGHT, TIME_COLUMN_WIDTH, EVENT_SPACING, columnGap, gridHeight, layoutContextValue } = useLayoutCalculations(
    activities,
    slotsPerDay,
    slotHeight,
    eventWidth,
    slotDurationMinutes,
    showSlotTime
  )

  // Activity selection and latest window
  const { expandedActivityId, selectedActivity, latestActivityWindow, toggleEventDetails, handleClose } = useActivitySelection(
    activities,
    activitySlots,
    onActivityClick
  )

  // Create event detail state object from selected event
  const selectedEventDetailState = useMemo(() => {
    return selectedEvent
      ? {
          event: selectedEvent,
          isLoading: false,
        }
      : null
  }, [selectedEvent])

  // Time slot selection
  const { toggleTimeSelection } = useTimeSlotSelection(activitySlots, write, slotDurationMinutes, onTimeSlotClick, localTimezone)

  // Add a check to determine if selected date is today
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
    gridElement.scrollTo({ top: scrollPosition, behavior: 'smooth' })
  }, [selectedDate, scrollPosition])

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event)
  }, [])

  const handleEventHover = useCallback((event: Event) => {
    if (event) {
      setHoveredEventId(event.getId())
    }
  }, [])

  const handleEventHoverEnd = useCallback(() => {
    setHoveredEventId(null)
  }, [])

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
          sourceId={travel.from.getActivityId()}
          destinationId={travel.to.getActivityId()}
          sourceIndex={sourceIndex}
          destinationIndex={destinationIndex}
        />
      )
    })
  }, [activities, travelTimes, routeMatrix, localTimezone, slotDurationMinutes, slotHeight, formatTime, isLoading])

  // Memoize activity blocks rendering
  const activityBlocks = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="absolute z-20 animate-pulse bg-muted rounded-md"
          style={{
            top: `${EVENT_LIST_HEIGHT + index * (slotHeight + EVENT_SPACING)}px`,
            left: index === 0 ? '0' : `calc(${index} * (100% / 3) + ${index} * ${columnGap}px)`,
            width: 'calc(100% / 3)',
            height: `${gridHeight}px`,
          }}
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
          isHovered={hoveredEventId === event.getId()}
        />
      )
    })
  }, [
    isLoading,
    activities,
    EVENT_LIST_HEIGHT,
    slotHeight,
    EVENT_SPACING,
    columnGap,
    gridHeight,
    latestActivityWindow,
    slotDurationMinutes,
    routeMatrix,
    formatTime,
    activitySlots,
    localTimezone,
    toggleTimeSelection,
  ])

  // Render timeline view
  const renderTimelineView = () => (
    <div className="relative" style={{ width: '100%' }}>
      <div
        ref={gridRef}
        className="flex overflow-y-auto"
        style={{
          maxHeight: 'calc(100vh - 200px)',
        }}
      >
        {/* Time markers column */}
        <TimeColumn timeSlots={timeSlots} formatTime={formatTime} localTimezone={localTimezone} />

        {/* Events grid */}
        <div
          className="flex-1 relative"
          style={{
            width: `calc(100% - ${TIME_COLUMN_WIDTH}px)`,
            height: `${timeSlots.length * slotHeight + EVENT_LIST_HEIGHT}px`,
          }}
        >
          {/* Event list - sticky at the top */}
          <ActivityList
            activities={activities}
            isLoading={isLoading}
            expandedActivityId={expandedActivityId}
            handleEventClick={handleEventClick}
            renderActivityButton={renderActivityButton}
          />

          {/* Time grid */}
          <TimeGrid timeSlots={timeSlots} />

          {/* Travel time blocks */}
          {travelTimeBlocks}

          {/* Activity blocks */}
          {activityBlocks}

          {/* Current time indicator */}
          <CurrentTimeIndicator slotHeight={slotHeight} slotDurationMinutes={slotDurationMinutes} />
        </div>
      </div>
    </div>
  )

  // Render list view
  const renderListView = () => (
    <ActivityListView
      activities={activities}
      isLoading={isLoading}
      routeMatrix={routeMatrix}
      onEventClick={handleEventClick}
      selectedDate={selectedDate}
      hoveredEventId={hoveredEventId}
      onEventHover={handleEventHover}
      onEventHoverEnd={handleEventHoverEnd}
    />
  )

  // Show error if present
  if (error) {
    return <ErrorSchedule error={error} onRetry={() => refresh()} className="h-[calc(100vh-200px)] mx-4 mt-4" />
  }

  // Show empty state if no activities and not loading
  if (!isLoading && (!activities || activities.length === 0)) {
    return <EmptySchedule selectedDate={selectedDate} className="h-[calc(100vh-200px)] mx-4 mt-4" />
  }

  return (
    <TimelineLayoutProvider value={layoutContextValue}>
      <div className="w-full max-w-full relative">
        {!isDesktop && <ViewToggleButton />}

        {/* Event details display */}
        {selectedEventDetailState && (
          <EventDetailsPreview eventDetailState={selectedEventDetailState} onClose={() => setSelectedEvent(null)} showPinButtons={false} />
        )}

        {isDesktop ? (
          // Desktop: Show both timeline and list views side by side
          <div className="grid grid-cols-10 h-full w-full gap-4" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="col-span-7 overflow-x-auto">{renderTimelineView()}</div>
            <div className="col-span-3 h-full overflow-hidden">{renderListView()}</div>
          </div>
        ) : (
          // Mobile: Toggle between timeline and list views
          <div className="w-full">{viewType === 'timeline' ? renderTimelineView() : renderListView()}</div>
        )}
      </div>
    </TimelineLayoutProvider>
  )
}
