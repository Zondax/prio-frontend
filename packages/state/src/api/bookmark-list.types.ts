import type { TPageableResponse } from '@zondax/stores'

// Import the individual bookmark type
export type { ConversationBookmark } from './bookmark.types'

// Filters for searching bookmarks - matches SearchBookmarksRequest from gRPC
export interface BookmarkListFilters {
  conversationId?: string
  query?: string
  page?: number
  pageSize?: number
}

// Metadata for bookmark list responses - matches PageResponse from gRPC
export interface BookmarkListMetadata {
  totalCount: number
  hasMore: boolean
  currentPage: number
  totalPages: number
  pageSize: number
}

// Response structure for bookmark list
export interface BookmarkListResponse extends TPageableResponse<import('./bookmark.types').ConversationBookmark, BookmarkListMetadata> {}

// Standard response for operations
export interface StandardResponse {
  success: boolean
  message: string
}
