// Types that match gRPC protobuf definitions for teams
import { TeamRole } from '../../../grpc/src/entities/proto/api/v1/team_pb'

// Re-export enum from protobuf
export { TeamRole }

// TypeScript interfaces matching protobuf messages
export interface Team {
  id: string
  name: string
  image: string
  creatorUserId: string
  metadata?: Record<string, any>
  type: string
  description: string
  plan: string
  createdAt?: Date
  updatedAt?: Date
}

export interface TeamMember {
  userId: string
  teamId: string
  role: TeamRole
  createdAt?: Date
}

// Request/Response types for individual team operations
export interface CreateTeamRequest {
  name: string
  image?: string
  metadata?: Record<string, any>
  description?: string
}

export interface CreateTeamResponse {
  team?: Team
}

export interface GetTeamRequest {
  id: string
}

export interface GetTeamResponse {
  team?: Team
}

export interface UpdateTeamRequest {
  id: string
  name?: string
  image?: string
  metadata?: Record<string, any>
  description?: string
}

export interface UpdateTeamResponse {
  team?: Team
}

export interface DeleteTeamRequest {
  id: string
}

// DeleteTeam returns void

export interface AddMemberRequest {
  teamId: string
  userId: string
  role: TeamRole
}

export interface AddMemberResponse {
  member?: TeamMember
}

export interface UpdateMemberRoleRequest {
  teamId: string
  userId: string
  role: TeamRole
}

export interface UpdateMemberRoleResponse {
  member?: TeamMember
}

export interface RemoveMemberRequest {
  teamId: string
  userId: string
}

// RemoveMember returns void

export interface CanAccessTeamRequest {
  id: string
  action: string
}

export interface CanAccessTeamResponse {
  canAccess: boolean
  reason: string
}
