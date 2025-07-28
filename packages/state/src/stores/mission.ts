import type { GrpcConfig } from '@mono-grpc'
import { createBackendListStore, createSimpleStore } from '@zondax/stores'

import {
  type AddMissionMemberRequest,
  type AddMissionMemberResponse,
  addMissionMember,
  type CanAccessMissionRequest,
  type CanAccessMissionResponse,
  type CreateMissionRequest,
  type CreateMissionResponse,
  canAccessMission,
  createMission,
  createMissionClient,
  deleteMission,
  type GetMissionResponse,
  getMission,
  type Mission,
  type MissionMember,
  type RemoveMissionMemberRequest,
  removeMissionMember,
  type UpdateMissionMemberRoleRequest,
  type UpdateMissionMemberRoleResponse,
  type UpdateMissionRequest,
  type UpdateMissionResponse,
  updateMission,
  updateMissionMemberRole,
} from '../api/mission'

import {
  convertToMissionListResponse,
  type SearchMissionMembersRequest,
  type SearchMissionsRequest,
  searchMissionMembers,
  searchMissions,
} from '../api/mission-list'

// Store for creating a new mission
export const useCreateMissionStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  CreateMissionRequest,
  CreateMissionResponse
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await createMission(client, clientParams, input)
  },
})

// Store for getting a single mission
export const useGetMissionStore = createSimpleStore<GrpcConfig, ReturnType<typeof createMissionClient>, string, GetMissionResponse>({
  createClient: createMissionClient,
  method: async (client, clientParams, missionId) => {
    return await getMission(client, clientParams, missionId)
  },
})

// Store for updating missions
export const useUpdateMissionStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  UpdateMissionRequest,
  UpdateMissionResponse
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await updateMission(client, clientParams, input)
  },
})

// Store for deleting missions
export const useDeleteMissionStore = createSimpleStore<GrpcConfig, ReturnType<typeof createMissionClient>, string, void>({
  createClient: createMissionClient,
  method: async (client, clientParams, missionId) => {
    return await deleteMission(client, clientParams, missionId)
  },
})

// Store for searching missions (pageable)
export const useSearchMissionsStore = createBackendListStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  Mission,
  SearchMissionsRequest
>({
  createClient: createMissionClient,
  fetchData: async (client, clientParams, queryParams) => {
    const input: SearchMissionsRequest = queryParams as SearchMissionsRequest
    const response = await searchMissions(client, clientParams, input)
    const listResponse = convertToMissionListResponse(response)
    return {
      items: listResponse.data,
      pageResponse: {
        nextPageToken: listResponse.metadata?.nextPageToken,
        totalItems: listResponse.metadata?.totalCount,
      },
    }
  },
  itemIdExtractor: (mission) => mission.id,
  defaultPageSize: 20,
})

// Store for adding mission members
export const useAddMissionMemberStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  AddMissionMemberRequest,
  AddMissionMemberResponse
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await addMissionMember(client, clientParams, input)
  },
})

// Store for updating mission member role
export const useUpdateMissionMemberRoleStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  UpdateMissionMemberRoleRequest,
  UpdateMissionMemberRoleResponse
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await updateMissionMemberRole(client, clientParams, input)
  },
})

// Store for removing mission members
export const useRemoveMissionMemberStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  RemoveMissionMemberRequest,
  void
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await removeMissionMember(client, clientParams, input)
  },
})

// Store for searching mission members (pageable)
export const useSearchMissionMembersStore = createBackendListStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  MissionMember,
  SearchMissionMembersRequest
>({
  createClient: createMissionClient,
  fetchData: async (client, clientParams, queryParams) => {
    const input: SearchMissionMembersRequest = queryParams as SearchMissionMembersRequest
    const response = await searchMissionMembers(client, clientParams, input)
    return {
      items: response.members,
      pageResponse: response.pageResponse,
    }
  },
  itemIdExtractor: (member) => `${member.missionId}-${member.userId}`,
  defaultPageSize: 20,
})

// Store for checking mission access
export const useCanAccessMissionStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  CanAccessMissionRequest,
  CanAccessMissionResponse
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await canAccessMission(client, clientParams, input)
  },
})

// Export convenience hooks for loading and error states
export const useCreateMissionLoading = () => useCreateMissionStore().isLoading
export const useGetMissionLoading = () => useGetMissionStore().isLoading
export const useUpdateMissionLoading = () => useUpdateMissionStore().isLoading
export const useDeleteMissionLoading = () => useDeleteMissionStore().isLoading
export const useSearchMissionsLoading = () => useSearchMissionsStore().isLoading
export const useAddMissionMemberLoading = () => useAddMissionMemberStore().isLoading
export const useUpdateMissionMemberRoleLoading = () => useUpdateMissionMemberRoleStore().isLoading
export const useRemoveMissionMemberLoading = () => useRemoveMissionMemberStore().isLoading
export const useSearchMissionMembersLoading = () => useSearchMissionMembersStore().isLoading
export const useCanAccessMissionLoading = () => useCanAccessMissionStore().isLoading

export const useCreateMissionError = () => useCreateMissionStore().error
export const useGetMissionError = () => useGetMissionStore().error
export const useUpdateMissionError = () => useUpdateMissionStore().error
export const useDeleteMissionError = () => useDeleteMissionStore().error
export const useSearchMissionsError = () => useSearchMissionsStore().errors
export const useAddMissionMemberError = () => useAddMissionMemberStore().error
export const useUpdateMissionMemberRoleError = () => useUpdateMissionMemberRoleStore().error
export const useRemoveMissionMemberError = () => useRemoveMissionMemberStore().error
export const useSearchMissionMembersError = () => useSearchMissionMembersStore().errors
export const useCanAccessMissionError = () => useCanAccessMissionStore().error
