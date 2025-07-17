// Types for conversation bookmark operations matching gRPC ConversationBookmark
export interface ConversationBookmark {
  id: string
  userId: string
  conversationId: string
  messageId: string
  name: string
  description?: string
  color?: string
  tags: string[]
  metadata?: Record<string, any> // Represents protobuf Struct
  createdAt: Date
  updatedAt: Date
}

export interface GetBookmarkRequest {
  bookmarkId: string
}

export interface CreateBookmarkRequest {
  conversationId: string
  messageId: string
  name: string
  description?: string
  color?: string
  tags?: string[]
}

export interface UpdateBookmarkRequest {
  bookmarkId: string
  name?: string
  description?: string
  color?: string
  tags?: string[]
}

export interface DeleteBookmarkRequest {
  bookmarkId: string
}

export interface SearchBookmarksRequest {
  conversationId?: string
  query?: string
  pagination?: {
    page?: number
    pageSize?: number
  }
}

export interface SearchBookmarksResponse {
  bookmarks: ConversationBookmark[]
  pagination: {
    totalCount: number
    hasMore: boolean
    currentPage: number
    totalPages: number
    pageSize: number
  }
}

export interface StandardResponse {
  success: boolean
  message: string
}
