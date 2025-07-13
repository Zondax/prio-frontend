import { Chat, ChatService, createMetadataAwareMethod, type GrpcConfig } from '@mono-grpc'

export const createChatClient = (cp: GrpcConfig) => {
  return new ChatService.ChatServiceClient(cp.baseUrl, cp.metadata as any)
}

// Create metadata-aware method wrapper for chat API calls
const sendMessageWithAuth = createMetadataAwareMethod<ChatService.ChatServiceClient, Chat.ChatRequest, Chat.ChatResponse>(
  (client, request, metadata) => client.sendMessage(request, metadata as any)
)

// Create request for sending a chat message
export const createChatRequest = (message: string, userId: string, _conversationId?: string): Chat.ChatRequest => {
  const request = new Chat.ChatRequest()
  request.setMessage(message)
  request.setUserId(userId)
  // Note: Adding conversationId support if the protobuf supports it
  // This may need to be updated based on the actual protobuf definition
  return request
}

// Send a message to the chat service and get response
export const sendChatMessage = async (
  client: ChatService.ChatServiceClient,
  clientParams: GrpcConfig,
  message: string,
  userId: string,
  conversationId?: string
): Promise<{ response: string; conversationId: string }> => {
  const request = createChatRequest(message, userId, conversationId)
  const response = await sendMessageWithAuth(client, clientParams, request)

  return {
    response: response.getResponse(),
    conversationId: response.getConversationId(),
  }
}
