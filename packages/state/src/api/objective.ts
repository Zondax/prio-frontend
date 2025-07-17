import type { GrpcConfig } from '@mono-grpc'
import { MOCK_OBJECTIVES } from './objective.mocks'
import type { DeleteObjectiveRequest, GetObjectiveRequest, Objective, StandardResponse, UpdateObjectiveRequest } from './objective.types'

// Re-export types for convenience
export type { Objective, GetObjectiveRequest, UpdateObjectiveRequest, DeleteObjectiveRequest, StandardResponse }

// Mock client creator - would be replaced with real gRPC client
export const createObjectiveClient = (cp: GrpcConfig) => {
  return {
    // Mock client object that mimics gRPC client interface
    baseUrl: cp.baseUrl,
    metadata: cp.metadata,
  }
}

// Mock API functions that follow the same pattern
export const getObjective = async (
  _client: ReturnType<typeof createObjectiveClient>,
  _clientParams: GrpcConfig,
  request: GetObjectiveRequest
): Promise<Objective> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const objective = MOCK_OBJECTIVES[request.objectiveId]
  if (!objective) {
    throw new Error(`Objective with ID ${request.objectiveId} not found`)
  }

  return objective
}

export const updateObjective = async (
  _client: ReturnType<typeof createObjectiveClient>,
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
    ...(request.priority && { priority: request.priority }),
    ...(request.progress !== undefined && { progress: request.progress }),
    ...(request.assigneeId && { assigneeId: request.assigneeId }),
    ...(request.dueDate !== undefined && { dueDate: request.dueDate }),
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
  _client: ReturnType<typeof createObjectiveClient>,
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
