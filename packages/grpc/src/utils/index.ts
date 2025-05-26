import { Struct, Value } from 'google-protobuf/google/protobuf/struct_pb'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'

// Export pagination utilities
export * from './pagination'

/**
 * Converts a JavaScript Date object to a protobuf Timestamp.
 *
 * @param {Date} date - The date to convert.
 * @returns {Timestamp} - The corresponding protobuf Timestamp.
 */
export function dateToTimestamp(date: Date): Timestamp {
  const timestamp = new Timestamp()
  const seconds = Math.floor(date.getTime() / 1000)
  const nanos = (date.getTime() % 1000) * 1e6
  timestamp.setSeconds(seconds)
  timestamp.setNanos(nanos)
  return timestamp
}

/**
 * Converts an object containing seconds to a protobuf Timestamp.
 *
 * @param {Object} dateObj - The object containing seconds.
 * @returns {Timestamp} - The corresponding protobuf Timestamp.
 */
export function dateObjToTimestamp(dateObj: Timestamp.AsObject): Timestamp {
  const timestamp = new Timestamp()
  timestamp.fromDate(new Date(dateObj.seconds * 1000))
  return timestamp
}

/**
 * Converts a string or Date object to an object containing seconds and nanoseconds.
 *
 * @param {string | Date} date - The date to convert, either as a string or a Date object.
 * @returns {{ seconds: number; nanos: number }} - The corresponding object with seconds and nanoseconds.
 */
export const stringOrDateToTimestampAsObject = (date: string | Date): { seconds: number; nanos: number } => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return {
    seconds: Math.floor(dateObj.getTime() / 1000),
    nanos: (dateObj.getTime() % 1000) * 1e6,
  }
}

/**
 * Checks if a value is a Timestamp.AsObject.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} - True if the value is a Timestamp.AsObject, false otherwise.
 */
export const isTimestampAsObject = (value: any): value is Timestamp.AsObject => {
  return typeof value === 'object' && value !== null && 'seconds' in value
}

/**
 * Converts a Timestamp.AsObject to a JavaScript Date object.
 *
 * @param {Timestamp.AsObject} timestampObj - The Timestamp.AsObject to convert.
 * @returns {Date} - The corresponding JavaScript Date object.
 */
export const timestampAsObjectToDate = (timestampObj: Timestamp.AsObject): Date => {
  return new Date(timestampObj.seconds * 1000)
}

export const formatTime = (date: Date | string) => {
  const tempDate = typeof date === 'string' ? new Date(date) : date
  return tempDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export const formatTimeRange = (
  startDate: Date | Timestamp.AsObject | undefined,
  endDate: Date | Timestamp.AsObject | undefined
): string | null => {
  if (startDate && endDate) {
    // Convert startDate and endDate to Date object
    const start = isTimestampAsObject(startDate)
      ? timestampAsObjectToDate(startDate)
      : startDate instanceof Date
        ? startDate
        : new Date(startDate)
    const end = isTimestampAsObject(endDate) ? timestampAsObjectToDate(endDate) : endDate instanceof Date ? endDate : new Date(endDate)

    if (start === end) {
      return formatTime(start)
    }

    return `${formatTime(start)} - ${formatTime(end)}`
  }
  return null
}

export const formatDateRange = (
  startDate: Date | Timestamp.AsObject | undefined,
  endDate: Date | Timestamp.AsObject | undefined
): string => {
  if (!startDate) return '' // Handle null or missing startDate

  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }

  // Convert startDate to Date object
  const start = isTimestampAsObject(startDate)
    ? timestampAsObjectToDate(startDate)
    : startDate instanceof Date
      ? startDate
      : new Date(startDate)

  // If endDate is null, format as "DDD, MMM DD"
  if (!endDate) {
    return new Intl.DateTimeFormat('en-US', options).format(start)
  }

  // Convert endDate to Date object
  const end = isTimestampAsObject(endDate) ? timestampAsObjectToDate(endDate) : endDate instanceof Date ? endDate : new Date(endDate)

  if (start.getTime() === end.getTime()) {
    return new Intl.DateTimeFormat('en-US', options).format(start)
  }

  // Extracting day and month for both start and end dates
  const startMonth = start.toLocaleString('en-US', { month: 'short' })
  const endMonth = end.toLocaleString('en-US', { month: 'short' })

  const startDay = start.getDate()
  const endDay = end.getDate()

  if (startMonth === endMonth) {
    // If the start and end months and days are the same, format as "MMM DD"
    if (startDay === endDay) {
      return `${startMonth} ${startDay}`
    }

    // If the start and end months are the same, format as "MMM DD - DD"
    return `${startMonth} ${startDay} - ${endDay}`
  }

  // If months are different, format as "MMM DD - MMM DD"
  return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
}

/**
 * Converts a JavaScript object to a Protocol Buffers Struct
 */
export function convertToStruct(obj: Record<string, any>): Struct {
  const struct = new Struct()
  const fieldsMap = struct.getFieldsMap()

  for (const [key, value] of Object.entries(obj)) {
    fieldsMap.set(key, convertToValue(value))
  }

  return struct
}

/**
 * Converts a JavaScript value to a Protocol Buffers Value
 */
function convertToValue(value: any): Value {
  const pbValue = new Value()

  if (value === null || value === undefined) {
    pbValue.setNullValue(0)
  } else if (typeof value === 'string') {
    pbValue.setStringValue(value)
  } else if (typeof value === 'number') {
    pbValue.setNumberValue(value)
  } else if (typeof value === 'boolean') {
    pbValue.setBoolValue(value)
  } else if (typeof value === 'object') {
    pbValue.setStructValue(convertToStruct(value))
  } else {
    // Fallback for any other types - convert to string
    pbValue.setStringValue(String(value))
  }

  return pbValue
}
