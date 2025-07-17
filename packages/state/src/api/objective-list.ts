import type { GrpcConfig } from '@mono-grpc'
import { MOCK_OBJECTIVES } from './objective-list.mocks'
import type {
  CreateObjectiveRequest,
  DeleteObjectiveRequest,
  Objective,
  ObjectiveListFilters,
  ObjectiveListMetadata,
  ObjectiveListResponse,
  StandardResponse,
  UpdateObjectiveStatusRequest,
} from './objective-list.types'

// Re-export types for convenience
export type {
  Objective,
  ObjectiveListFilters,
  ObjectiveListMetadata,
  ObjectiveListResponse,
  CreateObjectiveRequest,
  UpdateObjectiveStatusRequest,
  DeleteObjectiveRequest,
  StandardResponse,
}

// Mock client creator - would be replaced with real gRPC client
export const createObjectiveListClient = (cp: GrpcConfig) => {
  return {
    // Mock client object that mimics gRPC client interface
    baseUrl: cp.baseUrl,
    metadata: cp.metadata,
  }
}

// Mock API functions that follow the same pattern as other list stores
export const getObjectiveList = async (
  _client: ReturnType<typeof createObjectiveListClient>,
  _clientParams: GrpcConfig,
  filters?: ObjectiveListFilters
): Promise<ObjectiveListResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  let objectives = Object.values(MOCK_OBJECTIVES)

  // Apply filters
  if (filters?.missionId) {
    objectives = objectives.filter((objective) => objective.missionId === filters.missionId)
  }
  if (filters?.status) {
    objectives = objectives.filter((objective) => objective.status === filters.status)
  }
  if (filters?.priority) {
    objectives = objectives.filter((objective) => objective.priority === filters.priority)
  }
  if (filters?.assigneeId) {
    objectives = objectives.filter((objective) => objective.assigneeId === filters.assigneeId)
  }

  // Apply search
  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    objectives = objectives.filter(
      (objective) =>
        objective.title.toLowerCase().includes(query) ||
        objective.description.toLowerCase().includes(query) ||
        objective.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'dueDate'
  const sortOrder = filters?.sortOrder || 'asc'

  objectives.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'progress':
        aValue = a.progress
        bValue = b.progress
        break
      case 'dueDate':
        aValue = a.dueDate?.getTime() || 0
        bValue = b.dueDate?.getTime() || 0
        break
      case 'startDate':
        aValue = a.startDate.getTime()
        bValue = b.startDate.getTime()
        break
      case 'createdAt':
        aValue = a.createdAt.getTime()
        bValue = b.createdAt.getTime()
        break
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority]
        bValue = priorityOrder[b.priority]
        break
      }
      default:
        aValue = a.dueDate?.getTime() || 0
        bValue = b.dueDate?.getTime() || 0
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    }
    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
  })

  // Apply pagination
  const page = filters?.page || 1
  const limit = filters?.limit || 20 // Default to 20 for infinite scroll
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const paginatedObjectives = objectives.slice(startIndex, endIndex)
  const totalPages = Math.ceil(objectives.length / limit)

  // Generate cursor for cursor-based pagination (using last item's ID)
  const nextCursor = paginatedObjectives.length > 0 ? paginatedObjectives[paginatedObjectives.length - 1].id : undefined

  return {
    data: paginatedObjectives,
    metadata: {
      totalCount: objectives.length,
      hasMore: endIndex < objectives.length,
      currentPage: page,
      totalPages,
      pageSize: limit,
    },
    cursor: nextCursor || '',
  }
}

export const createObjective = async (
  _client: ReturnType<typeof createObjectiveListClient>,
  _clientParams: GrpcConfig,
  data: CreateObjectiveRequest
): Promise<Objective> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const newObjective: Objective = {
    id: `objective-${Date.now()}`,
    title: data.title,
    description: data.description || '',
    status: 'active',
    priority: data.priority || 'medium',
    progress: 0,
    assigneeId: data.assigneeId || 'user-you',
    missionId: data.missionId,
    dueDate: data.dueDate || null,
    startDate: new Date(),
    estimatedHours: data.estimatedHours || null,
    actualHours: 0,
    tags: data.tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_OBJECTIVES[newObjective.id] = newObjective

  return newObjective
}

export const updateObjectiveStatus = async (
  _client: ReturnType<typeof createObjectiveListClient>,
  _clientParams: GrpcConfig,
  data: UpdateObjectiveStatusRequest
): Promise<Objective> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const existingObjective = MOCK_OBJECTIVES[data.objectiveId]
  if (!existingObjective) {
    throw new Error(`Objective with ID ${data.objectiveId} not found`)
  }

  const updatedObjective: Objective = {
    ...existingObjective,
    ...(data.status && { status: data.status }),
    ...(data.progress !== undefined && { progress: data.progress }),
    ...(data.actualHours !== undefined && { actualHours: data.actualHours }),
    updatedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_OBJECTIVES[data.objectiveId] = updatedObjective

  return updatedObjective
}

export const deleteObjective = async (
  _client: ReturnType<typeof createObjectiveListClient>,
  _clientParams: GrpcConfig,
  data: DeleteObjectiveRequest
): Promise<StandardResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const existingObjective = MOCK_OBJECTIVES[data.objectiveId]
  if (!existingObjective) {
    return {
      success: false,
      message: `Objective with ID ${data.objectiveId} not found`,
    }
  }

  // In real implementation, this would be deleted from backend
  delete MOCK_OBJECTIVES[data.objectiveId]

  return {
    success: true,
    message: 'Objective deleted successfully',
  }
}
