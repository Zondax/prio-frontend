import { createMetadataAwareMethod, type GrpcConfig } from '@mono-grpc'
import { PageRequest as PageRequestPb } from '../../../grpc/src/entities/proto/api/v1/common_pb'
import type { TeamServiceClient } from '../../../grpc/src/entities/proto/api/v1/TeamServiceClientPb'
import {
  SearchMembersRequest as SearchMembersRequestPb,
  type SearchMembersResponse as SearchMembersResponsePb,
  SearchTeamsRequest as SearchTeamsRequestPb,
  type SearchTeamsResponse as SearchTeamsResponsePb,
} from '../../../grpc/src/entities/proto/api/v1/team_pb'
import { convertTeamFromPb, convertTeamMemberFromPb, type createTeamClient } from './team'
import type { Team } from './team.types'
import type {
  SearchMembersRequest,
  SearchMembersResponse,
  SearchTeamsRequest,
  SearchTeamsResponse,
  TeamListMetadata,
  TeamListResponse,
} from './team-list.types'

// Re-export types for convenience
export type { SearchTeamsRequest, SearchTeamsResponse, SearchMembersRequest, SearchMembersResponse, TeamListResponse, TeamListMetadata }

// Create metadata-aware method wrappers
const searchTeamsWithAuth = createMetadataAwareMethod<TeamServiceClient, SearchTeamsRequestPb, SearchTeamsResponsePb>(
  (client, request, metadata) => client.searchTeams(request, metadata as any)
)

const searchMembersWithAuth = createMetadataAwareMethod<TeamServiceClient, SearchMembersRequestPb, SearchMembersResponsePb>(
  (client, request, metadata) => client.searchMembers(request, metadata as any)
)

// Helper functions to create request objects
export const searchTeamsRequest = (params: SearchTeamsRequest): SearchTeamsRequestPb => {
  const request = new SearchTeamsRequestPb()

  if (params.query) {
    request.setQuery(params.query)
  }

  if (params.pageRequest) {
    const pageRequest = new PageRequestPb()
    if (params.pageRequest.pageSize) {
      pageRequest.setPageSize(params.pageRequest.pageSize)
    }
    if (params.pageRequest.pageToken) {
      pageRequest.setPageToken(params.pageRequest.pageToken)
    }
    request.setPageRequest(pageRequest)
  }

  return request
}

export const searchMembersRequest = (params: SearchMembersRequest): SearchMembersRequestPb => {
  const request = new SearchMembersRequestPb()

  request.setTeamId(params.teamId)

  if (params.role !== undefined) {
    request.setRole(params.role)
  }

  if (params.pageRequest) {
    const pageRequest = new PageRequestPb()
    if (params.pageRequest.pageSize) {
      pageRequest.setPageSize(params.pageRequest.pageSize)
    }
    if (params.pageRequest.pageToken) {
      pageRequest.setPageToken(params.pageRequest.pageToken)
    }
    request.setPageRequest(pageRequest)
  }

  return request
}

// Helper to convert protobuf response to TypeScript interface
const convertSearchTeamsResponse = (responsePb: SearchTeamsResponsePb): SearchTeamsResponse => {
  const teamsList = responsePb.getTeamsList()
  const pageResponse = responsePb.getPageResponse()

  return {
    teams: teamsList.map(convertTeamFromPb),
    pageResponse: pageResponse
      ? {
          nextPageToken: pageResponse.getNextPageToken(),
          totalItems: pageResponse.getTotalItems(),
        }
      : undefined,
  }
}

const convertSearchMembersResponse = (responsePb: SearchMembersResponsePb): SearchMembersResponse => {
  const membersList = responsePb.getMembersList()
  const pageResponse = responsePb.getPageResponse()

  return {
    members: membersList.map(convertTeamMemberFromPb),
    pageResponse: pageResponse
      ? {
          nextPageToken: pageResponse.getNextPageToken(),
          totalItems: pageResponse.getTotalItems(),
        }
      : undefined,
  }
}

// API functions
export const searchTeams = async (
  client: ReturnType<typeof createTeamClient>,
  clientParams: GrpcConfig,
  params: SearchTeamsRequest
): Promise<SearchTeamsResponse> => {
  const request = searchTeamsRequest(params)
  const response = await searchTeamsWithAuth(client, clientParams, request)
  return convertSearchTeamsResponse(response)
}

export const searchMembers = async (
  client: ReturnType<typeof createTeamClient>,
  clientParams: GrpcConfig,
  params: SearchMembersRequest
): Promise<SearchMembersResponse> => {
  const request = searchMembersRequest(params)
  const response = await searchMembersWithAuth(client, clientParams, request)
  return convertSearchMembersResponse(response)
}

// Helper function to convert gRPC response to store-compatible format
export const convertToTeamListResponse = (response: SearchTeamsResponse, _currentData?: Team[]): TeamListResponse => {
  const hasMore = !!response.pageResponse?.nextPageToken

  return {
    data: response.teams,
    metadata: {
      totalCount: response.pageResponse?.totalItems,
      hasMore,
      nextPageToken: response.pageResponse?.nextPageToken,
    },
    // For pageable store compatibility
    append: (existingData: Team[]) => [...existingData, ...response.teams],
    cursor: response.pageResponse?.nextPageToken || '',
  }
}
