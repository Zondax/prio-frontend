// Types that would match gRPC protobuf definitions
export interface ChatChannel {
  id: string
  name: string
  description: string
  missionId: string
  lastActivity: Date
  participantIds: string[]
  type: 'ai' | 'team' | 'mixed'
  status: 'active' | 'archived'
  tags: string[]
  isShared: boolean
}

export interface ChatListFilters {
  missionId?: string
  type?: string
  status?: string
  // Pagination for infinite scroll
  page?: number
  limit?: number
  // Cursor-based pagination (alternative to page-based)
  cursor?: string
  // Search and sorting
  searchQuery?: string
  sortBy?: 'name' | 'lastActivity' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// Metadata for pagination
export interface ChatListMetadata {
  totalCount: number
  hasMore: boolean
  currentPage: number
  totalPages: number
  pageSize: number
}

// Response using the standard TPageableResponse pattern
export interface ChatListResponse {
  data: ChatChannel[]
  metadata: ChatListMetadata
  cursor: string
}

export interface CreateChatChannelRequest {
  name: string
  description?: string
  type: 'ai' | 'team' | 'mixed'
  missionId?: string
  participantIds?: string[]
}

export interface UpdateChatChannelRequest {
  channelId: string
  name?: string
  description?: string
  status?: 'active' | 'archived'
  participantIds?: string[]
}

export interface ArchiveChatChannelResponse {
  success: boolean
  message: string
}
