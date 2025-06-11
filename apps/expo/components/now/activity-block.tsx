import { type ActivitySlot, type Event, type RouteMatrix, TransportMode, getMinutesFromTimestamp } from '@mono-state'
import {
  type EarliestReachableSlot,
  type SlotBorders,
  canSelectTimeSlot,
  formatTimeWithDayIndicator,
  isTimeReachable,
} from '@mono-state/feature/activity'
import { shouldDisableForTravelTime, showTransportIcon } from '@mono-state/feature/activity/transportUtils'
import { eventHasLocation } from '@mono-state/feature/events/utils'
import type React from 'react'
import { useCallback, useState } from 'react'
import { Pressable, Text, View } from 'react-native'

// We'll need to implement these components or import them from the appropriate location
import { TRANSPORT_ICONS } from '@/lib/scheduler'

import { Button } from '../ui/button'
import { Card } from '../ui/card'
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
}

/**
 * Props for the time slot selection hook
 */
interface TimeSlotSelectionProps {
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
 * Hook to manage time slot selection interactions
 * Simplified for mobile to only handle tap/click interactions
 */
function useTimeSlotSelection({ activityId, timeSlots, isSlotEnabled, isTimeSelected, toggleTimeSelection }: TimeSlotSelectionProps) {
  // UI state for highlighting the currently touched slot
  const [highlightedSlot, setHighlightedSlot] = useState<number | null>(null)

  // Handle slot selection
  const handleSlotPress = useCallback(
    (time: number) => {
      if (!isSlotEnabled(time)) return

      // Simply toggle the selection state of the clicked time slot
      toggleTimeSelection(activityId, time)
      setHighlightedSlot(null)
    },
    [activityId, isSlotEnabled, toggleTimeSelection]
  )
  return {
    highlightedSlot,
    handleSlotPress,
    isSelected: (time: number) => isTimeSelected(activityId, time),
  }
}

export const ActivityBlock: React.FC<ActivityBlockProps> = ({ event, activityId, index, timeHandlers, travelInfo, localTimezone }) => {
  // Get layout from context
  const { slotHeight, slotDurationMinutes, columnWidth, headerHeight, topOffset, showSlotTime, columnGap, timeColumnWidth } =
    useTimelineLayout()

  const { formatTime, isTimeDisabled, toggleTimeSelection, getSlotBorders, isTimeSelected } = timeHandlers
  const { earliestReachableSlot, latestSelectionTime, latestSelection } = travelInfo

  const startDateMinutes = getMinutesFromTimestamp(event.getDate()?.getStart()?.getSeconds() ?? 0, localTimezone)
  let endDateMinutes = getMinutesFromTimestamp(event.getDate()?.getEnd()?.getSeconds() ?? 0, localTimezone)

  // Take into account events that cross midnight in UTC
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

  // Use the simplified time slot selection hook
  const { highlightedSlot, handleSlotPress, isSelected } = useTimeSlotSelection({
    activityId,
    timeSlots,
    isSlotEnabled,
    isTimeSelected,
    toggleTimeSelection,
  })

  if (!event) return null

  // Check if the event has a location
  const hasLocation = eventHasLocation(event)

  // Function to get travel info text for transport modes
  const getTravelInfoText = (type: TransportMode, time: number) => {
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
    const [showInfo, setShowInfo] = useState(false)

    return (
      <Pressable onPress={() => setShowInfo(!showInfo)} className="relative">
        <IconComponent className="text-muted-foreground" size={16} />
        {showInfo && (
          <View className="absolute bottom-5 right-0 bg-popover p-2 rounded-md shadow-md z-50 min-w-[150px]">
            <Text className="text-xs text-foreground">{getTravelInfoText(type, time)}</Text>
            <View className="absolute bottom-[-6px] right-1 w-3 h-3 bg-popover rotate-45" />
          </View>
        )}
      </Pressable>
    )
  }

  return (
    <Card
      className={`absolute z-20 ${!hasLocation ? 'border-dashed border-2 bg-muted/30' : 'bg-background/60'}`}
      style={{
        top: (startDateMinutes / slotDurationMinutes) * slotHeight + headerHeight + topOffset,
        height: ((endDateMinutes - startDateMinutes) / slotDurationMinutes) * slotHeight,
        left: index === 0 ? 0 : index * (columnWidth as number) + index * columnGap,
        width: Number(columnWidth),
      }}
    >
      <View className="h-full">
        {!hasLocation && (
          <View
            className="absolute top-0 right-0 bg-yellow-500/50 px-1 py-0.5 z-50 rounded-bl"
            aria-label="Activity has no location information"
          >
            <Text className="text-xs text-yellow-900 font-medium">No location available</Text>
          </View>
        )}
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

          const slotSelected = isSelected(time)
          const isHighlighted = highlightedSlot === time

          const showFootIcon = showTransportIcon(time, TransportMode.FOOT, disabledButton, earliestReachableSlot, timeSlots)
          const showBikeIcon = showTransportIcon(time, TransportMode.BIKE, disabledButton, earliestReachableSlot, timeSlots)
          const showCarIcon = showTransportIcon(time, TransportMode.CAR, disabledButton, earliestReachableSlot, timeSlots)

          const { displayTime } = formatTimeWithDayIndicator(time, formatTime)
          const slotBorders = getSlotBorders(activityId, time)
          return (
            <Button
              key={time}
              variant="ghost"
              style={{
                height: slotHeight,
                borderTopWidth: slotBorders.topBorder ? 2 : 0,
                borderRightWidth: slotBorders.rightBorder ? 2 : 0,
                borderBottomWidth: slotBorders.bottomBorder ? 2 : 0,
                borderLeftWidth: slotBorders.leftBorder ? 2 : 0,
                borderTopLeftRadius: slotBorders.roundedTop ? 8 : 0,
                borderTopRightRadius: slotBorders.roundedTop ? 8 : 0,
                borderBottomLeftRadius: slotBorders.roundedBottom ? 8 : 0,
                borderBottomRightRadius: slotBorders.roundedBottom ? 8 : 0,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 0,
                opacity: disabledButton ? 0.3 : 1,
              }}
              className={`
                ${isHighlighted ? 'border-red-500 bg-primary/30 shadow-inner' : 'border-blue-500'}
                ${slotSelected && !isHighlighted ? 'bg-primary/20 active:bg-primary/30' : 'active:bg-primary/10'}
                ${disabledButton ? 'bg-gray-900/60 text-gray-400 border-gray-800' : ''}
                ${!hasLocation ? 'text-muted-foreground' : ''}
              `}
              onPress={() => handleSlotPress(time)}
              disabled={disabledButton}
            >
              <View className="flex-1 items-start">
                {showSlotTime && (
                  <View className="absolute left-[-12px] top-[-26px]">
                    <View className="flex-row items-center rounded-full border border-muted bg-background/80 px-1.5 py-0.5">
                      <Text className="text-[10px] font-medium text-muted-foreground">{displayTime}</Text>
                    </View>
                  </View>
                )}
              </View>
              <View className="flex-row items-center gap-1 pr-2">
                {showFootIcon && <TransportIcon type={TransportMode.FOOT} time={time} />}
                {showBikeIcon && <TransportIcon type={TransportMode.BIKE} time={time} />}
                {showCarIcon && <TransportIcon type={TransportMode.CAR} time={time} />}
              </View>
            </Button>
          )
        })}
      </View>
    </Card>
  )
}
