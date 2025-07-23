import type { GrpcConfig } from '@mono-grpc'
import { createSimpleStore } from '@zondax/stores'

import {
  createObjectiveClient,
  type DeleteObjectiveRequest,
  deleteObjective,
  type GetObjectiveRequest,
  getObjective,
  type Objective,
  type StandardResponse,
  type UpdateObjectiveRequest,
  updateObjective,
} from '../api/objective'

// Store for getting objective details
export const useObjectiveStore = createSimpleStore<GrpcConfig, ReturnType<typeof createObjectiveClient>, GetObjectiveRequest, Objective>({
  createClient: createObjectiveClient,
  method: async (client, clientParams, input) => {
    return await getObjective(client, clientParams, input)
  },
})

// Store for updating objectives
export const useUpdateObjectiveStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createObjectiveClient>,
  UpdateObjectiveRequest,
  Objective
>({
  createClient: createObjectiveClient,
  method: async (client, clientParams, input) => {
    return await updateObjective(client, clientParams, input)
  },
})

// Store for deleting objectives
export const useDeleteObjectiveStore = createSimpleStore<
  GrpcConfig,
  ReturnType<typeof createObjectiveClient>,
  DeleteObjectiveRequest,
  StandardResponse
>({
  createClient: createObjectiveClient,
  method: async (client, clientParams, input) => {
    return await deleteObjective(client, clientParams, input)
  },
})

// Convenience hooks for objective details
export const useObjectiveLoading = () => useObjectiveStore().isLoading
export const useObjectiveError = () => useObjectiveStore().error
export const useObjectiveData = () => useObjectiveStore().data
export const useRefreshObjective = () => useObjectiveStore().refresh
export const useSetObjectiveInput = () => useObjectiveStore().setInput

// Convenience hooks for objective updates
export const useUpdateObjectiveLoading = () => useUpdateObjectiveStore().isLoading
export const useUpdateObjectiveError = () => useUpdateObjectiveStore().error
export const useUpdateObjectiveData = () => useUpdateObjectiveStore().data
export const useUpdateObjectiveAction = () => useUpdateObjectiveStore().setInput

// Convenience hooks for objective deletion
export const useDeleteObjectiveLoading = () => useDeleteObjectiveStore().isLoading
export const useDeleteObjectiveError = () => useDeleteObjectiveStore().error
export const useDeleteObjectiveData = () => useDeleteObjectiveStore().data
export const useDeleteObjectiveAction = () => useDeleteObjectiveStore().setInput
