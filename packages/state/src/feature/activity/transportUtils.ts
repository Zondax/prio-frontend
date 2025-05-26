import { Activity } from '@prio-grpc'

import { TransportMode } from '../../feature/constants'
import { getMinutesFromTimestamp } from '../../utils/time'

/**
 * Basic travel time information between two activity slots
 */
export interface TravelTime {
  from: Activity.ActivitySlot
  to: Activity.ActivitySlot
}

/**
 * Information about earliest possible slots that can be reached,
 * based on travel times from previous slots
 */
export interface EarliestReachableSlot {
  slots: { [key in TransportMode]: number } | null // the slot in minutes that are possible to reach from the latest slot
  travelTimes?: {
    [key in TransportMode]: number | undefined
  } // the travel time in minutes for each transport mode
}

/**
 * Detailed information about a transport mode between two activity slots
 */
export interface TransportInfo {
  type: TransportMode
  duration: number
  leaveTime: number
  arrivalTime: number
  isPossible: boolean
  availableTime: number
}

/**
 * Calculates travel time between two activity slots for different transport modes
 */
export const calculateTravelTime = (
  from: Activity.ActivitySlot,
  to: Activity.ActivitySlot,
  routeMatrix?: Activity.RouteMatrix
): { [key in TransportMode]: number | undefined } | undefined => {
  if (!routeMatrix || !routeMatrix.getRoutesList() || !from || !to) return

  // Find the route between these two activities
  const route = routeMatrix
    .getRoutesList()
    .find(
      (r) =>
        (r.getFromActivityId() === from.getActivityId() && r.getToActivityId() === to.getActivityId()) ||
        (r.getFromActivityId() === to.getActivityId() && r.getToActivityId() === from.getActivityId())
    )

  if (!route) return

  // Convert the transport modes to a map for easy access
  const transportModes: { [key in TransportMode]: number | undefined } = {
    [TransportMode.FOOT]: undefined,
    [TransportMode.BIKE]: undefined,
    [TransportMode.CAR]: undefined,
  }

  for (const mode of route.getTransportModesList()) {
    transportModes[mode.getTransportMode() as TransportMode] = mode.getDurationInMinutes()
  }

  return transportModes
}

/**
 * Calculates the earliest possible time slot reachable after travel
 * @param baseTime The base time in minutes (typically end time of previous activity)
 * @param travelTime The travel time in minutes
 * @param slotDurationMinutes The duration of each time slot
 * @returns The earliest reachable time rounded up to the nearest slot boundary
 */
export const calculateEarliestReachableTime = (baseTime: number, travelTime: number, slotDurationMinutes: number): number => {
  // Calculate total time needed (base time + travel time)
  const totalTime = baseTime + travelTime

  // Round up to the next slot boundary
  const earliestReachableTime = Math.ceil(totalTime / slotDurationMinutes) * slotDurationMinutes

  return earliestReachableTime
}
/**
 * Calculate the earliest reachable slot and travel times for an activity
 */
export const getEarliestReachableSlot = (
  activityId: string,
  latestWindow: Activity.ActivitySlot | null,
  slotDurationMinutes: number,
  routeMatrix?: Activity.RouteMatrix,
  timezone?: string
): EarliestReachableSlot => {
  if (!latestWindow || latestWindow.getActivityId() === activityId) {
    return {
      slots: null,
      travelTimes: { [TransportMode.FOOT]: undefined, [TransportMode.BIKE]: undefined, [TransportMode.CAR]: undefined },
    }
  }

  if (!routeMatrix) {
    return {
      slots: null,
      travelTimes: { [TransportMode.FOOT]: undefined, [TransportMode.BIKE]: undefined, [TransportMode.CAR]: undefined },
    }
  }

  const newSlot = new Activity.ActivitySlot()
  newSlot.setActivityId(activityId)
  newSlot.setStartTime(undefined)
  newSlot.setEndTime(undefined)
  newSlot.setId('')

  // Calculate the travel times between the activities
  const travelTimes = calculateTravelTime(latestWindow, newSlot, routeMatrix)

  // Calculate the end time of the selected window in minutes
  const selectedWindowEndTime = getMinutesFromTimestamp(latestWindow.getEndTime()?.getSeconds() ?? 0, timezone)

  return {
    slots: {
      [TransportMode.FOOT]: calculateEarliestReachableTime(selectedWindowEndTime, travelTimes?.foot ?? 0, slotDurationMinutes),
      [TransportMode.BIKE]: calculateEarliestReachableTime(selectedWindowEndTime, travelTimes?.bike ?? 0, slotDurationMinutes),
      [TransportMode.CAR]: calculateEarliestReachableTime(selectedWindowEndTime, travelTimes?.car ?? 0, slotDurationMinutes),
    },
    travelTimes,
  }
}

/**
 * Calculates transport information between two activity slots
 */
export const calculateTransportInfo = (
  from: Activity.ActivitySlot,
  to: Activity.ActivitySlot,
  routeMatrix?: Activity.RouteMatrix
): TransportInfo[] => {
  if (!routeMatrix) return []

  const travelTimes = calculateTravelTime(from, to, routeMatrix)

  // If all travel times are undefined, return an empty array
  if (!travelTimes) {
    return []
  }

  // Convert seconds to minutes for calculations
  const leaveTime = getMinutesFromTimestamp(from.getEndTime()?.getSeconds() ?? 0)
  const arrivalTime = getMinutesFromTimestamp(to.getStartTime()?.getSeconds() ?? 0)
  const availableTime = arrivalTime && leaveTime ? arrivalTime - leaveTime : 0

  return [
    ...(travelTimes.foot !== undefined
      ? [
          {
            type: TransportMode.FOOT,
            duration: travelTimes.foot,
            leaveTime,
            arrivalTime: leaveTime + travelTimes.foot,
            isPossible: travelTimes.foot <= availableTime,
            availableTime,
          } as TransportInfo,
        ]
      : []),
    ...(travelTimes.bike !== undefined
      ? [
          {
            type: TransportMode.BIKE,
            duration: travelTimes.bike,
            leaveTime,
            arrivalTime: leaveTime + travelTimes.bike,
            isPossible: travelTimes.bike <= availableTime,
            availableTime,
          } as TransportInfo,
        ]
      : []),
    ...(travelTimes.car !== undefined
      ? [
          {
            type: TransportMode.CAR,
            duration: travelTimes.car,
            leaveTime,
            arrivalTime: leaveTime + travelTimes.car,
            isPossible: travelTimes.car <= availableTime,
            availableTime,
          } as TransportInfo,
        ]
      : []),
  ]
}

/**
 * Determines if a transport icon should be shown for a specific time slot
 * @param time The time slot to check
 * @param transportType The transport mode to check
 * @param disabledButton Whether the button is disabled
 * @param earliestReachableSlot The earliest reachable slot data
 * @param timeSlots Array of available time slots
 * @returns Boolean indicating whether to show the transport icon
 */
export const showTransportIcon = (
  time: number,
  transportType: TransportMode,
  disabledButton: boolean,
  earliestReachableSlot: EarliestReachableSlot | null,
  timeSlots: number[]
): boolean => {
  if (disabledButton || !earliestReachableSlot?.travelTimes?.[transportType]) {
    return false
  }

  const slotTime = earliestReachableSlot.slots?.[transportType]
  if (!slotTime) {
    return false
  }

  return slotTime === time || (slotTime < timeSlots[0] && time === timeSlots[0])
}

/**
 * Checks if a button should be disabled due to travel time constraints
 * @param time The time slot to check
 * @param activityId The ID of the current activity
 * @param latestSelection The latest selected activity
 * @param earliestReachableSlot The earliest reachable slot data
 * @returns Boolean indicating whether the button should be disabled
 */
export const shouldDisableForTravelTime = (
  time: number,
  activityId: string,
  latestSelection: { getActivityId: () => string } | null,
  earliestReachableSlot: EarliestReachableSlot | null
): boolean => {
  if (!earliestReachableSlot || !latestSelection) {
    return false
  }

  // If this is the same activity as the latest selection, don't disable
  if (latestSelection.getActivityId() === activityId) {
    return false
  }

  const earliestFootSlot = earliestReachableSlot.slots?.[TransportMode.FOOT]
  const earliestBikeSlot = earliestReachableSlot.slots?.[TransportMode.BIKE]
  const earliestCarSlot = earliestReachableSlot.slots?.[TransportMode.CAR]

  if (!earliestFootSlot || !earliestBikeSlot || !earliestCarSlot) {
    return false
  }

  return earliestFootSlot > time || earliestBikeSlot > time || earliestCarSlot > time
}
