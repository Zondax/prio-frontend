/**
 * Time Utilities Module
 *
 * This module provides utilities for working with dates, times, and timezones. It handles:
 * - Timezone conversions (using both IANA timezone identifiers and numeric GMT offsets)
 * - Date and time formatting with proper timezone information
 * - Conversion between timestamps and minute-of-day representations
 *
 * The functions in this module prioritize predictable behavior across different host environments
 * by using UTC-based calculations when possible and being explicit about timezone handling.
 *
 * IMPORTANT IMPLEMENTATION NOTES:
 *
 * 1. NUMERIC OFFSET HANDLING:
 *    Numeric offsets (e.g., '+2', '-7') use a direct arithmetic approach that may not match
 *    standard timezone conversion behavior. The offset is applied directly to UTC time, which
 *    means that for positive offsets, times appear later, and for negative offsets, times
 *    appear earlier. See the documentation for adjustDateByOffset for details.
 *
 * 2. IANA TIMEZONE HANDLING:
 *    IANA timezones (e.g., 'America/New_York', 'Europe/London') use @date-fns/tz to handle
 *    proper timezone conversions, which correctly accounts for DST and historical timezone
 *    changes. However, there may be inconsistencies between numeric offset handling and IANA
 *    timezone handling for the same geographic location.
 *
 * 3. FRACTIONAL TIMEZONE OFFSETS:
 *    Fractional hour offsets (like India's GMT+5:30) might not be calculated correctly in all
 *    situations, particularly for minute-of-day calculations.
 *
 */
import { TZDate } from '@date-fns/tz'
import { addMinutes, format, fromUnixTime } from 'date-fns'

/**
 * Adjusts a date based on a timezone offset string
 *
 * This function takes a Date object and a string representing a timezone offset in hours
 * (e.g., '-7', '+2') and returns a new Date object adjusted to that timezone offset.
 *
 * IMPORTANT IMPLEMENTATION DETAIL:
 * The adjustment works by ADDING the offset to the UTC hours, not by converting to local time.
 * This means for a positive offset (e.g., '+2'), it shifts the time forward (later),
 * and for a negative offset (e.g., '-7'), it shifts the time backward (earlier), when compared
 * to the original UTC time.
 *
 * This implementation detail affects the intended use cases of this function:
 * - When used for display formatting (showing a time in a given timezone), the function
 *   produces results that may appear counterintuitive when comparing to standard timezone conversions.
 * - When used for calculations like minutes-since-midnight in a timezone, the function
 *   works as expected when the offset is properly interpreted.
 *
 * @param date - The date object to adjust
 * @param offsetStr - The timezone offset as string (e.g., '-7', '+2')
 * @returns A new Date object adjusted to the specified timezone offset
 *
 * @example
 * // Adjust a UTC date to GMT-7 (Pacific Standard Time)
 * const utcDate = new Date('2023-10-10T10:00:00Z');
 * // This creates a date that represents 3:00 AM local time (10:00 - 7:00)
 * const pstDate = adjustDateByOffset(utcDate, '-7');
 *
 * @example
 * // Adjust a UTC date to GMT+2 (Central European Summer Time)
 * const utcDate = new Date('2023-10-10T10:00:00Z');
 * // This creates a date that represents 12:00 PM local time (10:00 + 2:00)
 * const cestDate = adjustDateByOffset(utcDate, '+2');
 */
export function adjustDateByOffset(date: Date, offsetStr: string): Date {
  const parsedOffset = Number.parseFloat(offsetStr)

  // Get hours and fractional part separately
  const offsetHours = Math.floor(parsedOffset)
  const offsetMinutes = Math.round((parsedOffset - offsetHours) * 60)

  // Get the local timezone offset in hours
  const localOffsetHours = date.getTimezoneOffset() / -60

  // Calculate the target timezone hour (local time + difference between target and local)
  const targetHour = date.getHours() + offsetHours - localOffsetHours
  const targetMinute = date.getMinutes() + offsetMinutes

  // Create new date object and set to the computed hour and minute
  const newDate = new Date(date)
  newDate.setHours(targetHour)
  newDate.setMinutes(targetMinute)

  return newDate
}

/**
 * Checks if a string is a numeric timezone offset
 *
 * Valid formats include: '+2', '-7', '5', etc.
 * Invalid formats: 'UTC', 'America/New_York', 'Z', etc.
 *
 * @param timezone - The string to check
 * @returns `true` if the string is a valid numeric offset, `false` otherwise
 *
 * @example
 * isNumericOffset('+2') // returns true
 * isNumericOffset('-7') // returns true
 * isNumericOffset('5') // returns true
 * isNumericOffset('UTC') // returns false
 */
function isNumericOffset(timezone: string): boolean {
  const parsedOffset = Number.parseFloat(timezone)
  return !Number.isNaN(parsedOffset)
}

/**
 * Format a date object to a localized time string with timezone information
 *
 * This function formats a date to a time string (e.g., "10:30 AM (GMT-4)") with proper
 * timezone annotation. It handles three scenarios:
 * 1. No timezone provided - uses GMT/UTC
 * 2. Numeric offset provided (e.g., "+2", "-7") - adjusts time accordingly
 * 3. IANA timezone provided (e.g., "America/New_York") - uses that timezone
 *
 * @param date - The date object to format
 * @param localTimeZone - The timezone as string (IANA timezone ID or numeric offset) or undefined for GMT
 * @returns The formatted time string with timezone annotation
 *
 * @example
 * // Format as GMT time (no timezone provided)
 * formatTimeWithTimezone(new Date('2023-10-10T10:30:00Z'))
 * // Returns: "10:30 AM (GMT)"
 *
 * @example
 * // Format with numeric timezone offset
 * formatTimeWithTimezone(new Date('2023-10-10T10:30:00Z'), '-4')
 * // Returns: "6:30 AM (GMT-4)"
 *
 * @example
 * // Format with IANA timezone
 * formatTimeWithTimezone(new Date('2023-10-10T10:30:00Z'), 'America/New_York')
 * // Returns: "6:30 AM (GMT-4)" (assuming EDT is in effect)
 */
export function formatTimeWithTimezone(date: Date, localTimeZone?: string): string {
  if (!localTimeZone) {
    // When no timezone is provided, use GMT/UTC
    const gmtDate = new TZDate(date, 'UTC')
    const gmtTimeString = format(gmtDate, 'p')
    return `${gmtTimeString} (GMT)`
  }

  if (isNumericOffset(localTimeZone)) {
    const parsedOffset = Number.parseFloat(localTimeZone)
    const offsetString = `GMT${parsedOffset >= 0 ? '+' : ''}${parsedOffset}`

    // Calculate time with offset
    const adjustedDate = adjustDateByOffset(date, localTimeZone)
    const localTimeString = format(adjustedDate, 'p')

    return `${localTimeString} (${offsetString})`
  }

  // Handle IANA timezone
  const tzDate = new TZDate(date, localTimeZone)

  // Get the GMT offset from the IANA time zone
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: localTimeZone,
    timeZoneName: 'shortOffset',
  })
  const timeZoneParts = formatter.formatToParts(date)
  const timeZonePart = timeZoneParts.find((part) => part.type === 'timeZoneName')
  const offsetString = timeZonePart ? timeZonePart.value : ''

  // Format the time in the specified time zone
  const localTimeString = format(tzDate, 'p')
  return `${localTimeString} (${offsetString})`
}

/**
 * Format a date object to a localized date string with timezone consideration
 *
 * This function formats a date to a date string (e.g., "10/10/2023") considering the
 * provided timezone. This is important because the calendar date might be different
 * in different timezones (e.g., it might already be the next day in some locations).
 *
 * @param date - The date object to format
 * @param localTimeZone - Optional timezone (IANA timezone ID or numeric offset)
 * @returns The formatted date string (MM/DD/YYYY format)
 *
 * @example
 * // Format date in default timezone (UTC)
 * formatDateWithTimezone(new Date('2023-10-10T23:30:00Z'))
 * // Returns: "10/10/2023"
 *
 * @example
 * // Format date considering timezone offset
 * formatDateWithTimezone(new Date('2023-10-10T23:30:00Z'), '+2')
 * // Returns: "10/11/2023" (because in GMT+2, it's already the next day)
 *
 * @example
 * // Format with IANA timezone
 * formatDateWithTimezone(new Date('2023-10-10T23:30:00Z'), 'Asia/Tokyo')
 * // Returns: "10/11/2023" (because in Tokyo, it's already the next day)
 */
export function formatDateWithTimezone(date: Date, localTimeZone?: string): string {
  if (!localTimeZone) {
    return format(date, 'P')
  }

  if (isNumericOffset(localTimeZone)) {
    // For other cases, use the adjustDateByOffset function
    const adjustedDate = adjustDateByOffset(date, localTimeZone)
    return format(adjustedDate, 'P')
  }

  // Fall back to IANA timezone
  const tzDate = new TZDate(date, localTimeZone)
  return format(tzDate, 'P')
}

/**
 * Converts a Unix timestamp to minutes since midnight (0-1439) in the specified timezone.
 *
 * This function takes a Unix timestamp (seconds since Unix epoch) and converts it to the
 * number of minutes that have passed since midnight (0-1439) in the specified timezone.
 * This is useful for time-of-day calculations that need to be timezone-aware.

 * @param seconds - Unix timestamp in seconds
 * @param timezone - Optional timezone string (numeric offset or IANA timezone)
 * @returns Number of minutes since midnight (0-1439) in the specified timezone
 *
 * @example
 * // Get minutes since midnight for 10:30 AM UTC
 * // 1696934400 corresponds to 2023-10-10T10:30:00Z
 * getMinutesFromTimestamp(1696934400);
 * // Returns 630 (10 hours and 30 minutes = 630 minutes since midnight)
 *
 * @example
 * // Get minutes since midnight in GMT+2 timezone
 * // 1696934400 corresponds to 2023-10-10T10:30:00Z, which is 12:30 PM in GMT+2
 * getMinutesFromTimestamp(1696934400, '+2');
 * // Returns 750 (12 hours and 30 minutes = 750 minutes since midnight)
 */
export const getMinutesFromTimestamp = (seconds: number, timezone?: string): number => {
  // Create the date from timestamp and ensure it uses UTC
  const date = fromUnixTime(seconds)

  // When no timezone provided, always use UTC
  if (!timezone) {
    // Use UTC methods to get hours and minutes to avoid local timezone influence
    const utcHours = date.getUTCHours()
    const utcMinutes = date.getUTCMinutes()
    return utcHours * 60 + utcMinutes
  }

  const adjustedDate = isNumericOffset(timezone) ? adjustDateByOffset(date, timezone) : new TZDate(date, timezone)

  return getMinutesFromDate(adjustedDate)
}

/**
 * Helper function to convert a Date object to minutes since midnight (0-1439)
 *
 * This function takes a Date object and calculates how many minutes have passed
 * since midnight in the timezone represented by the Date object.
 *
 * @param date - The Date object to convert (assumed to be already adjusted for timezone)
 * @returns Number of minutes since midnight (0-1439)
 *
 * @example
 * // Date representing 10:30 AM
 * const date = new Date('2023-10-10T10:30:00Z');
 * getMinutesFromDate(date);
 * // Returns 630 (10 hours and 30 minutes = 630 minutes)
 */
export const getMinutesFromDate = (date: Date): number => {
  // Use UTC methods to ensure we're getting the right time in the target timezone
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  return hours * 60 + minutes
}

/**
 * Format minutes from start of day to 24-hour time format (HH:mm)
 *
 * This function takes a number of minutes since midnight (0-1439) and
 * formats it as a 24-hour time string (HH:mm).
 *
 * @param minutes - Minutes from start of day (0-1439)
 * @returns Time string in 24-hour format (HH:mm)
 *
 * @example
 * format24Hourtime(630);  // Returns "10:30"
 * format24Hourtime(780);  // Returns "13:00"
 * format24Hourtime(0);    // Returns "00:00"
 * format24Hourtime(1439); // Returns "23:59"
 */
export const format24Hourtime = (minutes: number) => {
  // Format the time considering overflow after midnight
  const date = new Date()
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0)
  return format(date, 'HH:mm')
}

/**
 * Adjusts a date for a numeric timezone offset
 *
 * This function takes a base date, a numeric timezone offset, and a number of minutes since midnight.
 * It returns a new date object that represents the same time in the specified timezone.
 *
 * @param baseDate - The base date to adjust
 * @param offset - The numeric timezone offset (e.g., -7 for GMT-7)
 * @param minutesSinceMidnight - The number of minutes since midnight
 * @returns A new Date object representing the same time in the specified timezone
 */
export const adjustForNumericOffset = (baseDate: Date, offset: number, minutesSinceMidnight: number): Date => {
  const offsetMillis = -offset * 60 * 60 * 1000
  return new Date(baseDate.getTime() + offsetMillis + minutesSinceMidnight * 60 * 1000)
}

/**
 * Converts minutes since midnight to a Unix timestamp in the specified timezone
 *
 * This function takes a number of minutes since midnight and converts it to a Unix timestamp
 * in the specified timezone. It handles both numeric timezone offsets and IANA timezones.
 *
 * @param minutesSinceMidnight - The number of minutes since midnight
 * @param timezone - Optional timezone string (numeric offset or IANA timezone)
 * @returns Unix timestamp in seconds
 */
export const minutesToSecondsInTimezone = (minutesSinceMidnight: number, timezone?: string): number => {
  const todayUTC = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()))

  if (timezone && !Number.isNaN(Number.parseFloat(timezone))) {
    const numericOffset = Number.parseFloat(timezone) // e.g. -7 for GMT-7
    const adjustedDate = adjustForNumericOffset(todayUTC, numericOffset, minutesSinceMidnight) // e.g. 2023-10-10T10:30:00Z with offset -7 becomes 2023-10-10T03:30:00Z
    const timestampSeconds = Math.floor(adjustedDate.getTime() / 1000) // e.g. 1696934400

    return timestampSeconds
  }

  // Fallback to IANA timezone
  const tzDate = new TZDate(todayUTC, timezone)
  return Math.floor(addMinutes(tzDate, minutesSinceMidnight).getTime() / 1000)
}

/**
 * Date formatting utilities
 */
export const getDatePart = {
  dayName: (date: Date) => new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date),
  dayNumber: (date: Date) => new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date),
  monthName: (date: Date) => new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date),
  year: (date: Date) => new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date),
}
