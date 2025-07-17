import type { GrpcConfig } from '@mono-grpc'
import { MOCK_PARTICIPANTS_LIST } from './participant-list.mocks'
import type {
  AddParticipantRequest,
  BulkParticipantRequest,
  Participant,
  ParticipantListFilters,
  ParticipantListMetadata,
  ParticipantListResponse,
  StandardResponse,
} from './participant-list.types'

// Re-export types for convenience
export type {
  Participant,
  ParticipantListFilters,
  ParticipantListMetadata,
  ParticipantListResponse,
  AddParticipantRequest,
  BulkParticipantRequest,
  StandardResponse,
}

// Mock client creator - would be replaced with real gRPC client
export const createParticipantListClient = (cp: GrpcConfig) => {
  return {
    // Mock client object that mimics gRPC client interface
    baseUrl: cp.baseUrl,
    metadata: cp.metadata,
  }
}

// Mock API functions for participant list operations
export const getParticipantList = async (
  _client: ReturnType<typeof createParticipantListClient>,
  _clientParams: GrpcConfig,
  filters?: ParticipantListFilters
): Promise<ParticipantListResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  let participants = Object.values(MOCK_PARTICIPANTS_LIST)

  // Apply filters
  if (filters?.role) {
    participants = participants.filter((participant) => participant.role === filters.role)
  }

  // Apply search
  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    participants = participants.filter(
      (participant) =>
        participant.name.toLowerCase().includes(query) ||
        participant.email.toLowerCase().includes(query) ||
        participant.role?.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'name'
  const sortOrder = filters?.sortOrder || 'asc'

  participants.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'email':
        aValue = a.email.toLowerCase()
        bValue = b.email.toLowerCase()
        break
      case 'role':
        aValue = a.role?.toLowerCase() || ''
        bValue = b.role?.toLowerCase() || ''
        break
      case 'createdAt':
        aValue = a.createdAt?.getTime() || 0
        bValue = b.createdAt?.getTime() || 0
        break
      default:
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
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

  const paginatedParticipants = participants.slice(startIndex, endIndex)
  const totalPages = Math.ceil(participants.length / limit)

  // Generate cursor for cursor-based pagination (using last item's ID)
  const nextCursor = paginatedParticipants.length > 0 ? paginatedParticipants[paginatedParticipants.length - 1].id : undefined

  return {
    data: paginatedParticipants,
    metadata: {
      totalCount: participants.length,
      hasMore: endIndex < participants.length,
      currentPage: page,
      totalPages,
      pageSize: limit,
    },
    cursor: nextCursor || '',
  }
}

export const addParticipant = async (
  _client: ReturnType<typeof createParticipantListClient>,
  _clientParams: GrpcConfig,
  data: AddParticipantRequest
): Promise<Participant> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const newParticipant: Participant = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    avatar: data.avatar,
    role: data.role,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_PARTICIPANTS_LIST[newParticipant.id] = newParticipant

  return newParticipant
}

export const bulkParticipantAction = async (
  _client: ReturnType<typeof createParticipantListClient>,
  _clientParams: GrpcConfig,
  data: BulkParticipantRequest
): Promise<StandardResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const affectedParticipants = data.participantIds.filter((id) => MOCK_PARTICIPANTS_LIST[id])

  if (affectedParticipants.length === 0) {
    return {
      success: false,
      message: 'No valid participants found for the given IDs',
    }
  }

  switch (data.action) {
    case 'delete':
      for (const id of affectedParticipants) {
        delete MOCK_PARTICIPANTS_LIST[id]
      }
      return {
        success: true,
        message: `Successfully deleted ${affectedParticipants.length} participant(s)`,
      }

    case 'update_role':
      if (!data.role) {
        return {
          success: false,
          message: 'Role is required for update_role action',
        }
      }
      for (const id of affectedParticipants) {
        MOCK_PARTICIPANTS_LIST[id] = {
          ...MOCK_PARTICIPANTS_LIST[id],
          role: data.role,
          updatedAt: new Date(),
        }
      }
      return {
        success: true,
        message: `Successfully updated role for ${affectedParticipants.length} participant(s)`,
      }

    default:
      return {
        success: false,
        message: 'Invalid action specified',
      }
  }
}
