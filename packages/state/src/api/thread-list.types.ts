import type { TPageableResponse } from '@zondax/stores'

// Import the individual thread type
export type { Thread } from './thread.types'

// Filters for querying thread lists
export interface ThreadListFilters {
  searchQuery?: string
  chatChannelId?: string
  authorId?: string
  isLocked?: boolean
  isPinned?: boolean
  tags?: string[]
  sortBy?: 'title' | 'lastMessageAt' | 'createdAt' | 'messageCount'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Metadata for thread list responses
export interface ThreadListMetadata {
  totalCount: number
  hasMore: boolean
  currentPage: number
  totalPages: number
  pageSize: number
}

// Response structure for thread list
export interface ThreadListResponse extends TPageableResponse<import('./thread.types').Thread, ThreadListMetadata> {}

// For bulk operations on threads
export interface BulkThreadRequest {
  threadIds: string[]
  action: 'delete' | 'lock' | 'unlock' | 'pin' | 'unpin' | 'add_tags' | 'remove_tags'
  tags?: string[] // used when action is 'add_tags' or 'remove_tags'
}

// Standard response for operations
export interface StandardResponse {
  success: boolean
  message: string
}
