import { createMetadataAwareMethod, type GrpcConfig } from '@mono-grpc'
import { Struct } from 'google-protobuf/google/protobuf/struct_pb'
import { TeamServiceClient } from '../../../grpc/src/entities/proto/api/v1/TeamServiceClientPb'
import {
  AddMemberRequest as AddMemberRequestPb,
  type AddMemberResponse as AddMemberResponsePb,
  CanAccessTeamRequest as CanAccessTeamRequestPb,
  type CanAccessTeamResponse as CanAccessTeamResponsePb,
  CreateTeamRequest as CreateTeamRequestPb,
  type CreateTeamResponse as CreateTeamResponsePb,
  DeleteTeamRequest as DeleteTeamRequestPb,
  type DeleteTeamResponse as DeleteTeamResponsePb,
  GetTeamRequest as GetTeamRequestPb,
  type GetTeamResponse as GetTeamResponsePb,
  RemoveMemberRequest as RemoveMemberRequestPb,
  type RemoveMemberResponse as RemoveMemberResponsePb,
  TeamRole,
  UpdateMemberRoleRequest as UpdateMemberRoleRequestPb,
  type UpdateMemberRoleResponse as UpdateMemberRoleResponsePb,
  UpdateTeamRequest as UpdateTeamRequestPb,
  type UpdateTeamResponse as UpdateTeamResponsePb,
} from '../../../grpc/src/entities/proto/api/v1/team_pb'
import type {
  AddMemberRequest,
  AddMemberResponse,
  CanAccessTeamRequest,
  CanAccessTeamResponse,
  CreateTeamRequest,
  CreateTeamResponse,
  DeleteTeamRequest,
  GetTeamRequest,
  GetTeamResponse,
  RemoveMemberRequest,
  Team,
  TeamMember,
  UpdateMemberRoleRequest,
  UpdateMemberRoleResponse,
  UpdateTeamRequest,
  UpdateTeamResponse,
} from './team.types'

// Re-export types and enums
export { TeamRole }
export type {
  Team,
  TeamMember,
  CreateTeamRequest,
  CreateTeamResponse,
  GetTeamRequest,
  GetTeamResponse,
  UpdateTeamRequest,
  UpdateTeamResponse,
  DeleteTeamRequest,
  AddMemberRequest,
  AddMemberResponse,
  UpdateMemberRoleRequest,
  UpdateMemberRoleResponse,
  RemoveMemberRequest,
  CanAccessTeamRequest,
  CanAccessTeamResponse,
}

// Client factory
export const createTeamClient = (cp: GrpcConfig) => {
  return new TeamServiceClient(cp.baseUrl, cp.metadata as any)
}

// Create metadata-aware method wrappers
const createTeamWithAuth = createMetadataAwareMethod<TeamServiceClient, CreateTeamRequestPb, CreateTeamResponsePb>(
  (client, request, metadata) => client.createTeam(request, metadata as any)
)

const getTeamWithAuth = createMetadataAwareMethod<TeamServiceClient, GetTeamRequestPb, GetTeamResponsePb>((client, request, metadata) =>
  client.getTeam(request, metadata as any)
)

const updateTeamWithAuth = createMetadataAwareMethod<TeamServiceClient, UpdateTeamRequestPb, UpdateTeamResponsePb>(
  (client, request, metadata) => client.updateTeam(request, metadata as any)
)

const deleteTeamWithAuth = createMetadataAwareMethod<TeamServiceClient, DeleteTeamRequestPb, DeleteTeamResponsePb>(
  (client, request, metadata) => client.deleteTeam(request, metadata as any)
)

const addMemberWithAuth = createMetadataAwareMethod<TeamServiceClient, AddMemberRequestPb, AddMemberResponsePb>(
  (client, request, metadata) => client.addMember(request, metadata as any)
)

const updateMemberRoleWithAuth = createMetadataAwareMethod<TeamServiceClient, UpdateMemberRoleRequestPb, UpdateMemberRoleResponsePb>(
  (client, request, metadata) => client.updateMemberRole(request, metadata as any)
)

const removeMemberWithAuth = createMetadataAwareMethod<TeamServiceClient, RemoveMemberRequestPb, RemoveMemberResponsePb>(
  (client, request, metadata) => client.removeMember(request, metadata as any)
)

const canAccessTeamWithAuth = createMetadataAwareMethod<TeamServiceClient, CanAccessTeamRequestPb, CanAccessTeamResponsePb>(
  (client, request, metadata) => client.canAccessTeam(request, metadata as any)
)

// Helper functions to create request objects
export const createTeamRequest = (params: CreateTeamRequest): CreateTeamRequestPb => {
  const request = new CreateTeamRequestPb()

  request.setName(params.name)

  if (params.image) {
    request.setImage(params.image)
  }

  if (params.description) {
    request.setDescription(params.description)
  }

  if (params.metadata) {
    const struct = Struct.fromJavaScript(params.metadata)
    request.setMetadata(struct)
  }

  return request
}

export const getTeamRequest = (id: string): GetTeamRequestPb => {
  const request = new GetTeamRequestPb()
  request.setId(id)
  return request
}

export const updateTeamRequest = (params: UpdateTeamRequest): UpdateTeamRequestPb => {
  const request = new UpdateTeamRequestPb()

  request.setId(params.id)

  if (params.name) {
    request.setName(params.name)
  }

  if (params.image) {
    request.setImage(params.image)
  }

  if (params.description) {
    request.setDescription(params.description)
  }

  if (params.metadata) {
    const struct = Struct.fromJavaScript(params.metadata)
    request.setMetadata(struct)
  }

  return request
}

export const deleteTeamRequest = (id: string): DeleteTeamRequestPb => {
  const request = new DeleteTeamRequestPb()
  request.setId(id)
  return request
}

export const addMemberRequest = (params: AddMemberRequest): AddMemberRequestPb => {
  const request = new AddMemberRequestPb()

  request.setTeamId(params.teamId)
  request.setUserId(params.userId)
  request.setRole(params.role)

  return request
}

export const updateMemberRoleRequest = (params: UpdateMemberRoleRequest): UpdateMemberRoleRequestPb => {
  const request = new UpdateMemberRoleRequestPb()

  request.setTeamId(params.teamId)
  request.setUserId(params.userId)
  request.setRole(params.role)

  return request
}

export const removeMemberRequest = (params: RemoveMemberRequest): RemoveMemberRequestPb => {
  const request = new RemoveMemberRequestPb()

  request.setTeamId(params.teamId)
  request.setUserId(params.userId)

  return request
}

export const canAccessTeamRequest = (params: CanAccessTeamRequest): CanAccessTeamRequestPb => {
  const request = new CanAccessTeamRequestPb()

  request.setId(params.id)
  request.setAction(params.action)

  return request
}

// Helper to convert protobuf Team to TypeScript interface
export const convertTeamFromPb = (teamPb: any): Team => {
  const createdAt = teamPb.getCreatedAt()
  const updatedAt = teamPb.getUpdatedAt()
  const metadata = teamPb.getMetadata()

  return {
    id: teamPb.getId(),
    name: teamPb.getName(),
    image: teamPb.getImage(),
    creatorUserId: teamPb.getCreatorUserId(),
    metadata: metadata ? metadata.toJavaScript() : undefined,
    type: teamPb.getType(),
    description: teamPb.getDescription(),
    plan: teamPb.getPlan(),
    createdAt: createdAt ? createdAt.toDate() : undefined,
    updatedAt: updatedAt ? updatedAt.toDate() : undefined,
  }
}

// Helper to convert protobuf TeamMember to TypeScript interface
export const convertTeamMemberFromPb = (memberPb: any): TeamMember => {
  const createdAt = memberPb.getCreatedAt()

  return {
    userId: memberPb.getUserId(),
    teamId: memberPb.getTeamId(),
    role: memberPb.getRole(),
    createdAt: createdAt ? createdAt.toDate() : undefined,
  }
}

// API functions
export const createTeam = async (
  client: ReturnType<typeof createTeamClient>,
  clientParams: GrpcConfig,
  params: CreateTeamRequest
): Promise<CreateTeamResponse> => {
  const request = createTeamRequest(params)
  const response = await createTeamWithAuth(client, clientParams, request)

  const team = response.getTeam()
  return {
    team: team ? convertTeamFromPb(team) : undefined,
  }
}

export const getTeam = async (
  client: ReturnType<typeof createTeamClient>,
  clientParams: GrpcConfig,
  id: string
): Promise<GetTeamResponse> => {
  const request = getTeamRequest(id)
  const response = await getTeamWithAuth(client, clientParams, request)

  const team = response.getTeam()
  return {
    team: team ? convertTeamFromPb(team) : undefined,
  }
}

export const updateTeam = async (
  client: ReturnType<typeof createTeamClient>,
  clientParams: GrpcConfig,
  params: UpdateTeamRequest
): Promise<UpdateTeamResponse> => {
  const request = updateTeamRequest(params)
  const response = await updateTeamWithAuth(client, clientParams, request)

  const team = response.getTeam()
  return {
    team: team ? convertTeamFromPb(team) : undefined,
  }
}

export const deleteTeam = async (client: ReturnType<typeof createTeamClient>, clientParams: GrpcConfig, id: string): Promise<void> => {
  const request = deleteTeamRequest(id)
  await deleteTeamWithAuth(client, clientParams, request)
}

export const addMember = async (
  client: ReturnType<typeof createTeamClient>,
  clientParams: GrpcConfig,
  params: AddMemberRequest
): Promise<AddMemberResponse> => {
  const request = addMemberRequest(params)
  const response = await addMemberWithAuth(client, clientParams, request)

  const member = response.getMember()
  return {
    member: member ? convertTeamMemberFromPb(member) : undefined,
  }
}

export const updateMemberRole = async (
  client: ReturnType<typeof createTeamClient>,
  clientParams: GrpcConfig,
  params: UpdateMemberRoleRequest
): Promise<UpdateMemberRoleResponse> => {
  const request = updateMemberRoleRequest(params)
  const response = await updateMemberRoleWithAuth(client, clientParams, request)

  const member = response.getMember()
  return {
    member: member ? convertTeamMemberFromPb(member) : undefined,
  }
}

export const removeMember = async (
  client: ReturnType<typeof createTeamClient>,
  clientParams: GrpcConfig,
  params: RemoveMemberRequest
): Promise<void> => {
  const request = removeMemberRequest(params)
  await removeMemberWithAuth(client, clientParams, request)
}

export const canAccessTeam = async (
  client: ReturnType<typeof createTeamClient>,
  clientParams: GrpcConfig,
  params: CanAccessTeamRequest
): Promise<CanAccessTeamResponse> => {
  const request = canAccessTeamRequest(params)
  const response = await canAccessTeamWithAuth(client, clientParams, request)

  return {
    canAccess: response.getCanAccess(),
    reason: response.getReason(),
  }
}
