import type { GrpcConfig } from '@mono-grpc'
import { MOCK_PARTICIPANTS } from './participant.mocks'
import type {
  DeleteParticipantRequest,
  GetParticipantRequest,
  Participant,
  StandardResponse,
  UpdateParticipantRequest,
} from './participant.types'

// Re-export types for convenience
export type { Participant, GetParticipantRequest, UpdateParticipantRequest, DeleteParticipantRequest, StandardResponse }

// Mock client creator - would be replaced with real gRPC client
export const createParticipantClient = (cp: GrpcConfig) => {
  return {
    // Mock client object that mimics gRPC client interface
    baseUrl: cp.baseUrl,
    metadata: cp.metadata,
  }
}

// Mock API functions for individual participant operations
export const getParticipant = async (
  _client: ReturnType<typeof createParticipantClient>,
  _clientParams: GrpcConfig,
  data: GetParticipantRequest
): Promise<Participant> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const participant = MOCK_PARTICIPANTS[data.participantId]
  if (!participant) {
    throw new Error(`Participant with ID ${data.participantId} not found`)
  }

  return participant
}

export const updateParticipant = async (
  _client: ReturnType<typeof createParticipantClient>,
  _clientParams: GrpcConfig,
  data: UpdateParticipantRequest
): Promise<Participant> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const existingParticipant = MOCK_PARTICIPANTS[data.participantId]
  if (!existingParticipant) {
    throw new Error(`Participant with ID ${data.participantId} not found`)
  }

  const updatedParticipant: Participant = {
    ...existingParticipant,
    ...(data.name && { name: data.name }),
    ...(data.email && { email: data.email }),
    ...(data.avatar !== undefined && { avatar: data.avatar }),
    ...(data.role !== undefined && { role: data.role }),
    updatedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_PARTICIPANTS[data.participantId] = updatedParticipant

  return updatedParticipant
}

export const deleteParticipant = async (
  _client: ReturnType<typeof createParticipantClient>,
  _clientParams: GrpcConfig,
  data: DeleteParticipantRequest
): Promise<StandardResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const existingParticipant = MOCK_PARTICIPANTS[data.participantId]
  if (!existingParticipant) {
    return {
      success: false,
      message: `Participant with ID ${data.participantId} not found`,
    }
  }

  // In real implementation, this would be deleted from backend
  delete MOCK_PARTICIPANTS[data.participantId]

  return {
    success: true,
    message: 'Participant deleted successfully',
  }
}
