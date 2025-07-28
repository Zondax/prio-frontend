// Types that match gRPC protobuf definitions for missions
import { MissionMemberRole, MissionStatus } from '../../../grpc/src/entities/proto/api/v1/mission_pb'

// Re-export enums from protobuf
export { MissionStatus, MissionMemberRole }

// TypeScript interfaces matching protobuf messages
export interface Mission {
  id: string
  name: string
  description: string
  teamId: string
  creatorUserId: string
  status: MissionStatus
  startDate?: Date
  endDate?: Date
  metadata?: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

export interface MissionMember {
  userId: string
  missionId: string
  role: MissionMemberRole
  joinedAt?: Date
}

// Request/Response types for individual mission operations
export interface CreateMissionRequest {
  name: string
  description: string
  teamId: string
  startDate?: Date
  endDate?: Date
  metadata?: Record<string, any>
}

export interface CreateMissionResponse {
  mission?: Mission
}

export interface GetMissionRequest {
  id: string
}

export interface GetMissionResponse {
  mission?: Mission
}

export interface UpdateMissionRequest {
  id: string
  name?: string
  description?: string
  status?: MissionStatus
  startDate?: Date
  endDate?: Date
  metadata?: Record<string, any>
}

export interface UpdateMissionResponse {
  mission?: Mission
}

export interface DeleteMissionRequest {
  id: string
}

export interface AddMissionMemberRequest {
  id: string
  userEmail: string
  role: MissionMemberRole
}

export interface AddMissionMemberResponse {
  member?: MissionMember
}

export interface UpdateMissionMemberRoleRequest {
  id: string
  userEmail: string
  role: MissionMemberRole
}

export interface UpdateMissionMemberRoleResponse {
  member?: MissionMember
}

export interface RemoveMissionMemberRequest {
  id: string
  userEmail: string
}

export interface CanAccessMissionRequest {
  id: string
  action: string
}

export interface CanAccessMissionResponse {
  canAccess: boolean
  reason: string
}
