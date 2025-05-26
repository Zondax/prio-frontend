import type { Activity as ActivityType } from '@prio-grpc/entities/proto/api/v1/activity_pb'

import { getMinutesFromTimestamp } from '../../utils/time'

/**
 * Gets the earliest activity by start time from a list of activities
 *
 * @param activities Array of activities to search through
 * @param localTimezone Optional timezone for timestamp conversion
 * @param currentTimeInMinutes Current time in minutes to find current or next activity
 * @returns Object containing the selected activity and its start time
 */
export const getEarliestActivity = (
  activities: ActivityType[],
  localTimezone?: string,
  currentTimeInMinutes?: number | null
): { activity: ActivityType | null; startTime: number | null } => {
  if (!activities.length) {
    return { activity: null, startTime: null }
  }

  let earliestActivity: ActivityType | null = null
  let earliestActivityTime: number | null = null

  let currentActivity: ActivityType | null = null
  let currentActivityTime: number | null = null

  let nextActivity: ActivityType | null = null
  let nextActivityTime: number | null = null

  for (const activity of activities) {
    const event = activity.getEvent()
    if (!event) continue

    const startTime = event.getDate()?.getStart()?.getSeconds() ?? 0
    const startTimeMinutes = getMinutesFromTimestamp(startTime, localTimezone)

    const endTime = event.getDate()?.getEnd()?.getSeconds() ?? 0
    const endTimeMinutes = getMinutesFromTimestamp(endTime, localTimezone)

    // Track earliest activity
    if (earliestActivityTime === null || startTimeMinutes < earliestActivityTime) {
      earliestActivityTime = startTimeMinutes
      earliestActivity = activity
    }

    if (currentTimeInMinutes !== null && currentTimeInMinutes !== undefined) {
      // Track current activity (if we're within its time range)
      if (startTimeMinutes <= currentTimeInMinutes && endTimeMinutes >= currentTimeInMinutes) {
        currentActivity = activity
        currentActivityTime = startTimeMinutes
      }

      // Track next upcoming activity
      if (startTimeMinutes > currentTimeInMinutes && (nextActivityTime === null || startTimeMinutes < nextActivityTime)) {
        nextActivityTime = startTimeMinutes
        nextActivity = activity
      }
    }
  }

  // If current time is provided, prioritize current activity, then next activity
  if (currentTimeInMinutes !== null && currentTimeInMinutes !== undefined) {
    if (currentActivity) {
      return {
        activity: currentActivity,
        startTime: currentActivityTime,
      }
    }

    if (nextActivity) {
      return {
        activity: nextActivity,
        startTime: nextActivityTime,
      }
    }
  }

  // Default to earliest activity
  return {
    activity: earliestActivity,
    startTime: earliestActivityTime,
  }
}
