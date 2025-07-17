import type { GrpcConfig } from '@mono-grpc'
import { MOCK_CHAT_CHANNELS } from './chat-list.mocks'
import type {
  ArchiveChatChannelResponse,
  ChatChannel,
  ChatListFilters,
  ChatListResponse,
  CreateChatChannelRequest,
  UpdateChatChannelRequest,
} from './chat-list.types'

// Re-export types for convenience
export type {
  ChatChannel,
  ChatListFilters,
  ChatListResponse,
  CreateChatChannelRequest,
  UpdateChatChannelRequest,
  ArchiveChatChannelResponse,
}

// Mock client creator - would be replaced with real gRPC client
export const createChatListClient = (cp: GrpcConfig) => {
  return {
    // Mock client object that mimics gRPC client interface
    baseUrl: cp.baseUrl,
    metadata: cp.metadata,
  }
}

// Mock API functions that follow the same pattern as chat.ts
export const getChatList = async (
  _client: ReturnType<typeof createChatListClient>,
  _clientParams: GrpcConfig,
  filters?: ChatListFilters
): Promise<ChatListResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  let channels = Object.values(MOCK_CHAT_CHANNELS)

  // Apply filters
  if (filters?.missionId) {
    channels = channels.filter((chat) => chat.missionId === filters.missionId)
  }
  if (filters?.type) {
    channels = channels.filter((chat) => chat.type === filters.type)
  }
  if (filters?.status) {
    channels = channels.filter((chat) => chat.status === filters.status)
  }

  // Apply search
  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    channels = channels.filter(
      (chat) =>
        chat.name.toLowerCase().includes(query) ||
        chat.description.toLowerCase().includes(query) ||
        chat.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'lastActivity'
  const sortOrder = filters?.sortOrder || 'desc'

  channels.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'lastActivity':
        aValue = a.lastActivity.getTime()
        bValue = b.lastActivity.getTime()
        break
      case 'createdAt':
        // Mock createdAt based on ID for demonstration
        aValue = a.id
        bValue = b.id
        break
      default:
        aValue = a.lastActivity.getTime()
        bValue = b.lastActivity.getTime()
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    }
    return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
  })

  // Apply pagination
  const page = filters?.page || 1
  const limit = filters?.limit || 20 // Default to 20 for infinite scroll
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  const paginatedChannels = channels.slice(startIndex, endIndex)
  const totalPages = Math.ceil(channels.length / limit)

  // Generate cursor for cursor-based pagination (using last item's ID)
  const nextCursor = paginatedChannels.length > 0 ? paginatedChannels[paginatedChannels.length - 1].id : undefined

  return {
    data: paginatedChannels,
    metadata: {
      totalCount: channels.length,
      hasMore: endIndex < channels.length,
      currentPage: page,
      totalPages,
      pageSize: limit,
    },
    cursor: nextCursor || '',
  }
}

export const createChatChannel = async (
  _client: ReturnType<typeof createChatListClient>,
  _clientParams: GrpcConfig,
  data: CreateChatChannelRequest
): Promise<ChatChannel> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const newChannel: ChatChannel = {
    id: `chat-${Date.now()}`,
    name: data.name,
    description: data.description || '',
    type: data.type,
    missionId: data.missionId || '',
    participantIds: data.participantIds || [],
    lastActivity: new Date(),
    status: 'active',
    tags: [],
    isShared: data.type === 'team',
  }

  // In real implementation, this would be saved to backend
  MOCK_CHAT_CHANNELS[newChannel.id] = newChannel

  return newChannel
}

export const updateChatChannel = async (
  _client: ReturnType<typeof createChatListClient>,
  _clientParams: GrpcConfig,
  data: UpdateChatChannelRequest
): Promise<ChatChannel> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const existingChannel = MOCK_CHAT_CHANNELS[data.channelId]
  if (!existingChannel) {
    throw new Error(`Chat channel with ID ${data.channelId} not found`)
  }

  const updatedChannel: ChatChannel = {
    ...existingChannel,
    ...(data.name && { name: data.name }),
    ...(data.description && { description: data.description }),
    ...(data.status && { status: data.status }),
    ...(data.participantIds && { participantIds: data.participantIds }),
    lastActivity: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_CHAT_CHANNELS[data.channelId] = updatedChannel

  return updatedChannel
}

export const archiveChatChannel = async (
  _client: ReturnType<typeof createChatListClient>,
  _clientParams: GrpcConfig,
  channelId: string
): Promise<ArchiveChatChannelResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const existingChannel = MOCK_CHAT_CHANNELS[channelId]
  if (!existingChannel) {
    return {
      success: false,
      message: `Chat channel with ID ${channelId} not found`,
    }
  }

  // Update status to archived
  MOCK_CHAT_CHANNELS[channelId] = {
    ...existingChannel,
    status: 'archived',
    lastActivity: new Date(),
  }

  return {
    success: true,
    message: 'Chat channel archived successfully',
  }
}
