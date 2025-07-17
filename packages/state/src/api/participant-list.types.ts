import type { TPageableResponse } from '@zondax/stores'

// Import the individual participant type
export type { Participant } from './participant.types'

// Filters for querying participant lists
export interface ParticipantListFilters {
  searchQuery?: string
  role?: string
  sortBy?: 'name' | 'email' | 'role' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Metadata for participant list responses
export interface ParticipantListMetadata {
  totalCount: number
  hasMore: boolean
  currentPage: number
  totalPages: number
  pageSize: number
}

// Response structure for participant list
export interface ParticipantListResponse extends TPageableResponse<import('./participant.types').Participant, ParticipantListMetadata> {}

// For adding new participants to the list
export interface AddParticipantRequest {
  name: string
  email: string
  avatar?: string
  role?: string
}

// For bulk operations on participants
export interface BulkParticipantRequest {
  participantIds: string[]
  action: 'delete' | 'update_role'
  role?: string // used when action is 'update_role'
}

// Standard response for operations
export interface StandardResponse {
  success: boolean
  message: string
}
