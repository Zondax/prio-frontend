import type { Activity, ActivitySlot } from '@prio-grpc/entities/proto/api/v1/activity_pb'
import { dateToTimestamp } from '@prio-grpc/utils'
import { endOfDay, startOfDay } from 'date-fns'
import { minutesInHour } from 'date-fns/constants'
import { useEffect, useMemo } from 'react'

import { createActivityRequest } from '../../api/activity'
import { getMinutesFromTimestamp } from '../../utils/time'
import type { TravelTime } from './transportUtils'

// 24 hours * 60 minutes = 1440 minutes in a day
const minutesInDay = 1440

/**
 * Configuration object for timeline display and calculations
 */
export interface TimelineConfiguration {
  /** Maximum available time in minutes for display in the timeline */
  maxTimeInMinutes: number
  /** Number of slots to display for the whole day */
  slotsPerDay: number
  /** Array of all time slots in minutes from the start of day */
  timeSlots: number[]
}

/**
 * Hook to calculate time configuration for the timeline
 * Handles special cases like activities that cross midnight
 */
export function useTimelineConfiguration(activities: Activity[], slotDurationMinutes: number, timezone?: string) {
  const MINUTES_IN_HOUR = minutesInHour
  const MINUTES_IN_DAY = minutesInDay
  const EARLY_MORNING_CUTOFF_HOUR = 5 // 5 AM
  const EARLY_MORNING_CUTOFF_MINUTES = EARLY_MORNING_CUTOFF_HOUR * MINUTES_IN_HOUR

  // Check if there are activities that end after midnight but before early morning cutoff
  const maxTimeInMinutes = useMemo(() => {
    let maxTime = MINUTES_IN_DAY // Default to 24 hours (midnight)

    // Look for activities that cross midnight
    for (const activity of activities) {
      if (activity.getEvent()?.getDate()) {
        const startMin = getMinutesFromTimestamp(activity.getEvent()?.getDate()?.getStart()?.getSeconds() ?? 0, timezone)
        const endMin = getMinutesFromTimestamp(activity.getEvent()?.getDate()?.getEnd()?.getSeconds() ?? 0, timezone)

        // If end time is less than start time, it crosses midnight
        if (endMin < startMin) {
          // If end time is before early morning cutoff
          if (endMin <= EARLY_MORNING_CUTOFF_MINUTES) {
            // Set max time to end time + 24 hours
            maxTime = Math.max(maxTime, endMin + MINUTES_IN_DAY)
          }
        }
      }
    }

    // Cap at early morning cutoff past midnight
    return Math.min(maxTime, MINUTES_IN_DAY + EARLY_MORNING_CUTOFF_MINUTES)
  }, [activities, timezone, MINUTES_IN_DAY, EARLY_MORNING_CUTOFF_MINUTES])

  const slotsPerDay = Math.ceil(maxTimeInMinutes / slotDurationMinutes)

  const timeSlots = useMemo(() => {
    return Array.from({ length: slotsPerDay }, (_, i) => i * slotDurationMinutes)
  }, [slotsPerDay, slotDurationMinutes])

  return {
    maxTimeInMinutes,
    slotsPerDay,
    timeSlots,
  }
}

/**
 * Hook to extract all activity slots from a list of activities
 * @param activities Array of activities to extract slots from
 * @returns Array of activity slots from all provided activities
 */
export function useActivitySlots(activities: Activity[]) {
  return useMemo(() => {
    const slots: ActivitySlot[] = []
    for (const activity of activities) {
      if (activity.getActivitySlotsList()?.length > 0) {
        slots.push(...activity.getActivitySlotsList())
      }
    }
    return slots
  }, [activities])
}

/**
 * Hook to calculate travel times between activity slots
 */
export function useTravelTimes(activitySlots: ActivitySlot[]) {
  return useMemo(() => {
    if (activitySlots.length < 2) return []

    // Sort activity slots chronologically
    const sortedSlots = [...activitySlots].sort((a, b) => (a.getStartTime()?.getSeconds() ?? 0) - (b.getStartTime()?.getSeconds() ?? 0))

    // Create travel time blocks between consecutive windows from different activities
    const travels: TravelTime[] = []
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const current = sortedSlots[i]
      const next = sortedSlots[i + 1]

      // Only create travel time if slots are from different activities
      if (current.getActivityId() !== next.getActivityId()) {
        travels.push({
          from: current,
          to: next,
        })
      }
    }

    return travels
  }, [activitySlots])
}

interface UseActivityDateFilterProps {
  selectedDate: Date
  setInput: (input: any) => void
}

/**
 * Hook to apply date filtering to activities
 * This can be shared between different components that use the activity store
 */

/**
 * Hook to apply date filtering to activities
 * This can be shared between different components that use the activity store
 */
export function useActivityDateFilter({ selectedDate, setInput }: UseActivityDateFilterProps) {
  useEffect(() => {
    if (selectedDate) {
      const dateFilterStartDate = dateToTimestamp(startOfDay(selectedDate))
      const dateFilterEndDate = dateToTimestamp(endOfDay(selectedDate))

      const request = createActivityRequest({
        dateFilter: {
          startDate: dateFilterStartDate,
          endDate: dateFilterEndDate,
        },
      })

      setInput(request)
    }
  }, [selectedDate, setInput])
}
