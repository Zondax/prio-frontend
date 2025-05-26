import { Activity, ActivityService, Common, type GrpcConfig, type Metadata, type Timestamp } from '@prio-grpc'

export type ActivityRequestOptions = {
  pageSize?: number
  cursor?: string
  dateFilter?: {
    startDate?: Timestamp
    endDate?: Timestamp
  }
  sorting?: Common.SortingOption[]
}

export const createActivityClient = (cp: GrpcConfig) => {
  return new ActivityService.ActivityServiceClient(cp.baseUrl, cp.metadata as Metadata)
}

// Read multiple activities from the API
export const readActivities = async (
  client: ActivityService.ActivityServiceClient,
  clientParams: GrpcConfig,
  input: Activity.GetActivitiesRequest
): Promise<Activity.GetActivitiesResponse> => {
  const response = await client.getActivities(input, clientParams.metadata as Metadata)
  return response
}

// Helper function to create a GetActivitiesRequest
export const createActivityRequest = (options?: ActivityRequestOptions): Activity.GetActivitiesRequest => {
  const request = new Activity.GetActivitiesRequest()

  if (options?.pageSize) {
    request.setPageSize(options.pageSize)
  }

  if (options?.cursor) {
    request.setCursor(options.cursor)
  }

  if (options?.dateFilter) {
    const dateFilter = new Common.DateRange()

    if (options.dateFilter.startDate) {
      dateFilter.setStartDate(options.dateFilter.startDate)
    }

    if (options.dateFilter.endDate) {
      dateFilter.setEndDate(options.dateFilter.endDate)
    }

    request.setDateFilter(dateFilter)
  }

  if (options?.sorting && options.sorting.length > 0) {
    for (const sort of options.sorting) {
      request.addSorting(sort)
    }
  }

  return request
}

// Create a new activity time slot
export const createActivitySlot = async (
  client: ActivityService.ActivityServiceClient,
  clientParams: GrpcConfig,
  params: {
    activityId: string
    startTime: Timestamp
    endTime: Timestamp
  }
): Promise<Activity.CreateActivitySlotResponse> => {
  const request = new Activity.CreateActivitySlotRequest()
  const activitySlot = new Activity.ActivitySlotData()

  activitySlot.setActivityId(params.activityId)

  activitySlot.setStartTime(params.startTime)
  activitySlot.setEndTime(params.endTime)

  request.setActivitySlot(activitySlot)

  const response = await client.createActivitySlot(request, clientParams.metadata as Metadata)
  return response
}

// Delete an activity time slot
export const deleteActivitySlot = async (
  client: ActivityService.ActivityServiceClient,
  clientParams: GrpcConfig,
  params: {
    activitySlot: Activity.ActivitySlotData
  }
): Promise<Activity.DeleteActivitySlotResponse> => {
  const request = new Activity.DeleteActivitySlotRequest()

  request.setActivitySlot(params.activitySlot)

  const response = await client.deleteActivitySlot(request, clientParams.metadata as Metadata)
  return response
}

// Write a single activity slot (create or delete)
export const writeActivitySlot = async (
  client: ActivityService.ActivityServiceClient,
  clientParams: GrpcConfig,
  slot: Activity.ActivitySlot,
  isDelete: boolean
): Promise<void> => {
  if (!client) {
    throw new Error('Activity client is not initialized')
  }

  if (!slot) {
    throw new Error('Invalid slot provided')
  }

  const startTime = slot.getStartTime()
  const endTime = slot.getEndTime()
  const activityId = slot.getActivityId()

  if (isDelete) {
    const activitySlot = new Activity.ActivitySlotData()
    activitySlot.setActivityId(activityId)
    activitySlot.setStartTime(startTime)
    activitySlot.setEndTime(endTime)

    const success = await deleteActivitySlot(client, clientParams, {
      activitySlot,
    })
    if (!success) {
      throw new Error('Failed to delete activity slot')
    }
    return
  }

  if (!startTime || !endTime) {
    throw new Error('startTime and endTime are required')
  }

  const response = await createActivitySlot(client, clientParams, {
    activityId,
    startTime,
    endTime,
  })

  if (!response) {
    throw new Error('Failed to create activity slot')
  }
  return
}

/**
 * Deep merges two Activity-related Protocol Buffer messages
 * Works by converting to plain objects, merging, and converting back
 */
export const deepMergeActivityData = (
  currentData: Activity.GetActivitiesResponse,
  partialData: Partial<Activity.GetActivitiesResponse>
): Activity.GetActivitiesResponse => {
  // Convert current data to plain object
  // Clone the current data
  const clonedData = currentData.clone()

  try {
    // Get activities from partial data
    const partialActivities = partialData instanceof Activity.GetActivitiesResponse ? partialData.getActivities() : undefined

    if (!partialActivities) {
      return clonedData
    }

    // Get partial activity slots
    const partialItems = partialActivities.getItemsList()
    if (!partialItems || partialItems.length === 0) {
      return clonedData
    }

    // Get current activities
    const currentActivities = clonedData.getActivities()
    if (!currentActivities) {
      return clonedData
    }

    // For each activity in partial data
    const currentItems = currentActivities.getItemsList()
    for (const partialActivity of partialItems) {
      // Find matching current activity
      const currentActivity = currentItems.find((c) => c.getId() === partialActivity.getId())
      if (!currentActivity) continue

      // Get slots lists
      const currentSlots = currentActivity.getActivitySlotsList() || []
      const partialSlots = partialActivity.getActivitySlotsList() || []

      const clonedCurrentSlots = currentSlots.map((slot) => slot.clone())
      // Process deletions first
      for (const partialSlot of partialSlots) {
        const slotIndex = currentSlots.findIndex((cs) => cs.getId() === partialSlot.getId())
        const isDeleteSlot = !partialSlot.getStartTime() && !partialSlot.getEndTime()
        if (slotIndex >= 0) {
          // If partial slot has no start/end time, remove it from current slots
          if (isDeleteSlot) {
            clonedCurrentSlots.splice(slotIndex, 1)
          } else {
            clonedCurrentSlots[slotIndex] = partialSlot
          }
          currentActivity.setActivitySlotsList(clonedCurrentSlots)
        } else if (!isDeleteSlot) {
          currentActivity.addActivitySlots(partialSlot)
        }
      }
    }

    return clonedData
  } catch (error) {
    console.error('Error in deepMergeActivityData:', error)
    return clonedData
  }
}
