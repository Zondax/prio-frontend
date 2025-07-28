import type { TPageableResponse } from '@zondax/stores'
import { TeamRole } from '../../../grpc/src/entities/proto/api/v1/team_pb'

// Re-export types from individual team types
export type { Team, TeamMember } from './team.types'
export { TeamRole }

// Types for team list operations matching gRPC SearchTeamsRequest
export interface SearchTeamsRequest {
  pageRequest?: {
    pageSize?: number
    pageToken?: string
  }
  query?: string
}

// Response structure matching gRPC SearchTeamsResponse
export interface SearchTeamsResponse {
  teams: Array<import('./team.types').Team>
  pageResponse?: {
    nextPageToken: string
    totalItems?: number
  }
}

// Types for searching team members
export interface SearchMembersRequest {
  teamId: string
  pageRequest?: {
    pageSize?: number
    pageToken?: string
  }
  role?: TeamRole
}

export interface SearchMembersResponse {
  members: Array<import('./team.types').TeamMember>
  pageResponse?: {
    nextPageToken: string
    totalItems?: number
  }
}

// Metadata for pagination (for store compatibility)
export interface TeamListMetadata {
  totalCount?: number
  hasMore: boolean
  nextPageToken?: string
}

// Response using the standard TPageableResponse pattern for stores
export interface TeamListResponse extends TPageableResponse<import('./team.types').Team, TeamListMetadata> {}
