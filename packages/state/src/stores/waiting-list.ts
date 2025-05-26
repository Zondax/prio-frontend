import type { GrpcConfig, WaitingList, WaitingListService } from '@prio-grpc'
import { createGrpcSingleMethodStore } from '@zondax/stores'

import {
  type WaitingListInput,
  type WaitingListUserInput,
  createWaitingListClient,
  getWaitingList,
  writeWaitingList,
} from '../api/waiting-list'

// Create the preferences store with read and write operations
export const useWaitingListStore = createGrpcSingleMethodStore<
  GrpcConfig,
  WaitingListService.WaitingListServiceClient,
  WaitingListInput,
  boolean
>({
  createClient: createWaitingListClient,
  method: writeWaitingList,
})

export const useWaitingUsersStore = createGrpcSingleMethodStore<
  GrpcConfig,
  WaitingListService.WaitingListServiceClient,
  WaitingListUserInput,
  WaitingList.ListUsersResponse
>({
  createClient: createWaitingListClient,
  method: getWaitingList,
})
