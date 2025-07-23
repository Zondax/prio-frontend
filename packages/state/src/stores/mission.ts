import type { GrpcConfig } from '@mono-grpc'
import { createSimpleStore } from '@zondax/stores'

import {
  type AddObjectiveRequest,
  type AddTeamMemberRequest,
  addObjective,
  addTeamMember,
  createMissionClient,
  type DeleteObjectiveRequest,
  deleteObjective,
  type GetMissionDetailsRequest,
  getMissionDetails,
  type Mission,
  type MissionDetails,
  type Objective,
  type RemoveTeamMemberRequest,
  removeTeamMember,
  type StandardResponse,
  type TeamMember,
  type UpdateMissionRequest,
  type UpdateObjectiveRequest,
  updateMission,
  updateObjective,
} from '../api/mission'

// Store for getting mission details
export const useMissionDetailsStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  GetMissionDetailsRequest,
  MissionDetails
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await getMissionDetails(client, clientParams, input)
  },
})

// Store for updating missions
export const useUpdateMissionStore = createSimpleStore<GrpcConfig, ReturnType<typeof createMissionClient>, UpdateMissionRequest, Mission>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await updateMission(client, clientParams, input)
  },
})

// Store for adding objectives to mission
export const useAddMissionObjectiveStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  AddObjectiveRequest,
  Objective
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await addObjective(client, clientParams, input)
  },
})

// Store for updating objectives in mission
export const useUpdateMissionObjectiveStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  UpdateObjectiveRequest,
  Objective
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await updateObjective(client, clientParams, input)
  },
})

// Store for deleting objectives from mission
export const useDeleteMissionObjectiveStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  DeleteObjectiveRequest,
  StandardResponse
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await deleteObjective(client, clientParams, input)
  },
})

// Store for adding team members
export const useAddTeamMemberStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  AddTeamMemberRequest,
  TeamMember
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await addTeamMember(client, clientParams, input)
  },
})

// Store for removing team members
export const useRemoveTeamMemberStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createMissionClient>,
  RemoveTeamMemberRequest,
  StandardResponse
>({
  createClient: createMissionClient,
  method: async (client, clientParams, input) => {
    return await removeTeamMember(client, clientParams, input)
  },
})

// Convenience hooks for mission details
export const useMissionDetailsLoading = () => useMissionDetailsStore().isLoading
export const useMissionDetailsError = () => useMissionDetailsStore().error
export const useMissionDetailsData = () => useMissionDetailsStore().data
export const useRefreshMissionDetails = () => useMissionDetailsStore().refresh
export const useSetMissionDetailsInput = () => useMissionDetailsStore().setInput

// Convenience hooks for mission updates
export const useUpdateMissionLoading = () => useUpdateMissionStore().isLoading
export const useUpdateMissionError = () => useUpdateMissionStore().error
export const useUpdateMissionData = () => useUpdateMissionStore().data
export const useUpdateMissionAction = () => useUpdateMissionStore().setInput

// Convenience hooks for mission objective management
export const useAddMissionObjectiveLoading = () => useAddMissionObjectiveStore().isLoading
export const useAddMissionObjectiveError = () => useAddMissionObjectiveStore().error
export const useAddMissionObjectiveData = () => useAddMissionObjectiveStore().data
export const useAddMissionObjectiveAction = () => useAddMissionObjectiveStore().setInput

export const useUpdateMissionObjectiveLoading = () => useUpdateMissionObjectiveStore().isLoading
export const useUpdateMissionObjectiveError = () => useUpdateMissionObjectiveStore().error
export const useUpdateMissionObjectiveData = () => useUpdateMissionObjectiveStore().data
export const useUpdateMissionObjectiveAction = () => useUpdateMissionObjectiveStore().setInput

export const useDeleteMissionObjectiveLoading = () => useDeleteMissionObjectiveStore().isLoading
export const useDeleteMissionObjectiveError = () => useDeleteMissionObjectiveStore().error
export const useDeleteMissionObjectiveData = () => useDeleteMissionObjectiveStore().data
export const useDeleteMissionObjectiveAction = () => useDeleteMissionObjectiveStore().setInput

// Convenience hooks for team member management
export const useAddTeamMemberLoading = () => useAddTeamMemberStore().isLoading
export const useAddTeamMemberError = () => useAddTeamMemberStore().error
export const useAddTeamMemberData = () => useAddTeamMemberStore().data
export const useAddTeamMemberAction = () => useAddTeamMemberStore().setInput

export const useRemoveTeamMemberLoading = () => useRemoveTeamMemberStore().isLoading
export const useRemoveTeamMemberError = () => useRemoveTeamMemberStore().error
export const useRemoveTeamMemberData = () => useRemoveTeamMemberStore().data
export const useRemoveTeamMemberAction = () => useRemoveTeamMemberStore().setInput
