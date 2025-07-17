import { createMetadataAwareMethod, type GrpcConfig } from '@mono-grpc'
import { BookmarkServiceClient } from '../../../grpc/src/entities/proto/api/v1/BookmarkServiceClientPb'
import * as bookmarkPb from '../../../grpc/src/entities/proto/api/v1/bookmark_pb'
import * as commonPb from '../../../grpc/src/entities/proto/api/v1/common_pb'
import { MOCK_BOOKMARKS_LIST } from './bookmark-list.mocks'
import type {
  BookmarkListFilters,
  BookmarkListMetadata,
  BookmarkListResponse,
  ConversationBookmark,
  StandardResponse,
} from './bookmark-list.types'

// Re-export types for convenience
export type { ConversationBookmark, BookmarkListFilters, BookmarkListMetadata, BookmarkListResponse, StandardResponse }

// Helper function to convert protobuf timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (!timestamp) return new Date()
  return new Date(timestamp.getSeconds() * 1000 + timestamp.getNanos() / 1000000)
}

// Helper function to convert protobuf ConversationBookmark to TypeScript interface
const convertFromProtobuf = (pbBookmark: bookmarkPb.ConversationBookmark): ConversationBookmark => {
  return {
    id: pbBookmark.getId(),
    userId: pbBookmark.getUserId(),
    conversationId: pbBookmark.getConversationId(),
    messageId: pbBookmark.getMessageId(),
    name: pbBookmark.getName(),
    description: pbBookmark.hasDescription() ? pbBookmark.getDescription() : undefined,
    color: pbBookmark.hasColor() ? pbBookmark.getColor() : undefined,
    tags: pbBookmark.getTagsList(),
    metadata: pbBookmark.hasMetadata() ? pbBookmark.getMetadata()?.toJavaScript() : undefined,
    createdAt: timestampToDate(pbBookmark.getCreatedAt()),
    updatedAt: timestampToDate(pbBookmark.getUpdatedAt()),
  }
}

// Client creator - reuses the same client as individual bookmark operations
export const createBookmarkListClient = (cp: GrpcConfig): BookmarkServiceClient => {
  return new BookmarkServiceClient(cp.baseUrl, null, cp.metadata)
}

// Mock fallback flag - in real implementation, this would be based on environment or feature flags
const USE_MOCK = true

// Metadata-aware method wrappers
const searchBookmarksWithAuth = createMetadataAwareMethod<
  BookmarkServiceClient,
  bookmarkPb.SearchBookmarksRequest,
  bookmarkPb.SearchBookmarksResponse
>((client, request, metadata) => client.searchBookmarks(request, metadata as any))

// API function for searching bookmarks
export const searchBookmarks = async (
  client: BookmarkServiceClient,
  clientParams: GrpcConfig,
  filters?: BookmarkListFilters
): Promise<BookmarkListResponse> => {
  if (USE_MOCK) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 100))

    let bookmarks = Object.values(MOCK_BOOKMARKS_LIST)

    // Apply filters
    if (filters?.conversationId) {
      bookmarks = bookmarks.filter((bookmark) => bookmark.conversationId === filters.conversationId)
    }

    if (filters?.query) {
      const query = filters.query.toLowerCase()
      bookmarks = bookmarks.filter(
        (bookmark) =>
          bookmark.name.toLowerCase().includes(query) ||
          bookmark.description?.toLowerCase().includes(query) ||
          bookmark.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Apply pagination
    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 20 // Default to 20 for infinite scroll
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    const paginatedBookmarks = bookmarks.slice(startIndex, endIndex)
    const totalPages = Math.ceil(bookmarks.length / pageSize)

    // Generate cursor for cursor-based pagination (using last item's ID)
    const nextCursor = paginatedBookmarks.length > 0 ? paginatedBookmarks[paginatedBookmarks.length - 1].id : undefined

    return {
      data: paginatedBookmarks,
      metadata: {
        totalCount: bookmarks.length,
        hasMore: endIndex < bookmarks.length,
        currentPage: page,
        totalPages,
        pageSize,
      },
      cursor: nextCursor || '',
    }
  }

  // Real gRPC implementation
  const request = new bookmarkPb.SearchBookmarksRequest()

  if (filters?.conversationId) {
    request.setConversationId(filters.conversationId)
  }

  if (filters?.query) {
    request.setQuery(filters.query)
  }

  if (filters?.page || filters?.pageSize) {
    const pageRequest = new commonPb.PageRequest()
    if (filters.pageSize) pageRequest.setPageSize(filters.pageSize)
    // Note: PageRequest uses cursor-based pagination, not page numbers
    // In a real implementation, you'd use cursor from previous response
    request.setPagination(pageRequest)
  }

  const response = await searchBookmarksWithAuth(client, clientParams, request)
  const bookmarks = response.getBookmarksList().map(convertFromProtobuf)
  const pagination = response.getPagination()

  const metadata: BookmarkListMetadata = {
    totalCount: pagination ? pagination.getTotalItems() : 0,
    hasMore: pagination ? !!pagination.getNextCursor() : false,
    currentPage: filters?.page || 1,
    totalPages: 1, // Not available in cursor-based pagination
    pageSize: filters?.pageSize || 20,
  }

  // Generate cursor for cursor-based pagination
  const nextCursor = bookmarks.length > 0 ? bookmarks[bookmarks.length - 1].id : undefined

  return {
    data: bookmarks,
    metadata,
    cursor: nextCursor || '',
  }
}

// Keep the getBookmarkList function for backward compatibility, but use searchBookmarks internally
export const getBookmarkList = searchBookmarks
