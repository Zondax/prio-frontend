import { type GrpcConfig, type Metadata, WaitingList, WaitingListService } from '@prio-grpc'

import { convertToStruct } from '../utils'

export type WaitingListInput = {
  email: string
  turnstile: string
  metadata: Record<string, any>
}

export type WaitingListUserInput = {
  emailFilter: string
  pageSize: number
  page: number
}

export const createWaitingListClient = (cp: GrpcConfig): WaitingListService.WaitingListServiceClient => {
  return new WaitingListService.WaitingListServiceClient(cp.baseUrl, cp.metadata as Metadata)
}

export const writeWaitingList = async (
  client: WaitingListService.WaitingListServiceClient,
  clientParams: GrpcConfig,
  data: WaitingListInput
): Promise<boolean> => {
  const request = new WaitingList.JoinWaitingListRequest()

  request.setEmail(data.email)
  request.setTurnstile(data.turnstile)
  request.setMetadata(convertToStruct(data.metadata || {}))

  await client.joinWaitingList(request, clientParams.metadata as Metadata)
  return true
}

export const getWaitingList = async (
  client: WaitingListService.WaitingListServiceClient,
  clientParams: GrpcConfig,
  input: WaitingListUserInput
): Promise<WaitingList.ListUsersResponse> => {
  const request = new WaitingList.ListUsersRequest()

  request.setEmailFilter(input.emailFilter)
  request.setPageSize(input.pageSize)
  request.setPage(input.page)

  return await client.listUsers(request, clientParams.metadata as Metadata)
}
