import type { Activity, ActivitySlot } from '../../stores/activities'

/**
 * Sorts activities in a staircase pattern based on selection status and time
 * Activities with selections are shown first, then sorted by their start time
 * This creates a visual staircase effect in the UI
 *
 * @param activities List of activities to sort
 * @param activitySlots List of all activity slots to determine which activities have selections
 * @param autoReorder Whether to apply the reordering (if false, returns original order)
 * @returns Sorted list of activities in staircase pattern
 */
export function sortActivitiesStaircase(activities: Activity[], activitySlots: ActivitySlot[], autoReorder = true): Activity[] {
  if (!activities || !autoReorder) return activities

  // Clone the activities to avoid modifying the original array
  const activityCopy = [...activities]

  // Sort activities first by their start time
  activityCopy.sort((a, b) => {
    const aStartTime = a.getEvent()?.getDate()?.getStart()?.getSeconds() ?? 0
    const bStartTime = b.getEvent()?.getDate()?.getStart()?.getSeconds() ?? 0
    return aStartTime - bStartTime
  })

  // Count the number of selected slots per activity
  const activityWithSelections = new Map<string, number>()
  for (const slot of activitySlots) {
    const activityId = slot.getActivityId()
    if (!activityWithSelections.has(activityId)) {
      activityWithSelections.set(activityId, 0)
    }
    activityWithSelections.set(activityId, (activityWithSelections.get(activityId) ?? 0) + 1)
  }

  // Group activities by whether they have selections
  const withSelections: Activity[] = []
  const withoutSelections: Activity[] = []

  for (const activity of activityCopy) {
    const selectionCount = activityWithSelections.get(activity.getId()) ?? 0
    if (selectionCount > 0) {
      withSelections.push(activity)
    } else {
      withoutSelections.push(activity)
    }
  }

  // Sort activities with selections by their start time to create a staircase effect
  withSelections.sort((a, b) => {
    const aStartTime = a.getEvent()?.getDate()?.getStart()?.getSeconds() ?? 0
    const bStartTime = b.getEvent()?.getDate()?.getStart()?.getSeconds() ?? 0
    return aStartTime - bStartTime
  })

  // Return the combined sorted list, with selected activities first (for the staircase effect)
  // followed by the unselected ones
  return [...withSelections, ...withoutSelections]
}

/**
 * Sorts transport options by duration (fastest first)
 * @param transports Array of transport options
 * @returns Sorted array of transport options with fastest first
 */
export function sortTransportsByDuration<T extends { duration: number }>(transports: T[]): T[] {
  if (!transports || transports.length === 0) return transports
  return [...transports].sort((a, b) => a.duration - b.duration)
}
