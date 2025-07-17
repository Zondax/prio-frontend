import type { GrpcConfig } from '@mono-grpc'
import { MOCK_MISSIONS, MOCK_OBJECTIVES, MOCK_TEAM_MEMBERS } from './mission.mocks'
import type {
  AddObjectiveRequest,
  AddTeamMemberRequest,
  DeleteObjectiveRequest,
  GetMissionDetailsRequest,
  Mission,
  MissionDetails,
  Objective,
  RemoveTeamMemberRequest,
  StandardResponse,
  TeamMember,
  UpdateMissionRequest,
  UpdateObjectiveRequest,
} from './mission.types'

// Re-export types for convenience
export type {
  Mission,
  Objective,
  TeamMember,
  MissionDetails,
  GetMissionDetailsRequest,
  UpdateMissionRequest,
  AddObjectiveRequest,
  UpdateObjectiveRequest,
  DeleteObjectiveRequest,
  AddTeamMemberRequest,
  RemoveTeamMemberRequest,
  StandardResponse,
}

// Mock client creator - would be replaced with real gRPC client
export const createMissionClient = (cp: GrpcConfig) => {
  return {
    // Mock client object that mimics gRPC client interface
    baseUrl: cp.baseUrl,
    metadata: cp.metadata,
  }
}

// Mock API functions that follow the same pattern as chat.ts
export const getMissionDetails = async (
  _client: ReturnType<typeof createMissionClient>,
  _clientParams: GrpcConfig,
  request: GetMissionDetailsRequest
): Promise<MissionDetails> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const mission = MOCK_MISSIONS[request.missionId]
  if (!mission) {
    throw new Error(`Mission with ID ${request.missionId} not found`)
  }

  const objectives = Object.values(MOCK_OBJECTIVES).filter((obj) => obj.missionId === request.missionId)
  const teamMembers = MOCK_TEAM_MEMBERS[request.missionId] || []

  // Mock chat channels for this mission
  const chatChannels = [
    {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'General Discussion',
      type: 'team',
      lastActivity: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'AI Assistant',
      type: 'ai',
      lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ]

  const completedObjectives = objectives.filter((obj) => obj.status === 'completed').length
  const totalHours = objectives.reduce((sum, obj) => sum + (obj.estimatedHours || 0), 0)
  const completedHours = objectives.reduce((sum, obj) => sum + obj.actualHours, 0)

  return {
    mission,
    objectives,
    teamMembers,
    chatChannels,
    stats: {
      totalObjectives: objectives.length,
      completedObjectives,
      totalHours,
      completedHours,
    },
  }
}

export const updateMission = async (
  _client: ReturnType<typeof createMissionClient>,
  _clientParams: GrpcConfig,
  request: UpdateMissionRequest
): Promise<Mission> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const existingMission = MOCK_MISSIONS[request.missionId]
  if (!existingMission) {
    throw new Error(`Mission with ID ${request.missionId} not found`)
  }

  const updatedMission: Mission = {
    ...existingMission,
    ...(request.name && { name: request.name }),
    ...(request.description && { description: request.description }),
    ...(request.status && { status: request.status }),
    ...(request.progress !== undefined && { progress: request.progress }),
    ...(request.targetDate !== undefined && { targetDate: request.targetDate }),
    ...(request.priority && { priority: request.priority }),
    ...(request.tags && { tags: request.tags }),
    updatedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_MISSIONS[request.missionId] = updatedMission

  return updatedMission
}

export const addObjective = async (
  _client: ReturnType<typeof createMissionClient>,
  _clientParams: GrpcConfig,
  request: AddObjectiveRequest
): Promise<Objective> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const mission = MOCK_MISSIONS[request.missionId]
  if (!mission) {
    throw new Error(`Mission with ID ${request.missionId} not found`)
  }

  const newObjective: Objective = {
    id: `obj-${Date.now()}`,
    title: request.title,
    description: request.description || '',
    status: 'active',
    priority: request.priority || 'medium',
    progress: 0,
    assigneeId: request.assigneeId || 'user-you',
    missionId: request.missionId,
    dueDate: request.dueDate || null,
    startDate: new Date(),
    estimatedHours: request.estimatedHours || null,
    actualHours: 0,
    tags: request.tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_OBJECTIVES[newObjective.id] = newObjective

  return newObjective
}

export const updateObjective = async (
  _client: ReturnType<typeof createMissionClient>,
  _clientParams: GrpcConfig,
  request: UpdateObjectiveRequest
): Promise<Objective> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const existingObjective = MOCK_OBJECTIVES[request.objectiveId]
  if (!existingObjective) {
    throw new Error(`Objective with ID ${request.objectiveId} not found`)
  }

  const updatedObjective: Objective = {
    ...existingObjective,
    ...(request.title && { title: request.title }),
    ...(request.description && { description: request.description }),
    ...(request.status && { status: request.status }),
    ...(request.assigneeId && { assigneeId: request.assigneeId }),
    ...(request.dueDate !== undefined && { dueDate: request.dueDate }),
    ...(request.priority && { priority: request.priority }),
    ...(request.progress !== undefined && { progress: request.progress }),
    ...(request.estimatedHours !== undefined && { estimatedHours: request.estimatedHours }),
    ...(request.actualHours !== undefined && { actualHours: request.actualHours }),
    ...(request.tags && { tags: request.tags }),
    updatedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_OBJECTIVES[request.objectiveId] = updatedObjective

  return updatedObjective
}

export const deleteObjective = async (
  _client: ReturnType<typeof createMissionClient>,
  _clientParams: GrpcConfig,
  request: DeleteObjectiveRequest
): Promise<StandardResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const existingObjective = MOCK_OBJECTIVES[request.objectiveId]
  if (!existingObjective) {
    return {
      success: false,
      message: `Objective with ID ${request.objectiveId} not found`,
    }
  }

  // In real implementation, this would be deleted from backend
  delete MOCK_OBJECTIVES[request.objectiveId]

  return {
    success: true,
    message: 'Objective deleted successfully',
  }
}

export const addTeamMember = async (
  _client: ReturnType<typeof createMissionClient>,
  _clientParams: GrpcConfig,
  request: AddTeamMemberRequest
): Promise<TeamMember> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const mission = MOCK_MISSIONS[request.missionId]
  if (!mission) {
    throw new Error(`Mission with ID ${request.missionId} not found`)
  }

  const newTeamMember: TeamMember = {
    id: `tm-${Date.now()}`,
    userId: request.userId,
    missionId: request.missionId,
    role: request.role || 'Member',
    joinedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  if (!MOCK_TEAM_MEMBERS[request.missionId]) {
    MOCK_TEAM_MEMBERS[request.missionId] = []
  }
  MOCK_TEAM_MEMBERS[request.missionId].push(newTeamMember)

  return newTeamMember
}

export const removeTeamMember = async (
  _client: ReturnType<typeof createMissionClient>,
  _clientParams: GrpcConfig,
  request: RemoveTeamMemberRequest
): Promise<StandardResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const teamMembers = MOCK_TEAM_MEMBERS[request.missionId]
  if (!teamMembers) {
    return {
      success: false,
      message: `Mission with ID ${request.missionId} not found`,
    }
  }

  const memberIndex = teamMembers.findIndex((member) => member.userId === request.userId)
  if (memberIndex === -1) {
    return {
      success: false,
      message: `User ${request.userId} is not a member of mission ${request.missionId}`,
    }
  }

  // In real implementation, this would be deleted from backend
  MOCK_TEAM_MEMBERS[request.missionId].splice(memberIndex, 1)

  return {
    success: true,
    message: 'Team member removed successfully',
  }
}
