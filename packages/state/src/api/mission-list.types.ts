import type { Mission } from './mission.types'

// Re-export the Mission type
export type { Mission }

// Types for mission list operations
export interface MissionListFilters {
  status?: 'active' | 'planning' | 'completed'
  type?: 'individual' | 'team'
  organizationId?: string
  participantId?: string
  // Pagination for infinite scroll
  page?: number
  limit?: number
  // Cursor-based pagination (alternative to page-based)
  cursor?: string
  // Search and sorting
  searchQuery?: string
  sortBy?: 'name' | 'progress' | 'startDate' | 'targetDate' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// Metadata for pagination
export interface MissionListMetadata {
  totalCount: number
  hasMore: boolean
  currentPage: number
  totalPages: number
  pageSize: number
}

// Response using the standard TPageableResponse pattern
export interface MissionListResponse {
  data: Mission[]
  metadata: MissionListMetadata
  cursor: string
}

export interface CreateMissionRequest {
  name: string
  description?: string
  type: 'individual' | 'team'
  organizationId?: string
  priority?: 'high' | 'medium' | 'low'
  targetDate?: Date | null
  participantIds?: string[]
  tags?: string[]
}

export interface UpdateMissionStatusRequest {
  missionId: string
  status?: 'active' | 'planning' | 'completed'
  progress?: number
}

export interface DeleteMissionRequest {
  missionId: string
}

export interface StandardResponse {
  success: boolean
  message: string
}
