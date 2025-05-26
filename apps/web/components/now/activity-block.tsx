import { type ActivitySlot, type Event, type RouteMatrix, TransportMode, getMinutesFromTimestamp } from '@prio-state'
import {
  type EarliestReachableSlot,
  type SlotBorders,
  canSelectTimeSlot,
  formatTimeWithDayIndicator,
  isTimeReachable,
} from '@prio-state/feature/activity'
import { shouldDisableForTravelTime, showTransportIcon } from '@prio-state/feature/activity/transportUtils'
import { eventHasLocation } from '@prio-state/feature/events/utils'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TRANSPORT_ICONS } from '@/lib/scheduler'
import { cn } from '@/lib/utils'

import { useTimelineLayout } from './timeline-layout-context'

interface TimeSelectionHandlers {
  formatTime: (minutes: number) => string
  isTimeSelected: (eventId: string, time: number) => boolean
  isTimeDisabled: (eventId: string, time: number) => boolean
  toggleTimeSelection: (activityId: string, time: number) => void
  getSlotBorders: (eventId: string, time: number) => SlotBorders
}

interface TravelInfo {
  earliestReachableSlot: EarliestReachableSlot | null
  latestSelectionTime: number | null
  latestSelection: ActivitySlot | null
  routeMatrix?: RouteMatrix
}

interface ActivityBlockProps {
  event: Event
  activityId: string
  index: number
  timeHandlers: TimeSelectionHandlers
  travelInfo: TravelInfo
  localTimezone?: string
  isHovered?: boolean
}

/**
 * Props for the drag selection hook
 */
interface DragSelectionProps {
  /** ID of the activity being interacted with */
  activityId: string
  /** Array of time slots available for selection */
  timeSlots: number[]
  /** Function to check if a time slot can be enabled for interaction */
  isSlotEnabled: (time: number) => boolean
  /** Function to check if a time slot is already selected */
  isTimeSelected: (eventId: string, time: number) => boolean
  /** Function to toggle selection state of a time slot */
  toggleTimeSelection: (activityId: string, time: number) => void
}

/**
 * Hook to manage drag selection interactions with time slots
 * Supports selecting and deselecting slots via click or drag operations
 */
function useDragSelection({ activityId, timeSlots, isSlotEnabled, isTimeSelected, toggleTimeSelection }: DragSelectionProps) {
  // Event names and operation mode constants
  const MOUSE_UP_EVENT = 'mouseup'
  const MOUSE_MOVE_EVENT = 'mousemove'
  const DRAG_THRESHOLD_MS = 200
  const SELECT_MODE = 'select' as const
  const DESELECT_MODE = 'deselect' as const
  type SelectionMode = typeof SELECT_MODE | typeof DESELECT_MODE

  // References for tracking drag and selection
  const isDraggingRef = useRef(false)
  const startSlotRef = useRef<number | null>(null)
  const isMultiSelectRef = useRef(false)
  const selectionModeRef = useRef<SelectionMode>(SELECT_MODE)
  const lastClickTimeRef = useRef(0)

  // UI state
  const [highlightedSlots, setHighlightedSlots] = useState<number[]>([])

  // Calculate range between two time points
  const getTimeRange = useCallback(
    (from: number, to: number) => {
      const sortedTimes = [from, to].sort((a, b) => a - b)
      const min = sortedTimes[0]
      const max = sortedTimes[1]

      return timeSlots.filter((time) => time >= min && time <= max && isSlotEnabled(time))
    },
    [timeSlots, isSlotEnabled]
  )

  // Function to clean up all listeners
  const cleanupDragOperation = useCallback(() => {
    document.removeEventListener(MOUSE_UP_EVENT, handleFinishDrag)
    document.removeEventListener(MOUSE_MOVE_EVENT, handleSlotMouseMove)
  }, [])

  // Update selection during drag
  const updateDragSelection = useCallback(
    (currentTime: number) => {
      if (!isDraggingRef.current || startSlotRef.current === null) return

      const slotRange = getTimeRange(startSlotRef.current, currentTime)
      setHighlightedSlots(slotRange)
    },
    [getTimeRange]
  )

  // Handle mouse movement during global drag
  const handleSlotMouseMove = useCallback(() => {
    // The actual movement is handled with onMouseEnter on each slot
  }, [])

  // Finish drag operation and apply selections
  const handleFinishDrag = useCallback(() => {
    const dragDuration = Date.now() - lastClickTimeRef.current
    const isRealDrag = dragDuration > DRAG_THRESHOLD_MS || highlightedSlots.length > 1

    if (isDraggingRef.current) {
      if (isRealDrag && highlightedSlots.length > 0) {
        // Apply selections/deselections for all highlighted slots
        for (const time of highlightedSlots) {
          const isAlreadySelected = isTimeSelected(activityId, time)

          if (selectionModeRef.current === SELECT_MODE && !isAlreadySelected) {
            toggleTimeSelection(activityId, time)
          } else if (selectionModeRef.current === DESELECT_MODE && isAlreadySelected) {
            toggleTimeSelection(activityId, time)
          }
        }
      } else if (!isRealDrag && highlightedSlots.length === 1 && startSlotRef.current !== null) {
        // For individual clicks (not drags), toggle the selection
        toggleTimeSelection(activityId, startSlotRef.current)
      }
    }

    // Clean up state
    isDraggingRef.current = false
    startSlotRef.current = null
    setHighlightedSlots([])

    // Clean up listeners
    cleanupDragOperation()
  }, [highlightedSlots, activityId, isTimeSelected, toggleTimeSelection, cleanupDragOperation, SELECT_MODE, DESELECT_MODE])

  // Handle mouse enter on a slot during drag
  const handleSlotMouseEnter = useCallback(
    (time: number) => {
      updateDragSelection(time)
    },
    [updateDragSelection]
  )

  // Start drag operation
  const startDrag = useCallback(
    (time: number, isSelected: boolean, e: React.MouseEvent | React.TouchEvent) => {
      // Save time to detect clicks vs. drags
      lastClickTimeRef.current = Date.now()

      if (!isSlotEnabled(time)) return

      // Detect multi-selection key (Ctrl/Cmd)
      isMultiSelectRef.current = e.ctrlKey || e.metaKey

      // Determine if we're selecting or deselecting
      selectionModeRef.current = isSelected ? DESELECT_MODE : SELECT_MODE

      isDraggingRef.current = true
      startSlotRef.current = time
      setHighlightedSlots([time])

      // Prevent text selection
      e.preventDefault()

      // Add global listeners
      document.addEventListener(MOUSE_UP_EVENT, handleFinishDrag)
      document.addEventListener(MOUSE_MOVE_EVENT, handleSlotMouseMove)
    },
    [handleFinishDrag, handleSlotMouseMove, isSlotEnabled, SELECT_MODE, DESELECT_MODE]
  )

  // Clean up event listeners on unmount
  useEffect(() => {
    return () => {
      cleanupDragOperation()
    }
  }, [cleanupDragOperation])

  return {
    isDragging: isDraggingRef.current,
    isMultiSelect: isMultiSelectRef.current,
    isSelectMode: selectionModeRef.current === SELECT_MODE,
    highlightedSlots,
    startDrag,
    handleFinishDrag,
    handleSlotMouseEnter,
  }
}

export const ActivityBlock: React.FC<ActivityBlockProps> = ({
  event,
  activityId,
  index,
  timeHandlers,
  travelInfo,
  localTimezone,
  isHovered = false,
}) => {
  // Get layout from context
  const { slotHeight, slotDurationMinutes, columnWidth, headerHeight, topOffset, showSlotTime, columnGap } = useTimelineLayout()

  const { formatTime, isTimeDisabled, toggleTimeSelection, getSlotBorders, isTimeSelected } = timeHandlers
  const { earliestReachableSlot, latestSelectionTime, latestSelection } = travelInfo

  const startDateMinutes = getMinutesFromTimestamp(event.getDate()?.getStart()?.getSeconds() ?? 0, localTimezone)
  let endDateMinutes = getMinutesFromTimestamp(event.getDate()?.getEnd()?.getSeconds() ?? 0, localTimezone)

  // Take into account events that cross midnight
  if (endDateMinutes < startDateMinutes) {
    endDateMinutes += 24 * 60 // Add 24 hours worth of minutes
  }

  // Generate array of all time slots for this event
  const timeSlots = Array.from(
    { length: (endDateMinutes - startDateMinutes) / slotDurationMinutes },
    (_, i) => startDateMinutes + i * slotDurationMinutes
  )

  // Check if a slot is enabled for selection
  const isSlotEnabled = (time: number) => {
    return canSelectTimeSlot(time, activityId, latestSelection, earliestReachableSlot, isTimeDisabled(activityId, time))
  }

  // Use the custom hook for drag logic
  const { isDragging, isMultiSelect, isSelectMode, highlightedSlots, startDrag, handleFinishDrag, handleSlotMouseEnter } = useDragSelection(
    {
      activityId,
      timeSlots,
      isSlotEnabled,
      isTimeSelected,
      toggleTimeSelection,
    }
  )

  const getTooltipContent = (type: TransportMode, time: number) => {
    const travelTime = Math.round(earliestReachableSlot?.travelTimes?.[type] ?? 0)
    const departureTime = latestSelectionTime !== null ? latestSelectionTime : null
    const arrivalTime = departureTime !== null ? departureTime + travelTime : time

    if (departureTime !== null) {
      const { displayTime: formattedDepartureTime } = formatTimeWithDayIndicator(departureTime, formatTime)
      const { displayTime: formattedArrivalTime } = formatTimeWithDayIndicator(arrivalTime, formatTime)
      return `${formattedDepartureTime} → ${formattedArrivalTime} (${travelTime} min by ${type})`
    }
    const { displayTime: formattedTime } = formatTimeWithDayIndicator(time, formatTime)
    return `Arrival at ${formattedTime}`
  }

  const TransportIcon = ({ type, time }: { type: TransportMode; time: number }) => {
    const IconComponent = TRANSPORT_ICONS[type]

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <IconComponent className="w-3 h-3 text-muted-foreground" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={5} align="center" className="z-100">
          <p>{getTooltipContent(type, time)}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  // Check if the event has a location
  const hasLocation = eventHasLocation(event)

  if (!event) return null

  return (
    <Card
      className={cn('absolute z-20', !hasLocation && 'border-dashed border-2 bg-muted/30', isHovered && 'bg-primary/10')}
      style={{
        top: `${(startDateMinutes / slotDurationMinutes) * slotHeight + headerHeight + topOffset}px`,
        height: `${((endDateMinutes - startDateMinutes) / slotDurationMinutes) * slotHeight}px`,
        left: index === 0 ? '0' : `calc(${index} * ${columnWidth} + ${index} * ${columnGap}px)`,
        width: columnWidth,
        transition: 'box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out',
      }}
    >
      <div
        className="grid h-full"
        style={{
          gridTemplateRows: `repeat(${(endDateMinutes - startDateMinutes) / slotDurationMinutes}, ${slotHeight}px)`,
        }}
      >
        <TooltipProvider>
          {!hasLocation && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="absolute w-full top-0 right-0 bg-yellow-500/50 text-xs px-1 py-0.5 z-50 rounded-bl text-yellow-900 font-medium truncate"
                  aria-label="Activity has no location information"
                >
                  No location available
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={5} align="center" className="z-100">
                <p>No location available</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
        {timeSlots.map((time) => {
          const latestActivityId = latestSelection?.getActivityId()
          const isReachable = isTimeReachable(time, activityId, latestSelection, earliestReachableSlot?.slots ?? null)

          let disabledButton =
            isTimeDisabled(activityId, time) ||
            !isReachable ||
            shouldDisableForTravelTime(time, activityId, latestSelection, earliestReachableSlot)
          if (latestActivityId === activityId) {
            disabledButton = false
          }

          const isSelected = isTimeSelected(activityId, time)
          const isHighlighted = highlightedSlots.includes(time)

          const showFootIcon = showTransportIcon(time, TransportMode.FOOT, disabledButton, earliestReachableSlot, timeSlots)
          const showBikeIcon = showTransportIcon(time, TransportMode.BIKE, disabledButton, earliestReachableSlot, timeSlots)
          const showCarIcon = showTransportIcon(time, TransportMode.CAR, disabledButton, earliestReachableSlot, timeSlots)

          const { displayTime } = formatTimeWithDayIndicator(time, formatTime)
          const slotBorders = getSlotBorders(activityId, time)
          const borderWidth = '2px'
          const borderRadius = '0.5rem'

          return (
            <Button
              key={time}
              variant="ghost"
              style={{
                height: `${slotHeight}px`,
                borderWidth: `${slotBorders.topBorder ? borderWidth : '0'} ${slotBorders.rightBorder ? borderWidth : '0'} ${slotBorders.bottomBorder ? borderWidth : '0'} ${slotBorders.leftBorder ? borderWidth : '0'}`,
                borderRadius: `${slotBorders.roundedTop ? borderRadius : '0'} ${slotBorders.roundedTop ? borderRadius : '0'} ${slotBorders.roundedBottom ? borderRadius : '0'} ${slotBorders.roundedBottom ? borderRadius : '0'}`,
                backgroundColor: isHighlighted
                  ? isSelectMode
                    ? 'rgba(var(--primary-rgb), 0.3)'
                    : 'rgba(var(--destructive-rgb), 0.15)'
                  : undefined,
                transition: 'background-color 0.15s ease-in-out, opacity 0.15s ease-in-out',
                opacity: isHighlighted ? 0.9 : 1,
                position: 'relative',
                cursor: isDragging ? 'grabbing' : 'pointer',
              }}
              className={`w-full text-xs flex items-center justify-between p-0 rounded-none border-primary
                ${isSelected ? 'bg-primary/20 hover:bg-primary/30' : 'hover:bg-primary/10'}
                ${isHighlighted ? 'shadow-inner' : ''}
                ${disabledButton ? 'opacity-30 bg-gray-300/60 text-gray-400 border-gray-800 cursor-not-allowed hover:bg-gray-900/60' : ''}
                ${!hasLocation ? 'text-muted-foreground' : ''}
                slot-transition slot-hover-effect`}
              onClick={() => {}}
              onMouseDown={(e) => {
                // Only start drag with left click
                if (e.button === 0) {
                  startDrag(time, isSelected, e)
                }
              }}
              onMouseUp={() => {
                if (isDragging) {
                  handleFinishDrag()
                }
              }}
              onMouseEnter={() => handleSlotMouseEnter(time)}
              disabled={disabledButton}
            >
              <div className="flex-grow text-left pl-2">
                {showSlotTime && (
                  <span className="absolute left-2 -top-3">
                    <span className="inline-flex items-center rounded-full border border-muted bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground shadow-sm">
                      {displayTime}
                    </span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 pr-2">
                <TooltipProvider>
                  {showFootIcon && <TransportIcon type={TransportMode.FOOT} time={time} />}
                  {showBikeIcon && <TransportIcon type={TransportMode.BIKE} time={time} />}
                  {showCarIcon && <TransportIcon type={TransportMode.CAR} time={time} />}
                </TooltipProvider>
              </div>

              {/* Multi-selection mode indicator */}
              {isDragging && isMultiSelect && isHighlighted && (
                <div className="absolute top-0 right-0 bg-primary-foreground text-[8px] px-1 rounded-bl">Multi</div>
              )}
            </Button>
          )
        })}
      </div>
    </Card>
  )
}
