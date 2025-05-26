import type { Activity } from '@prio-grpc'

/**
 * Creates a map of activities by their IDs for efficient lookups
 * @param activities List of activities to map
 * @returns A Map with activity IDs as keys and activities as values
 */
export function createActivityMap(activities: Activity.Activity[]): Map<string, Activity.Activity> {
  return new Map(activities.map((activity) => [activity.getId(), activity]))
}

/**
 * Creates a map of activity indices for efficient position lookups
 * @param activities List of activities to map
 * @returns A Map with activity IDs as keys and their indices as values
 */
export function createActivityIndicesMap(activities: Activity.Activity[]): Map<string, number> {
  return new Map(activities.map((activity, index) => [activity.getId(), index]))
}
