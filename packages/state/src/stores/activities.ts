import { Activity, type ActivityService, type GrpcConfig } from '@prio-grpc'
import { createGrpcOptimisticStore, createGrpcSingleMethodStore } from '@zondax/stores'
import { useCallback, useEffect, useRef } from 'react'

import { createActivityClient, readActivities, writeActivitySlot } from '../api/activity'
import { sortActivitiesStaircase } from '../feature/activity'

export { Activity, ActivitySlot, GetActivitiesResponse, RouteMatrix } from '@prio-grpc/entities/proto/api/v1/activity_pb'

/**
 * Data structure for activity slot operations
 * Contains both the full map of slots by activity ID and the specific slot being updated
 */
export interface ActivitySlotUpdateData {
  slotsByActivityId: Map<string, Activity.ActivitySlot[]>
  slotToUpdate: {
    activityId: string
    slot: Activity.ActivitySlot
    isDelete: boolean
  }
}

/**
 * Creates a store for fetching activities from the API
 * Uses the single method store pattern for read-only operations
 * @returns A store for fetching activity data with pagination, filtering and sorting
 */
function createReadStore() {
  return createGrpcSingleMethodStore<
    GrpcConfig,
    ActivityService.ActivityServiceClient,
    Activity.GetActivitiesRequest,
    Activity.GetActivitiesResponse
  >({
    createClient: createActivityClient,
    method: readActivities,
  })
}

/**
 * Creates a store for managing activity slots with optimistic updates
 * Uses the optimistic store pattern to provide immediate UI feedback
 * @returns A store with write capabilities and optimistic UI updates
 */
function createWriteStore() {
  return createGrpcOptimisticStore<GrpcConfig, ActivityService.ActivityServiceClient, ActivitySlotUpdateData, Activity.ActivitySlot>(
    {
      createClient: createActivityClient,
      read: async () => ({
        slotsByActivityId: new Map<string, Activity.ActivitySlot[]>(),
        slotToUpdate: {
          activityId: '',
          slot: new Activity.ActivitySlot(),
          isDelete: false,
        },
      }),
      write: async (client, params, data) => {
        const { slotToUpdate } = data
        if (!slotToUpdate || !slotToUpdate.activityId || !slotToUpdate.slot) {
          throw new Error('No slot specified for update')
        }

        await writeActivitySlot(client, params, slotToUpdate.slot, slotToUpdate.isDelete)
        return slotToUpdate.slot
      },
      handlers: {
        mergeUpdate: mergeSlots,
      },
    },
    {
      debounceTime: 0,
    }
  )
}

/**
 * Initializes the write store with data from the read store
 * Extracts all activity slots from the read store and prepares them for optimistic updates
 *
 * @param readStore The store containing fetched activity data
 * @param writeStore The store for updating activity slots
 * @returns true if initialization was successful, false otherwise
 */
function initializeWriteStore(
  readStore: ReturnType<ReturnType<typeof createReadStore>>,
  writeStore: ReturnType<ReturnType<typeof createWriteStore>>
): boolean {
  const readData = readStore.getData()

  // If there's no data in the read store, we can't initialize
  if (!readData?.getActivities?.()) return false

  const activities = readData.getActivities()
  const activityItems = activities?.getItemsList()
  if (!activityItems?.length) return false

  // Build a map of slots by activityId
  const slotsMap = new Map<string, Activity.ActivitySlot[]>()

  for (const activity of activityItems) {
    const actId = activity.getId()
    const slots = activity.getActivitySlotsList()
    if (actId && slots?.length > 0) {
      slotsMap.set(actId, [...slots])
    }
  }

  if (slotsMap.size === 0) return false

  // Initialize the write store with processed data
  writeStore.setInitialData({
    slotsByActivityId: slotsMap,
    slotToUpdate: {
      activityId: '',
      slot: new Activity.ActivitySlot(),
      isDelete: false,
    },
  })

  return true
}

/**
 * Gets activities with optimistic slot updates merged into the backend data
 * Creates a single coherent view combining confirmed backend data with pending changes
 *
 * @param backendData Data from the read store (backend)
 * @param optimisticData Data from the write store (optimistic updates)
 * @returns Activities with optimistic slot updates merged in
 */
function getMergedActivities(
  backendData: Activity.GetActivitiesResponse,
  optimisticData?: ActivitySlotUpdateData
): Activity.GetActivitiesResponse {
  // If no optimistic data is available, return backend data unchanged
  if (!optimisticData?.slotsByActivityId.size) return backendData

  try {
    // Clone backend data to avoid modifying it directly
    const clonedData = backendData.clone()
    const activities = clonedData.getActivities()

    if (!activities) return clonedData

    const activityItems = activities.getItemsList()
    if (!activityItems?.length) return clonedData

    // Update each activity's slots with optimistic data
    for (const activity of activityItems) {
      const actId = activity.getId()
      if (!actId) continue

      // If we have updated slots for this activity in optimistic data, use them
      const updatedSlots = optimisticData.slotsByActivityId.get(actId)
      // Note: Important, if we founded an slot by id, we should apply, don't compare if length(updatedSlots) > 0, even if it's empty
      if (updatedSlots) {
        activity.setActivitySlotsList(updatedSlots)
      }
    }

    return clonedData
  } catch (error) {
    console.error('[ActivityStore] Error applying optimistic updates:', error)
    // On error, return original backend data
    return backendData
  }
}

/**
 * Updates a slot in the activity map, handling additions, updates, and deletions
 * Uses time-based identity to match existing slots
 *
 * @param currentMap Current map of slots by activity ID
 * @param activityId Activity ID to update
 * @param slot Slot to add, update, or delete
 * @param isDelete Whether this is a delete operation
 * @returns Updated map with changes applied
 */
export function updateSlotInMap(
  currentMap: Map<string, Activity.ActivitySlot[]>,
  activityId: string,
  slot: Activity.ActivitySlot,
  isDelete: boolean
): Map<string, Activity.ActivitySlot[]> {
  // Create a copy of the current map
  const updatedMap = new Map<string, Activity.ActivitySlot[]>(currentMap)

  // Check if entry already exists for this activityId
  if (updatedMap.has(activityId)) {
    const slotsForActivity = updatedMap.get(activityId)
    const existingSlots = slotsForActivity ? [...slotsForActivity] : []

    // Find if the slot already exists by comparing start and end times
    const slotIndex = existingSlots.findIndex(
      (s) =>
        s.getStartTime()?.toDate().getTime() === slot.getStartTime()?.toDate().getTime() &&
        s.getEndTime()?.toDate().getTime() === slot.getEndTime()?.toDate().getTime()
    )

    if (slotIndex >= 0) {
      // Remove existing slot
      existingSlots.splice(slotIndex, 1)
    }

    // Add the new slot only if it's not a delete operation
    if (!isDelete) {
      existingSlots.push(slot)
    }

    // Update the map with the modified list
    updatedMap.set(activityId, existingSlots)
  } else if (!isDelete) {
    // If no entry exists for this activityId and it's not a delete operation, create a new one
    updatedMap.set(activityId, [slot])
  }

  return updatedMap
}

/**
 * React hook for managing activity data with optimistic updates
 * Provides a unified interface for reading and writing activity data
 * Handles synchronization between read and write stores
 *
 * @returns Object with methods and state for activity management
 */
export const useActivityStore = () => {
  const readStoreRef = useRef<ReturnType<typeof createReadStore> | null>(null)
  const writeStoreRef = useRef<ReturnType<typeof createWriteStore> | null>(null)
  const initializedRef = useRef(false)

  // Ensure stores are created only once
  if (!readStoreRef.current) readStoreRef.current = createReadStore()
  if (!writeStoreRef.current) writeStoreRef.current = createWriteStore()

  const readStore = readStoreRef.current()
  const writeStore = writeStoreRef.current()

  // Initialize write store with data from read store if needed
  useEffect(() => {
    if (initializedRef.current) return

    const writeData = writeStore.getData()
    // If write store already has data, don't initialize
    if (writeData?.slotsByActivityId && writeData.slotsByActivityId.size > 0) return

    const initialized = initializeWriteStore(readStore, writeStore)
    if (initialized) {
      initializedRef.current = true
    }
  }, [readStore, writeStore])

  /**
   * Sets parameters for both read and write stores
   * Creates and sets the appropriate request object for the read store
   */
  const setParams = useCallback(
    (params: GrpcConfig) => {
      readStore.setParams(params)
      writeStore.setParams(params)
    },
    [readStore, writeStore]
  )

  /**
   * Refreshes the activity data by explicitly requesting a new fetch
   * This is useful when returning to a screen or after some time has passed
   * @returns void
   */
  const refresh = useCallback(() => {
    // The readStore already has the current input, so we can just trigger a refresh
    readStore.forceRefresh()
  }, [readStore])

  /**
   * Updates or deletes an activity slot with optimistic updates
   * Uses the update method of the write store to handle optimistic updates
   *
   * @param slot The activity slot to update or delete
   * @param isDelete Whether this is a deletion (true) or addition/update (false)
   * @returns Promise resolving to the operation result
   */
  const writeSlot = (slot: Activity.ActivitySlot, isDelete: boolean) => {
    const activityId = slot.getActivityId()

    const partialData: Partial<ActivitySlotUpdateData> = {
      slotToUpdate: {
        activityId,
        slot,
        isDelete,
      },
    }

    if (!writeStore.update) {
      return Promise.reject(new Error('writeStore.update is not available'))
    }
    return writeStore.update(partialData)
  }

  /**
   * Retrieves combined data from both read and write stores
   * Returns a unified view of activities with optimistic updates applied
   */
  const getData = useCallback(() => {
    const readData = readStore.getData()
    if (!readData) return readData

    const writeData = writeStore.getData()

    return getMergedActivities(readData, writeData)
  }, [readStore, writeStore])

  /**
   * Gets activities sorted in staircase pattern
   * Activities with selections are shown first, then ordered by start time
   * @param autoReorder Whether to apply the staircase ordering, defaults to true
   * @returns Activities sorted in staircase pattern
   */
  const getSortedActivities = useCallback(
    (autoReorder = true) => {
      const data = getData()
      if (!data) return []

      const activities = data.getActivities()?.getItemsList() ?? []

      // Extract all slots from activities
      const allSlots: Activity.ActivitySlot[] = []
      for (const activity of activities) {
        const slots = activity.getActivitySlotsList()
        if (slots && slots.length > 0) {
          allSlots.push(...slots)
        }
      }

      // Apply staircase sorting
      return sortActivitiesStaircase(activities, allSlots, autoReorder)
    },
    [getData] // Removed sortActivitiesStaircase
  )

  return {
    // Read methods
    getData,
    getSortedActivities,
    isLoading: readStore.isLoading,
    error: readStore.error,
    setParams,
    setInput: readStore.setInput,
    refresh,

    // Write methods
    write: writeSlot,
    isWriting: writeStore.isWriting,
  }
}

/**
 * Merge function that handles the actual slot update logic
 * Updates the slot map based on the current state and partial data
 */
export const mergeSlots = (currentData: ActivitySlotUpdateData, partialData: Partial<ActivitySlotUpdateData>): ActivitySlotUpdateData => {
  if (!partialData.slotToUpdate) {
    throw new Error('No slot to update provided')
  }

  const { activityId, slot, isDelete } = partialData.slotToUpdate

  const currentMap = currentData.slotsByActivityId || new Map<string, Activity.ActivitySlot[]>()
  const updatedMap = updateSlotInMap(currentMap, activityId, slot, isDelete)

  return {
    slotsByActivityId: updatedMap,
    slotToUpdate: partialData.slotToUpdate,
  }
}
