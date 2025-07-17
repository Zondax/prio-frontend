import type { ChatService, GrpcConfig } from '@mono-grpc'
import { createGrpcSingleMethodStore } from '@zondax/stores'

import { createChatClient, sendChatMessage } from '../api/chat'

// Store for sending chat messages
export const useChatStore = createGrpcSingleMethodStore<
  GrpcConfig,
  ChatService.ChatServiceClient,
  { message: string; userId: string; conversationId?: string },
  { response: string; conversationId: string }
>({
  createClient: createChatClient,
  method: async (client, clientParams, input) => {
    return await sendChatMessage(client, clientParams, input.message, input.userId, input.conversationId)
  },
})

// Convenience hooks for accessing specific parts of the chat store
export const useChatLoading = () => {
  const store = useChatStore()
  // Check if any operation is loading
  return store.isAnyLoading()
}
export const useChatError = () => useChatStore().error
export const useChatResponse = () => useChatStore().data
export const useSendMessage = () => useChatStore().setInput
export const useRefreshChat = () => useChatStore().refresh
