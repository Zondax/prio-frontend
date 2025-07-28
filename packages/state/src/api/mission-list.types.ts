import type { TPageableResponse } from '@zondax/stores'
import { MissionMemberRole, MissionStatus } from '../../../grpc/src/entities/proto/api/v1/mission_pb'

// Re-export types from individual mission types
export type { Mission, MissionMember } from './mission.types'
export { MissionStatus, MissionMemberRole }

// Types for mission list operations matching gRPC SearchMissionsRequest
export interface SearchMissionsRequest {
  pageRequest?: {
    pageSize?: number
    pageToken?: string
  }
  query?: string
  teamId?: string
  status?: MissionStatus
}

// Response structure matching gRPC SearchMissionsResponse
export interface SearchMissionsResponse {
  missions: Array<import('./mission.types').Mission>
  pageResponse?: {
    nextPageToken: string
    totalItems?: number
  }
}

// Types for searching mission members
export interface SearchMissionMembersRequest {
  id: string
  pageRequest?: {
    pageSize?: number
    pageToken?: string
  }
  role?: MissionMemberRole
}

export interface SearchMissionMembersResponse {
  members: Array<import('./mission.types').MissionMember>
  pageResponse?: {
    nextPageToken: string
    totalItems?: number
  }
}

// Metadata for pagination (for store compatibility)
export interface MissionListMetadata {
  totalCount?: number
  hasMore: boolean
  nextPageToken?: string
}

// Response using the standard TPageableResponse pattern for stores
export interface MissionListResponse extends TPageableResponse<import('./mission.types').Mission, MissionListMetadata> {}
