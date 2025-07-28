import { createMetadataAwareMethod, type GrpcConfig } from '@mono-grpc'
import { PageRequest as PageRequestPb } from '../../../grpc/src/entities/proto/api/v1/common_pb'
import type { MissionServiceClient } from '../../../grpc/src/entities/proto/api/v1/MissionServiceClientPb'
import {
  SearchMissionMembersRequest as SearchMissionMembersRequestPb,
  type SearchMissionMembersResponse as SearchMissionMembersResponsePb,
  SearchMissionsRequest as SearchMissionsRequestPb,
  type SearchMissionsResponse as SearchMissionsResponsePb,
} from '../../../grpc/src/entities/proto/api/v1/mission_pb'
import type { createMissionClient } from './mission'
import type { Mission, MissionMember } from './mission.types'
import type {
  MissionListMetadata,
  MissionListResponse,
  SearchMissionMembersRequest,
  SearchMissionMembersResponse,
  SearchMissionsRequest,
  SearchMissionsResponse,
} from './mission-list.types'

// Re-export types for convenience
export type {
  SearchMissionsRequest,
  SearchMissionsResponse,
  SearchMissionMembersRequest,
  SearchMissionMembersResponse,
  MissionListResponse,
  MissionListMetadata,
}

// Create metadata-aware method wrappers
const searchMissionsWithAuth = createMetadataAwareMethod<MissionServiceClient, SearchMissionsRequestPb, SearchMissionsResponsePb>(
  (client, request, metadata) => client.searchMissions(request, metadata as any)
)

const searchMissionMembersWithAuth = createMetadataAwareMethod<
  MissionServiceClient,
  SearchMissionMembersRequestPb,
  SearchMissionMembersResponsePb
>((client, request, metadata) => client.searchMissionMembers(request, metadata as any))

// Helper functions to create request objects
export const searchMissionsRequest = (params: SearchMissionsRequest): SearchMissionsRequestPb => {
  const request = new SearchMissionsRequestPb()

  if (params.query) {
    request.setQuery(params.query)
  }

  if (params.teamId) {
    request.setTeamId(params.teamId)
  }

  if (params.status !== undefined) {
    request.setStatus(params.status)
  }

  if (params.pageRequest) {
    const pageRequest = new PageRequestPb()
    if (params.pageRequest.pageSize) {
      pageRequest.setPageSize(params.pageRequest.pageSize)
    }
    if (params.pageRequest.pageToken) {
      pageRequest.setCursor(params.pageRequest.pageToken)
    }
    request.setPageRequest(pageRequest)
  }

  return request
}

export const searchMissionMembersRequest = (params: SearchMissionMembersRequest): SearchMissionMembersRequestPb => {
  const request = new SearchMissionMembersRequestPb()

  request.setId(params.id)

  if (params.role !== undefined) {
    request.setRole(params.role)
  }

  if (params.pageRequest) {
    const pageRequest = new PageRequestPb()
    if (params.pageRequest.pageSize) {
      pageRequest.setPageSize(params.pageRequest.pageSize)
    }
    if (params.pageRequest.pageToken) {
      pageRequest.setCursor(params.pageRequest.pageToken)
    }
    request.setPageRequest(pageRequest)
  }

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

// Helper to convert protobuf response to TypeScript interface
const convertSearchMissionsResponse = (responsePb: SearchMissionsResponsePb): SearchMissionsResponse => {
  const missionsList = responsePb.getMissionsList()
  const pageResponse = responsePb.getPageResponse()

  return {
    missions: missionsList.map(convertMissionFromPb),
    pageResponse: pageResponse
      ? {
          nextPageToken: pageResponse.getNextCursor(),
          totalItems: pageResponse.getTotalItems(),
        }
      : undefined,
  }
}

const convertSearchMissionMembersResponse = (responsePb: SearchMissionMembersResponsePb): SearchMissionMembersResponse => {
  const membersList = responsePb.getMembersList()
  const pageResponse = responsePb.getPageResponse()

  return {
    members: membersList.map(convertMissionMemberFromPb),
    pageResponse: pageResponse
      ? {
          nextPageToken: pageResponse.getNextCursor(),
          totalItems: pageResponse.getTotalItems(),
        }
      : undefined,
  }
}

// API functions
export const searchMissions = async (
  client: ReturnType<typeof createMissionClient>,
  clientParams: GrpcConfig,
  params: SearchMissionsRequest
): Promise<SearchMissionsResponse> => {
  const request = searchMissionsRequest(params)
  const response = await searchMissionsWithAuth(client, clientParams, request)
  return convertSearchMissionsResponse(response)
}

export const searchMissionMembers = async (
  client: ReturnType<typeof createMissionClient>,
  clientParams: GrpcConfig,
  params: SearchMissionMembersRequest
): Promise<SearchMissionMembersResponse> => {
  const request = searchMissionMembersRequest(params)
  const response = await searchMissionMembersWithAuth(client, clientParams, request)
  return convertSearchMissionMembersResponse(response)
}

// Helper function to convert gRPC response to store-compatible format
export const convertToMissionListResponse = (response: SearchMissionsResponse, _currentData?: Mission[]): MissionListResponse => {
  const hasMore = !!response.pageResponse?.nextPageToken

  return {
    data: response.missions,
    metadata: {
      totalCount: response.pageResponse?.totalItems,
      hasMore,
      nextPageToken: response.pageResponse?.nextPageToken,
    },
    // For pageable store compatibility
    cursor: response.pageResponse?.nextPageToken || '',
  }
}
