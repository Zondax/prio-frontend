import type { GrpcConfig } from '@mono-grpc'
import { createBackendListStore, createSimpleStore } from '@zondax/stores'

import {
  type AddMemberRequest,
  type AddMemberResponse,
  addMember,
  type CanAccessTeamRequest,
  type CanAccessTeamResponse,
  type CreateTeamRequest,
  type CreateTeamResponse,
  canAccessTeam,
  createTeam,
  createTeamClient,
  deleteTeam,
  type GetTeamResponse,
  getTeam,
  type RemoveMemberRequest,
  removeMember,
  type Team,
  type TeamMember,
  type UpdateMemberRoleRequest,
  type UpdateMemberRoleResponse,
  type UpdateTeamRequest,
  type UpdateTeamResponse,
  updateMemberRole,
  updateTeam,
} from '../api/team'

import { convertToTeamListResponse, type SearchMembersRequest, type SearchTeamsRequest, searchMembers, searchTeams } from '../api/team-list'

// Store for creating a new team
export const useCreateTeamStore = createSimpleStore<GrpcConfig, ReturnType<typeof createTeamClient>, CreateTeamRequest, CreateTeamResponse>(
  {
    createClient: createTeamClient,
    method: async (client, clientParams, input) => {
      return await createTeam(client, clientParams, input)
    },
  }
)

// Store for getting a single team
export const useGetTeamStore = createSimpleStore<GrpcConfig, ReturnType<typeof createTeamClient>, string, GetTeamResponse>({
  createClient: createTeamClient,
  method: async (client, clientParams, teamId) => {
    return await getTeam(client, clientParams, teamId)
  },
})

// Store for updating teams
export const useUpdateTeamStore = createSimpleStore<GrpcConfig, ReturnType<typeof createTeamClient>, UpdateTeamRequest, UpdateTeamResponse>(
  {
    createClient: createTeamClient,
    method: async (client, clientParams, input) => {
      return await updateTeam(client, clientParams, input)
    },
  }
)

// Store for deleting teams
export const useDeleteTeamStore = createSimpleStore<GrpcConfig, ReturnType<typeof createTeamClient>, string, void>({
  createClient: createTeamClient,
  method: async (client, clientParams, teamId) => {
    return await deleteTeam(client, clientParams, teamId)
  },
})

// Store for searching teams (pageable)
export const useSearchTeamsStore = createBackendListStore<GrpcConfig, ReturnType<typeof createTeamClient>, Team, SearchTeamsRequest>({
  createClient: createTeamClient,
  fetchData: async (client, clientParams, queryParams) => {
    const input: SearchTeamsRequest = queryParams as SearchTeamsRequest
    const response = await searchTeams(client, clientParams, input)
    const listResponse = convertToTeamListResponse(response)
    return {
      items: listResponse.data,
      pageResponse: {
        nextPageToken: listResponse.metadata?.nextPageToken,
        totalItems: listResponse.metadata?.totalCount,
      },
    }
  },
  itemIdExtractor: (team) => team.id,
  defaultPageSize: 20,
})

// Store for adding team members
export const useAddMemberStore = createSimpleStore<GrpcConfig, ReturnType<typeof createTeamClient>, AddMemberRequest, AddMemberResponse>({
  createClient: createTeamClient,
  method: async (client, clientParams, input) => {
    return await addMember(client, clientParams, input)
  },
})

// Store for updating team member role
export const useUpdateMemberRoleStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createTeamClient>,
  UpdateMemberRoleRequest,
  UpdateMemberRoleResponse
>({
  createClient: createTeamClient,
  method: async (client, clientParams, input) => {
    return await updateMemberRole(client, clientParams, input)
  },
})

// Store for removing team members
export const useRemoveMemberStore = createSimpleStore<GrpcConfig, ReturnType<typeof createTeamClient>, RemoveMemberRequest, void>({
  createClient: createTeamClient,
  method: async (client, clientParams, input) => {
    return await removeMember(client, clientParams, input)
  },
})

// Store for searching team members (pageable)
export const useSearchMembersStore = createBackendListStore<
  GrpcConfig,
  ReturnType<typeof createTeamClient>,
  TeamMember,
  SearchMembersRequest
>({
  createClient: createTeamClient,
  fetchData: async (client, clientParams, queryParams) => {
    const input: SearchMembersRequest = queryParams as SearchMembersRequest
    const response = await searchMembers(client, clientParams, input)
    return {
      items: response.members,
      pageResponse: response.pageResponse,
    }
  },
  itemIdExtractor: (member) => `${member.teamId}-${member.userId}`,
  defaultPageSize: 20,
})

// Store for checking team access
export const useCanAccessTeamStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createTeamClient>,
  CanAccessTeamRequest,
  CanAccessTeamResponse
>({
  createClient: createTeamClient,
  method: async (client, clientParams, input) => {
    return await canAccessTeam(client, clientParams, input)
  },
})

// Export convenience hooks for loading and error states
export const useCreateTeamLoading = () => useCreateTeamStore().isLoading
export const useGetTeamLoading = () => useGetTeamStore().isLoading
export const useUpdateTeamLoading = () => useUpdateTeamStore().isLoading
export const useDeleteTeamLoading = () => useDeleteTeamStore().isLoading
export const useSearchTeamsLoading = () => useSearchTeamsStore().isLoading
export const useAddMemberLoading = () => useAddMemberStore().isLoading
export const useUpdateMemberRoleLoading = () => useUpdateMemberRoleStore().isLoading
export const useRemoveMemberLoading = () => useRemoveMemberStore().isLoading
export const useSearchMembersLoading = () => useSearchMembersStore().isLoading
export const useCanAccessTeamLoading = () => useCanAccessTeamStore().isLoading

export const useCreateTeamError = () => useCreateTeamStore().error
export const useGetTeamError = () => useGetTeamStore().error
export const useUpdateTeamError = () => useUpdateTeamStore().error
export const useDeleteTeamError = () => useDeleteTeamStore().error
export const useSearchTeamsError = () => useSearchTeamsStore().error
export const useAddMemberError = () => useAddMemberStore().error
export const useUpdateMemberRoleError = () => useUpdateMemberRoleStore().error
export const useRemoveMemberError = () => useRemoveMemberStore().error
export const useSearchMembersError = () => useSearchMembersStore().error
export const useCanAccessTeamError = () => useCanAccessTeamStore().error
