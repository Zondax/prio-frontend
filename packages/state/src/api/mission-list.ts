import type { GrpcConfig } from '@mono-grpc'
import { MOCK_MISSIONS } from './mission-list.mocks'
import type {
  CreateMissionRequest,
  DeleteMissionRequest,
  Mission,
  MissionListFilters,
  MissionListMetadata,
  MissionListResponse,
  StandardResponse,
  UpdateMissionStatusRequest,
} from './mission-list.types'

// Re-export types for convenience
export type {
  Mission,
  MissionListFilters,
  MissionListMetadata,
  MissionListResponse,
  CreateMissionRequest,
  UpdateMissionStatusRequest,
  DeleteMissionRequest,
  StandardResponse,
}

// Mock client creator - would be replaced with real gRPC client
export const createMissionListClient = (cp: GrpcConfig) => {
  return {
    // Mock client object that mimics gRPC client interface
    baseUrl: cp.baseUrl,
    metadata: cp.metadata,
  }
}

// Mock API functions that follow the same pattern as chat-list.ts
export const getMissionList = async (
  _client: ReturnType<typeof createMissionListClient>,
  _clientParams: GrpcConfig,
  filters?: MissionListFilters
): Promise<MissionListResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  let missions = Object.values(MOCK_MISSIONS)

  // Apply filters
  if (filters?.status) {
    missions = missions.filter((mission) => mission.status === filters.status)
  }
  if (filters?.type) {
    missions = missions.filter((mission) => mission.type === filters.type)
  }
  if (filters?.organizationId) {
    missions = missions.filter((mission) => mission.organizationId === filters.organizationId)
  }
  if (filters?.participantId) {
    const participantId = filters.participantId
    missions = missions.filter((mission) => mission.participantIds.includes(participantId))
  }

  // Apply search
  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    missions = missions.filter(
      (mission) =>
        mission.name.toLowerCase().includes(query) ||
        mission.description.toLowerCase().includes(query) ||
        mission.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'startDate'
  const sortOrder = filters?.sortOrder || 'desc'

  missions.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'progress':
        aValue = a.progress
        bValue = b.progress
        break
      case 'startDate':
        aValue = a.startDate.getTime()
        bValue = b.startDate.getTime()
        break
      case 'targetDate':
        aValue = a.targetDate?.getTime() || 0
        bValue = b.targetDate?.getTime() || 0
        break
      case 'createdAt':
        aValue = a.createdAt.getTime()
        bValue = b.createdAt.getTime()
        break
      default:
        aValue = a.startDate.getTime()
        bValue = b.startDate.getTime()
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

  const paginatedMissions = missions.slice(startIndex, endIndex)
  const totalPages = Math.ceil(missions.length / limit)

  // Generate cursor for cursor-based pagination (using last item's ID)
  const nextCursor = paginatedMissions.length > 0 ? paginatedMissions[paginatedMissions.length - 1].id : undefined

  return {
    data: paginatedMissions,
    metadata: {
      totalCount: missions.length,
      hasMore: endIndex < missions.length,
      currentPage: page,
      totalPages,
      pageSize: limit,
    },
    cursor: nextCursor || '',
  }
}

export const createMission = async (
  _client: ReturnType<typeof createMissionListClient>,
  _clientParams: GrpcConfig,
  data: CreateMissionRequest
): Promise<Mission> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const newMission: Mission = {
    id: `mission-${Date.now()}`,
    name: data.name,
    description: data.description || '',
    type: data.type,
    status: 'planning',
    priority: data.priority || 'medium',
    progress: 0,
    participantIds: data.participantIds || [],
    startDate: new Date(),
    targetDate: data.targetDate || null,
    tags: data.tags || [],
    organizationId: data.organizationId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_MISSIONS[newMission.id] = newMission

  return newMission
}

export const updateMissionStatus = async (
  _client: ReturnType<typeof createMissionListClient>,
  _clientParams: GrpcConfig,
  data: UpdateMissionStatusRequest
): Promise<Mission> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const existingMission = MOCK_MISSIONS[data.missionId]
  if (!existingMission) {
    throw new Error(`Mission with ID ${data.missionId} not found`)
  }

  const updatedMission: Mission = {
    ...existingMission,
    ...(data.status && { status: data.status }),
    ...(data.progress !== undefined && { progress: data.progress }),
    updatedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_MISSIONS[data.missionId] = updatedMission

  return updatedMission
}

export const deleteMission = async (
  _client: ReturnType<typeof createMissionListClient>,
  _clientParams: GrpcConfig,
  data: DeleteMissionRequest
): Promise<StandardResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const existingMission = MOCK_MISSIONS[data.missionId]
  if (!existingMission) {
    return {
      success: false,
      message: `Mission with ID ${data.missionId} not found`,
    }
  }

  // In real implementation, this would be deleted from backend
  delete MOCK_MISSIONS[data.missionId]

  return {
    success: true,
    message: 'Mission deleted successfully',
  }
}
