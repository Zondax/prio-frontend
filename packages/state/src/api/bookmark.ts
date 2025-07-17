import { createMetadataAwareMethod, type GrpcConfig } from '@mono-grpc'
import { BookmarkServiceClient } from '../../../grpc/src/entities/proto/api/v1/BookmarkServiceClientPb'
import * as bookmarkPb from '../../../grpc/src/entities/proto/api/v1/bookmark_pb'
import { MOCK_BOOKMARKS } from './bookmark.mocks'
import type {
  ConversationBookmark,
  CreateBookmarkRequest,
  DeleteBookmarkRequest,
  GetBookmarkRequest,
  StandardResponse,
  UpdateBookmarkRequest,
} from './bookmark.types'

// Re-export types for convenience
export type {
  ConversationBookmark,
  GetBookmarkRequest,
  CreateBookmarkRequest,
  UpdateBookmarkRequest,
  DeleteBookmarkRequest,
  StandardResponse,
}

// Helper function to convert protobuf timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (!timestamp) return new Date()
  return new Date(timestamp.getSeconds() * 1000 + timestamp.getNanos() / 1000000)
}

// Helper function to convert Date to protobuf timestamp
const _dateToTimestamp = (date: Date): any => {
  const timestamp = new (require('google-protobuf/google/protobuf/timestamp_pb').Timestamp)()
  timestamp.setSeconds(Math.floor(date.getTime() / 1000))
  timestamp.setNanos((date.getTime() % 1000) * 1000000)
  return timestamp
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

// Real gRPC client creator
export const createBookmarkClient = (cp: GrpcConfig): BookmarkServiceClient => {
  return new BookmarkServiceClient(cp.baseUrl, null, cp.metadata)
}

// Mock fallback flag - in real implementation, this would be based on environment or feature flags
const USE_MOCK = true

// Metadata-aware method wrappers
const getBookmarkWithAuth = createMetadataAwareMethod<
  BookmarkServiceClient,
  bookmarkPb.GetBookmarkRequest,
  bookmarkPb.ConversationBookmark
>((client, request, metadata) => client.getBookmark(request, metadata as any))

const createBookmarkWithAuth = createMetadataAwareMethod<
  BookmarkServiceClient,
  bookmarkPb.CreateBookmarkRequest,
  bookmarkPb.ConversationBookmark
>((client, request, metadata) => client.createBookmark(request, metadata as any))

const updateBookmarkWithAuth = createMetadataAwareMethod<
  BookmarkServiceClient,
  bookmarkPb.UpdateBookmarkRequest,
  bookmarkPb.ConversationBookmark
>((client, request, metadata) => client.updateBookmark(request, metadata as any))

const deleteBookmarkWithAuth = createMetadataAwareMethod<BookmarkServiceClient, bookmarkPb.DeleteBookmarkRequest, any>(
  (client, request, metadata) => client.deleteBookmark(request, metadata as any)
)

// API functions for individual bookmark operations
export const getBookmark = async (
  client: BookmarkServiceClient,
  clientParams: GrpcConfig,
  data: GetBookmarkRequest
): Promise<ConversationBookmark> => {
  if (USE_MOCK) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 100))
    const bookmark = MOCK_BOOKMARKS[data.bookmarkId]
    if (!bookmark) {
      throw new Error(`Bookmark with ID ${data.bookmarkId} not found`)
    }
    return bookmark
  }

  // Real gRPC implementation
  const request = new bookmarkPb.GetBookmarkRequest()
  request.setBookmarkId(data.bookmarkId)

  const response = await getBookmarkWithAuth(client, clientParams, request)
  return convertFromProtobuf(response)
}

export const createBookmark = async (
  client: BookmarkServiceClient,
  clientParams: GrpcConfig,
  data: CreateBookmarkRequest
): Promise<ConversationBookmark> => {
  if (USE_MOCK) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 200))
    const newBookmark: ConversationBookmark = {
      id: `bookmark-${Date.now()}`,
      userId: 'user-you',
      conversationId: data.conversationId,
      messageId: data.messageId,
      name: data.name,
      description: data.description,
      color: data.color,
      tags: data.tags || [],
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    MOCK_BOOKMARKS[newBookmark.id] = newBookmark
    return newBookmark
  }

  // Real gRPC implementation
  const request = new bookmarkPb.CreateBookmarkRequest()
  request.setConversationId(data.conversationId)
  request.setMessageId(data.messageId)
  request.setName(data.name)
  if (data.description) request.setDescription(data.description)
  if (data.color) request.setColor(data.color)
  if (data.tags) request.setTagsList(data.tags)

  const response = await createBookmarkWithAuth(client, clientParams, request)
  return convertFromProtobuf(response)
}

export const updateBookmark = async (
  client: BookmarkServiceClient,
  clientParams: GrpcConfig,
  data: UpdateBookmarkRequest
): Promise<ConversationBookmark> => {
  if (USE_MOCK) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 150))
    const existingBookmark = MOCK_BOOKMARKS[data.bookmarkId]
    if (!existingBookmark) {
      throw new Error(`Bookmark with ID ${data.bookmarkId} not found`)
    }

    const updatedBookmark: ConversationBookmark = {
      ...existingBookmark,
      ...(data.name && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.color !== undefined && { color: data.color }),
      ...(data.tags && { tags: data.tags }),
      updatedAt: new Date(),
    }

    MOCK_BOOKMARKS[data.bookmarkId] = updatedBookmark
    return updatedBookmark
  }

  // Real gRPC implementation
  const request = new bookmarkPb.UpdateBookmarkRequest()
  request.setBookmarkId(data.bookmarkId)
  if (data.name) request.setName(data.name)
  if (data.description !== undefined) request.setDescription(data.description)
  if (data.color !== undefined) request.setColor(data.color)
  if (data.tags) request.setTagsList(data.tags)

  const response = await updateBookmarkWithAuth(client, clientParams, request)
  return convertFromProtobuf(response)
}

export const deleteBookmark = async (
  client: BookmarkServiceClient,
  clientParams: GrpcConfig,
  data: DeleteBookmarkRequest
): Promise<StandardResponse> => {
  if (USE_MOCK) {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 100))
    const existingBookmark = MOCK_BOOKMARKS[data.bookmarkId]
    if (!existingBookmark) {
      return {
        success: false,
        message: `Bookmark with ID ${data.bookmarkId} not found`,
      }
    }
    delete MOCK_BOOKMARKS[data.bookmarkId]
    return {
      success: true,
      message: 'Bookmark deleted successfully',
    }
  }

  // Real gRPC implementation
  const request = new bookmarkPb.DeleteBookmarkRequest()
  request.setBookmarkId(data.bookmarkId)

  await deleteBookmarkWithAuth(client, clientParams, request)
  // Delete bookmark returns Empty, so we create a standard response
  return {
    success: true,
    message: 'Bookmark deleted successfully',
  }
}
