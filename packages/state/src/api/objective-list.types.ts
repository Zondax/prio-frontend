import type { Objective } from './objective.types'

// Re-export the Objective type
export type { Objective }

// Types for objective list operations
export interface ObjectiveListFilters {
  missionId?: string
  status?: 'active' | 'in-progress' | 'completed' | 'pending'
  priority?: 'high' | 'medium' | 'low'
  assigneeId?: string
  // Pagination for infinite scroll
  page?: number
  limit?: number
  // Cursor-based pagination (alternative to page-based)
  cursor?: string
  // Search and sorting
  searchQuery?: string
  sortBy?: 'title' | 'progress' | 'dueDate' | 'startDate' | 'createdAt' | 'priority'
  sortOrder?: 'asc' | 'desc'
}

// Metadata for pagination
export interface ObjectiveListMetadata {
  totalCount: number
  hasMore: boolean
  currentPage: number
  totalPages: number
  pageSize: number
}

// Response using the standard TPageableResponse pattern
export interface ObjectiveListResponse {
  data: Objective[]
  metadata: ObjectiveListMetadata
  cursor: string
}

export interface CreateObjectiveRequest {
  missionId: string
  title: string
  description?: string
  assigneeId?: string
  priority?: 'high' | 'medium' | 'low'
  dueDate?: Date | null
  estimatedHours?: number | null
  tags?: string[]
}

export interface UpdateObjectiveStatusRequest {
  objectiveId: string
  status?: 'active' | 'in-progress' | 'completed' | 'pending'
  progress?: number
  actualHours?: number
}

export interface DeleteObjectiveRequest {
  objectiveId: string
}

export interface StandardResponse {
  success: boolean
  message: string
}
