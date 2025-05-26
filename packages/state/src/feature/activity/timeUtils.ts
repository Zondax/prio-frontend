import { startOfDay } from 'date-fns'

import type { ActivitySlot } from '../../stores'
import { formatTimeWithTimezone, getMinutesFromTimestamp } from '../../utils/time'

/**
 * Time formatting result with day indicator
 */
export interface TimeWithDayIndicator {
  displayTime: string
  isNextDay: boolean
}

/**
 * Formats a time value with indication for next day times
 * @param time Time in minutes from start of day (in UTC)
 * @param formatTime Function to format minutes to time string
 * @param timezone Optional IANA timezone string
 * @returns Formatted time string with next day indicator if applicable
 */
export function formatTimeWithDayIndicator(time: number, formatTime: (minutes: number) => string): TimeWithDayIndicator {
  const isNextDay = time >= 24 * 60
  const adjustedTime = isNextDay ? time - 24 * 60 : time

  return {
    displayTime: formatTime(adjustedTime),
    isNextDay,
  }
}

/**
 * Find an existing slot by activity ID and time
 */
export const findExistingSlot = (slots: ActivitySlot[], activityId: string, time: number, timezone?: string): ActivitySlot | undefined => {
  // Calculate the start time seconds for the given time
  const todayStartSeconds = startOfDay(new Date()).getTime() / 1000
  const startTimeSeconds = todayStartSeconds + time * 60

  return slots.find((s) => {
    if (s.getActivityId() !== activityId) return false

    // If we have a timezone, compare based on the time in minutes from midnight
    if (timezone) {
      const slotTime = s.getStartTime()?.getSeconds() || 0
      const slotMinutesFromMidnight = getMinutesFromTimestamp(slotTime, timezone)
      return slotMinutesFromMidnight === time
    }

    // Otherwise use direct seconds comparison (UTC)
    return s.getStartTime()?.getSeconds() === startTimeSeconds
  })
}

/**
 * Gets the timezone display for a given timezone
 *
 * @param timezone - IANA timezone string (e.g., 'America/New_York')
 * @returns The timezone abbreviation (e.g., 'EST')
 */
export function getTimezoneDisplay(timezone?: string): string {
  if (!timezone) return ''

  const formattedTime = formatTimeWithTimezone(new Date(), timezone)
  const timezonePart = formattedTime.split(' ').pop() || ''
  return timezonePart.slice(1, -1) || ''
}

/**
 * Checks if an event is happening soon (within the specified time window)
 *
 * @param eventDate - The date of the event
 * @param timeWindowMs - Time window in milliseconds (default: 1 hour)
 * @returns Boolean indicating if the event is happening soon
 */
export function isActivityHappeningSoon(eventDate?: Date, timeWindowMs = 3600000): boolean {
  if (!eventDate) return false

  const now = new Date().getTime()
  const eventTime = eventDate.getTime()

  return eventTime - now <= timeWindowMs && eventTime > now
}

/**
 * Gets the current time in minutes
 * @returns The current time in minutes
 */
export const getCurrentTimeInMinutes = () => {
  const now = new Date()
  const minutes = now.getHours() * 60 + now.getMinutes()
  return minutes
}
