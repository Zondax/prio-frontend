import type { GrpcConfig } from '@mono-grpc'
import { MOCK_THREADS_LIST } from './thread-list.mocks'
import type {
  BulkThreadRequest,
  StandardResponse,
  Thread,
  ThreadListFilters,
  ThreadListMetadata,
  ThreadListResponse,
} from './thread-list.types'

// Re-export types for convenience
export type { Thread, ThreadListFilters, ThreadListMetadata, ThreadListResponse, BulkThreadRequest, StandardResponse }

// Mock client creator - would be replaced with real gRPC client
export const createThreadListClient = (cp: GrpcConfig) => {
  return {
    // Mock client object that mimics gRPC client interface
    baseUrl: cp.baseUrl,
    metadata: cp.metadata,
  }
}

// Mock API functions for thread list operations
export const getThreadList = async (
  _client: ReturnType<typeof createThreadListClient>,
  _clientParams: GrpcConfig,
  filters?: ThreadListFilters
): Promise<ThreadListResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  let threads = Object.values(MOCK_THREADS_LIST)

  // Apply filters
  if (filters?.chatChannelId) {
    threads = threads.filter((thread) => thread.chatChannelId === filters.chatChannelId)
  }
  if (filters?.authorId) {
    threads = threads.filter((thread) => thread.authorId === filters.authorId)
  }
  if (filters?.isLocked !== undefined) {
    threads = threads.filter((thread) => thread.isLocked === filters.isLocked)
  }
  if (filters?.isPinned !== undefined) {
    threads = threads.filter((thread) => thread.isPinned === filters.isPinned)
  }
  if (filters?.tags && filters.tags.length > 0) {
    threads = threads.filter((thread) => filters.tags?.some((tag) => thread.tags.includes(tag)))
  }

  // Apply search
  if (filters?.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    threads = threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(query) ||
        thread.content.toLowerCase().includes(query) ||
        thread.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }

  // Apply sorting
  const sortBy = filters?.sortBy || 'lastMessageAt'
  const sortOrder = filters?.sortOrder || 'desc'

  threads.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'lastMessageAt':
        aValue = a.lastMessageAt.getTime()
        bValue = b.lastMessageAt.getTime()
        break
      case 'createdAt':
        aValue = a.createdAt.getTime()
        bValue = b.createdAt.getTime()
        break
      case 'messageCount':
        aValue = a.messageCount
        bValue = b.messageCount
        break
      default:
        aValue = a.lastMessageAt.getTime()
        bValue = b.lastMessageAt.getTime()
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

  const paginatedThreads = threads.slice(startIndex, endIndex)
  const totalPages = Math.ceil(threads.length / limit)

  // Generate cursor for cursor-based pagination (using last item's ID)
  const nextCursor = paginatedThreads.length > 0 ? paginatedThreads[paginatedThreads.length - 1].id : undefined

  return {
    data: paginatedThreads,
    metadata: {
      totalCount: threads.length,
      hasMore: endIndex < threads.length,
      currentPage: page,
      totalPages,
      pageSize: limit,
    },
    cursor: nextCursor || '',
  }
}

export const bulkThreadAction = async (
  _client: ReturnType<typeof createThreadListClient>,
  _clientParams: GrpcConfig,
  data: BulkThreadRequest
): Promise<StandardResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const affectedThreads = data.threadIds.filter((id) => MOCK_THREADS_LIST[id])

  if (affectedThreads.length === 0) {
    return {
      success: false,
      message: 'No valid threads found for the given IDs',
    }
  }

  switch (data.action) {
    case 'delete':
      for (const id of affectedThreads) {
        delete MOCK_THREADS_LIST[id]
      }
      return {
        success: true,
        message: `Successfully deleted ${affectedThreads.length} thread(s)`,
      }

    case 'lock':
      for (const id of affectedThreads) {
        MOCK_THREADS_LIST[id] = {
          ...MOCK_THREADS_LIST[id],
          isLocked: true,
          updatedAt: new Date(),
        }
      }
      return {
        success: true,
        message: `Successfully locked ${affectedThreads.length} thread(s)`,
      }

    case 'unlock':
      for (const id of affectedThreads) {
        MOCK_THREADS_LIST[id] = {
          ...MOCK_THREADS_LIST[id],
          isLocked: false,
          updatedAt: new Date(),
        }
      }
      return {
        success: true,
        message: `Successfully unlocked ${affectedThreads.length} thread(s)`,
      }

    case 'pin':
      for (const id of affectedThreads) {
        MOCK_THREADS_LIST[id] = {
          ...MOCK_THREADS_LIST[id],
          isPinned: true,
          updatedAt: new Date(),
        }
      }
      return {
        success: true,
        message: `Successfully pinned ${affectedThreads.length} thread(s)`,
      }

    case 'unpin':
      for (const id of affectedThreads) {
        MOCK_THREADS_LIST[id] = {
          ...MOCK_THREADS_LIST[id],
          isPinned: false,
          updatedAt: new Date(),
        }
      }
      return {
        success: true,
        message: `Successfully unpinned ${affectedThreads.length} thread(s)`,
      }

    case 'add_tags':
      if (!data.tags || data.tags.length === 0) {
        return {
          success: false,
          message: 'Tags are required for add_tags action',
        }
      }
      for (const id of affectedThreads) {
        const existingTags = MOCK_THREADS_LIST[id].tags
        const newTags = [...new Set([...existingTags, ...data.tags])]
        MOCK_THREADS_LIST[id] = {
          ...MOCK_THREADS_LIST[id],
          tags: newTags,
          updatedAt: new Date(),
        }
      }
      return {
        success: true,
        message: `Successfully added tags to ${affectedThreads.length} thread(s)`,
      }

    case 'remove_tags':
      if (!data.tags || data.tags.length === 0) {
        return {
          success: false,
          message: 'Tags are required for remove_tags action',
        }
      }
      for (const id of affectedThreads) {
        const existingTags = MOCK_THREADS_LIST[id].tags
        const newTags = existingTags.filter((tag) => !data.tags?.includes(tag))
        MOCK_THREADS_LIST[id] = {
          ...MOCK_THREADS_LIST[id],
          tags: newTags,
          updatedAt: new Date(),
        }
      }
      return {
        success: true,
        message: `Successfully removed tags from ${affectedThreads.length} thread(s)`,
      }

    default:
      return {
        success: false,
        message: 'Invalid action specified',
      }
  }
}
