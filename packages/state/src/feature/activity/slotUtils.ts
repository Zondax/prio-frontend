import { Activity, Timestamp } from '@prio-grpc'
import { startOfDay } from 'date-fns'

import { getMinutesFromTimestamp, minutesToSecondsInTimezone } from '../../utils/time'
import type { EarliestReachableSlot } from './transportUtils'

/**
 * Configuration for slot border appearance
 */
export interface SlotBorders {
  topBorder: boolean
  bottomBorder: boolean
  leftBorder: boolean
  rightBorder: boolean
  roundedTop: boolean
  roundedBottom: boolean
}

/**
 * Checks if a time slot is reachable based on travel time from the latest selected slot
 */
export const isTimeReachable = (
  time: number,
  activityId: string,
  latestWindow: Activity.ActivitySlot | null,
  earliestReachableSlot: { foot: number; bike: number; car: number } | null
): boolean => {
  // If there's no latest window or it's from the same activity, all slots are reachable
  if (!latestWindow || latestWindow.getActivityId() === activityId) {
    return true
  }

  // If we can't calculate the earliest reachable slot, assume it's reachable
  if (!earliestReachableSlot) {
    return true
  }

  // Get the time of the slot we're checking
  const slotTimeOfDay = time % (24 * 60)

  // Get the time of the latest window end
  const latestWindowEndTime = getMinutesFromTimestamp(latestWindow.getEndTime()?.getSeconds() ?? 0)
  const latestWindowEndTimeOfDay = latestWindowEndTime % (24 * 60)

  // If this slot is chronologically before the latest window ends,
  // it should be selectable (it's in the past relative to the latest selection)
  if (slotTimeOfDay < latestWindowEndTimeOfDay) {
    return true
  }

  // Check if at least one transport mode can reach this slot
  const hasTransport = Object.values(earliestReachableSlot).some(
    (slot) => slot !== undefined && slot !== null && typeof slot === 'number' && !Number.isNaN(slot) && slot <= time
  )

  if (!hasTransport) {
    return false
  }

  // For activities after the latest selection, we need to verify travel time
  const earliestArrival = Math.min(earliestReachableSlot.foot, earliestReachableSlot.bike, earliestReachableSlot.car)

  // If this slot is at the same time as the end of the latest window,
  // it should be selectable (not affected by travel time)
  if (time === latestWindowEndTime) {
    return true
  }

  // For slots after the latest selection, verify if there's enough travel time available
  return time >= earliestArrival
}

/**
 * Checks if a specific time is selected within an activity's windows
 */
export const isTimeSelected = (windows: Activity.ActivitySlot[], activityId: string, time: number, timezone?: string): boolean => {
  return windows.some((w) => {
    if (w.getActivityId() !== activityId) return false

    const startSeconds = w.getStartTime()?.getSeconds() ?? 0
    const endSeconds = w.getEndTime()?.getSeconds() ?? 0

    // Get the minutes from midnight in the correct timezone
    const startMinutes = getMinutesFromTimestamp(startSeconds, timezone)
    const endMinutes = getMinutesFromTimestamp(endSeconds, timezone)

    return startMinutes <= time && endMinutes > time
  })
}

/**
 * Checks if a time slot should be disabled because it overlaps with a slot from another activity
 */
export const isTimeDisabled = (windows: Activity.ActivitySlot[], activityId: string, time: number, timezone?: string): boolean => {
  return windows.some((w) => {
    if (w.getActivityId() === activityId) return false

    const startSeconds = w.getStartTime()?.getSeconds() ?? 0
    const endSeconds = w.getEndTime()?.getSeconds() ?? 0

    // Get the minutes from midnight in the correct timezone
    const startMinutes = getMinutesFromTimestamp(startSeconds, timezone)
    const endMinutes = getMinutesFromTimestamp(endSeconds, timezone)

    // Only disable this slot if it's from another activity AND it overlaps with the time
    return startMinutes <= time && endMinutes > time
  })
}

/**
 * Determines the border styling for a slot based on its selection state
 */
export const getSlotBorders = (
  windows: Activity.ActivitySlot[],
  activityId: string,
  time: number,
  slotDurationMinutes: number,
  timezone?: string
): SlotBorders => {
  if (!isTimeSelected(windows, activityId, time, timezone)) {
    return {
      topBorder: false,
      bottomBorder: false,
      leftBorder: false,
      rightBorder: false,
      roundedTop: false,
      roundedBottom: false,
    }
  }

  const prevSelected = isTimeSelected(windows, activityId, time - slotDurationMinutes, timezone)
  const nextSelected = isTimeSelected(windows, activityId, time + slotDurationMinutes, timezone)

  return {
    topBorder: !prevSelected,
    bottomBorder: !nextSelected,
    leftBorder: true,
    rightBorder: true,
    roundedTop: !prevSelected,
    roundedBottom: !nextSelected,
  }
}

/**
 * Prepares data for creating a new activity slot
 */
export const prepareSlotCreation = (
  activityId: string,
  time: number,
  slotDurationMinutes: number,
  timezone?: string
): {
  slotData: Activity.ActivitySlot
} => {
  // Create time values for the new slot
  const todayStartSeconds = startOfDay(new Date()).getTime() / 1000
  let startTimeSeconds = todayStartSeconds + time * 60
  let endTimeSeconds = todayStartSeconds + (time + slotDurationMinutes) * 60

  if (timezone) {
    // If we have a timezone, convert the time to seconds since epoch in the given timezone
    startTimeSeconds = minutesToSecondsInTimezone(time, timezone)
    endTimeSeconds = minutesToSecondsInTimezone(time + slotDurationMinutes, timezone)
  }

  // Create the slot for the gRPC call
  const createSlot = new Activity.ActivitySlot()
  createSlot.setActivityId(activityId)

  const startTime = new Timestamp()
  startTime.setSeconds(startTimeSeconds)
  startTime.setNanos(0)
  createSlot.setStartTime(startTime)

  const endTime = new Timestamp()
  endTime.setSeconds(endTimeSeconds)
  endTime.setNanos(0)
  createSlot.setEndTime(endTime)

  return { slotData: createSlot }
}

/**
 * Prepares data for deleting an existing activity slot
 */
export const prepareSlotDeletion = (slot: Activity.ActivitySlot): Activity.ActivitySlot => {
  const deleteSlot = new Activity.ActivitySlot()
  deleteSlot.setActivityId(slot.getActivityId())
  deleteSlot.setStartTime(slot.getStartTime())
  deleteSlot.setEndTime(slot.getEndTime())
  return deleteSlot
}

/**
 * Determines if a time slot is enabled for selection based on reachability
 *
 * @param time The time to check (in minutes from start of day)
 * @param activityId The ID of the activity being checked
 * @param latestSelection The most recently selected activity slot
 * @param earliestReachableSlots The earliest reachable slots for each transport mode
 * @param isTimeDisabled Whether the time slot is disabled
 * @returns True if the slot is enabled for selection, false otherwise
 */
export function canSelectTimeSlot(
  time: number,
  activityId: string,
  latestSelection: Activity.ActivitySlot | null,
  earliestReachableSlots: EarliestReachableSlot | null,
  isTimeDisabled: boolean
): boolean {
  const latestActivityId = latestSelection?.getActivityId()
  const isReachable = isTimeReachable(time, activityId, latestSelection, earliestReachableSlots?.slots ?? null)
  const disabled = isTimeDisabled || !isReachable

  // Allow selection if this is the most recent activity
  return !disabled || latestActivityId === activityId
}
