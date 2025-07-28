import { createMetadataAwareMethod, type GrpcConfig } from '@mono-grpc'
import type { Empty } from 'google-protobuf/google/protobuf/empty_pb'
import { Struct } from 'google-protobuf/google/protobuf/struct_pb'
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
import { StringValue } from 'google-protobuf/google/protobuf/wrappers_pb'
import { MissionServiceClient } from '../../../grpc/src/entities/proto/api/v1/MissionServiceClientPb'
import {
  AddMissionMemberRequest as AddMissionMemberRequestPb,
  type AddMissionMemberResponse as AddMissionMemberResponsePb,
  CanAccessMissionRequest as CanAccessMissionRequestPb,
  type CanAccessMissionResponse as CanAccessMissionResponsePb,
  CreateMissionRequest as CreateMissionRequestPb,
  type CreateMissionResponse as CreateMissionResponsePb,
  DeleteMissionRequest as DeleteMissionRequestPb,
  GetMissionRequest as GetMissionRequestPb,
  type GetMissionResponse as GetMissionResponsePb,
  MissionMemberRole,
  MissionStatus,
  RemoveMissionMemberRequest as RemoveMissionMemberRequestPb,
  UpdateMissionMemberRoleRequest as UpdateMissionMemberRoleRequestPb,
  type UpdateMissionMemberRoleResponse as UpdateMissionMemberRoleResponsePb,
  UpdateMissionRequest as UpdateMissionRequestPb,
  type UpdateMissionResponse as UpdateMissionResponsePb,
} from '../../../grpc/src/entities/proto/api/v1/mission_pb'
import type {
  AddMissionMemberRequest,
  AddMissionMemberResponse,
  CanAccessMissionRequest,
  CanAccessMissionResponse,
  CreateMissionRequest,
  CreateMissionResponse,
  DeleteMissionRequest,
  GetMissionRequest,
  GetMissionResponse,
  Mission,
  MissionMember,
  RemoveMissionMemberRequest,
  UpdateMissionMemberRoleRequest,
  UpdateMissionMemberRoleResponse,
  UpdateMissionRequest,
  UpdateMissionResponse,
} from './mission.types'

// Re-export types and enums
export { MissionStatus, MissionMemberRole }
export type {
  Mission,
  MissionMember,
  CreateMissionRequest,
  CreateMissionResponse,
  GetMissionRequest,
  GetMissionResponse,
  UpdateMissionRequest,
  UpdateMissionResponse,
  DeleteMissionRequest,
  AddMissionMemberRequest,
  AddMissionMemberResponse,
  UpdateMissionMemberRoleRequest,
  UpdateMissionMemberRoleResponse,
  RemoveMissionMemberRequest,
  CanAccessMissionRequest,
  CanAccessMissionResponse,
}

// Client factory
export const createMissionClient = (cp: GrpcConfig) => {
  return new MissionServiceClient(cp.baseUrl, cp.metadata as any)
}

// Create metadata-aware method wrappers
const createMissionWithAuth = createMetadataAwareMethod<MissionServiceClient, CreateMissionRequestPb, CreateMissionResponsePb>(
  (client, request, metadata) => client.createMission(request, metadata as any)
)

const getMissionWithAuth = createMetadataAwareMethod<MissionServiceClient, GetMissionRequestPb, GetMissionResponsePb>(
  (client, request, metadata) => client.getMission(request, metadata as any)
)

const updateMissionWithAuth = createMetadataAwareMethod<MissionServiceClient, UpdateMissionRequestPb, UpdateMissionResponsePb>(
  (client, request, metadata) => client.updateMission(request, metadata as any)
)

const deleteMissionWithAuth = createMetadataAwareMethod<MissionServiceClient, DeleteMissionRequestPb, Empty>((client, request, metadata) =>
  client.deleteMission(request, metadata as any)
)

const addMissionMemberWithAuth = createMetadataAwareMethod<MissionServiceClient, AddMissionMemberRequestPb, AddMissionMemberResponsePb>(
  (client, request, metadata) => client.addMissionMember(request, metadata as any)
)

const updateMissionMemberRoleWithAuth = createMetadataAwareMethod<
  MissionServiceClient,
  UpdateMissionMemberRoleRequestPb,
  UpdateMissionMemberRoleResponsePb
>((client, request, metadata) => client.updateMissionMemberRole(request, metadata as any))

const removeMissionMemberWithAuth = createMetadataAwareMethod<MissionServiceClient, RemoveMissionMemberRequestPb, Empty>(
  (client, request, metadata) => client.removeMissionMember(request, metadata as any)
)

const canAccessMissionWithAuth = createMetadataAwareMethod<MissionServiceClient, CanAccessMissionRequestPb, CanAccessMissionResponsePb>(
  (client, request, metadata) => client.canAccessMission(request, metadata as any)
)

// Helper functions to create request objects
export const createMissionRequest = (params: CreateMissionRequest): CreateMissionRequestPb => {
  const request = new CreateMissionRequestPb()

  request.setName(params.name)
  request.setDescription(params.description)
  request.setTeamId(params.teamId)

  if (params.startDate) {
    const timestamp = new Timestamp()
    timestamp.fromDate(params.startDate)
    request.setStartDate(timestamp)
  }

  if (params.endDate) {
    const timestamp = new Timestamp()
    timestamp.fromDate(params.endDate)
    request.setEndDate(timestamp)
  }

  if (params.metadata) {
    const struct = Struct.fromJavaScript(params.metadata)
    request.setMetadata(struct)
  }

  return request
}

export const getMissionRequest = (id: string): GetMissionRequestPb => {
  const request = new GetMissionRequestPb()
  request.setId(id)
  return request
}

export const updateMissionRequest = (params: UpdateMissionRequest): UpdateMissionRequestPb => {
  const request = new UpdateMissionRequestPb()

  request.setId(params.id)

  if (params.name !== undefined) {
    const nameValue = new StringValue()
    nameValue.setValue(params.name)
    request.setName(nameValue)
  }

  if (params.description !== undefined) {
    const descValue = new StringValue()
    descValue.setValue(params.description)
    request.setDescription(descValue)
  }

  if (params.status !== undefined) {
    request.setStatus(params.status)
  }

  if (params.startDate) {
    const timestamp = new Timestamp()
    timestamp.fromDate(params.startDate)
    request.setStartDate(timestamp)
  }

  if (params.endDate) {
    const timestamp = new Timestamp()
    timestamp.fromDate(params.endDate)
    request.setEndDate(timestamp)
  }

  if (params.metadata) {
    const struct = Struct.fromJavaScript(params.metadata)
    request.setMetadata(struct)
  }

  return request
}

export const deleteMissionRequest = (id: string): DeleteMissionRequestPb => {
  const request = new DeleteMissionRequestPb()
  request.setId(id)
  return request
}

export const addMissionMemberRequest = (params: AddMissionMemberRequest): AddMissionMemberRequestPb => {
  const request = new AddMissionMemberRequestPb()

  request.setId(params.id)
  request.setUserEmail(params.userEmail)
  request.setRole(params.role)

  return request
}

export const updateMissionMemberRoleRequest = (params: UpdateMissionMemberRoleRequest): UpdateMissionMemberRoleRequestPb => {
  const request = new UpdateMissionMemberRoleRequestPb()

  request.setId(params.id)
  request.setUserEmail(params.userEmail)
  request.setRole(params.role)

  return request
}

export const removeMissionMemberRequest = (params: RemoveMissionMemberRequest): RemoveMissionMemberRequestPb => {
  const request = new RemoveMissionMemberRequestPb()

  request.setId(params.id)
  request.setUserEmail(params.userEmail)

  return request
}

export const canAccessMissionRequest = (params: CanAccessMissionRequest): CanAccessMissionRequestPb => {
  const request = new CanAccessMissionRequestPb()

  request.setId(params.id)
  request.setAction(params.action)

  return request
}

// Helper to convert protobuf Mission to TypeScript interface
const convertMissionFromPb = (missionPb: any): Mission => {
  const startDate = missionPb.getStartDate()
  const endDate = missionPb.getEndDate()
  const createdAt = missionPb.getCreatedAt()
  const updatedAt = missionPb.getUpdatedAt()
  const metadata = missionPb.getMetadata()

  return {
    id: missionPb.getId(),
    name: missionPb.getName(),
    description: missionPb.getDescription(),
    teamId: missionPb.getTeamId(),
    creatorUserId: missionPb.getCreatorUserId(),
    status: missionPb.getStatus(),
    startDate: startDate ? startDate.toDate() : undefined,
    endDate: endDate ? endDate.toDate() : undefined,
    metadata: metadata ? metadata.toJavaScript() : undefined,
    createdAt: createdAt ? createdAt.toDate() : undefined,
    updatedAt: updatedAt ? updatedAt.toDate() : undefined,
  }
}

// Helper to convert protobuf MissionMember to TypeScript interface
const convertMissionMemberFromPb = (memberPb: any): MissionMember => {
  const joinedAt = memberPb.getJoinedAt()

  return {
    userId: memberPb.getUserId(),
    missionId: memberPb.getMissionId(),
    role: memberPb.getRole(),
    joinedAt: joinedAt ? joinedAt.toDate() : undefined,
  }
}

// API functions
export const createMission = async (
  client: ReturnType<typeof createMissionClient>,
  clientParams: GrpcConfig,
  params: CreateMissionRequest
): Promise<CreateMissionResponse> => {
  const request = createMissionRequest(params)
  const response = await createMissionWithAuth(client, clientParams, request)

  const mission = response.getMission()
  return {
    mission: mission ? convertMissionFromPb(mission) : undefined,
  }
}

export const getMission = async (
  client: ReturnType<typeof createMissionClient>,
  clientParams: GrpcConfig,
  id: string
): Promise<GetMissionResponse> => {
  const request = getMissionRequest(id)
  const response = await getMissionWithAuth(client, clientParams, request)

  const mission = response.getMission()
  return {
    mission: mission ? convertMissionFromPb(mission) : undefined,
  }
}

export const updateMission = async (
  client: ReturnType<typeof createMissionClient>,
  clientParams: GrpcConfig,
  params: UpdateMissionRequest
): Promise<UpdateMissionResponse> => {
  const request = updateMissionRequest(params)
  const response = await updateMissionWithAuth(client, clientParams, request)

  const mission = response.getMission()
  return {
    mission: mission ? convertMissionFromPb(mission) : undefined,
  }
}

export const deleteMission = async (
  client: ReturnType<typeof createMissionClient>,
  clientParams: GrpcConfig,
  id: string
): Promise<void> => {
  const request = deleteMissionRequest(id)
  await deleteMissionWithAuth(client, clientParams, request)
}

export const addMissionMember = async (
  client: ReturnType<typeof createMissionClient>,
  clientParams: GrpcConfig,
  params: AddMissionMemberRequest
): Promise<AddMissionMemberResponse> => {
  const request = addMissionMemberRequest(params)
  const response = await addMissionMemberWithAuth(client, clientParams, request)

  const member = response.getMember()
  return {
    member: member ? convertMissionMemberFromPb(member) : undefined,
  }
}

export const updateMissionMemberRole = async (
  client: ReturnType<typeof createMissionClient>,
  clientParams: GrpcConfig,
  params: UpdateMissionMemberRoleRequest
): Promise<UpdateMissionMemberRoleResponse> => {
  const request = updateMissionMemberRoleRequest(params)
  const response = await updateMissionMemberRoleWithAuth(client, clientParams, request)

  const member = response.getMember()
  return {
    member: member ? convertMissionMemberFromPb(member) : undefined,
  }
}

export const removeMissionMember = async (
  client: ReturnType<typeof createMissionClient>,
  clientParams: GrpcConfig,
  params: RemoveMissionMemberRequest
): Promise<void> => {
  const request = removeMissionMemberRequest(params)
  await removeMissionMemberWithAuth(client, clientParams, request)
}

export const canAccessMission = async (
  client: ReturnType<typeof createMissionClient>,
  clientParams: GrpcConfig,
  params: CanAccessMissionRequest
): Promise<CanAccessMissionResponse> => {
  const request = canAccessMissionRequest(params)
  const response = await canAccessMissionWithAuth(client, clientParams, request)

  return {
    canAccess: response.getCanAccess(),
    reason: response.getReason(),
  }
}
