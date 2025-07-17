import type { GrpcConfig } from '@mono-grpc'
import { MOCK_THREADS } from './thread.mocks'
import type {
  CreateThreadRequest,
  DeleteThreadRequest,
  GetThreadRequest,
  StandardResponse,
  Thread,
  UpdateThreadRequest,
} from './thread.types'

// Re-export types for convenience
export type { Thread, GetThreadRequest, CreateThreadRequest, UpdateThreadRequest, DeleteThreadRequest, StandardResponse }

// Mock client creator - would be replaced with real gRPC client
export const createThreadClient = (cp: GrpcConfig) => {
  return {
    // Mock client object that mimics gRPC client interface
    baseUrl: cp.baseUrl,
    metadata: cp.metadata,
  }
}

// Mock API functions for individual thread operations
export const getThread = async (
  _client: ReturnType<typeof createThreadClient>,
  _clientParams: GrpcConfig,
  data: GetThreadRequest
): Promise<Thread> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const thread = MOCK_THREADS[data.threadId]
  if (!thread) {
    throw new Error(`Thread with ID ${data.threadId} not found`)
  }

  return thread
}

export const createThread = async (
  _client: ReturnType<typeof createThreadClient>,
  _clientParams: GrpcConfig,
  data: CreateThreadRequest
): Promise<Thread> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const newThread: Thread = {
    id: `thread-${Date.now()}`,
    title: data.title,
    content: data.content,
    chatChannelId: data.chatChannelId,
    authorId: 'user-you', // In real implementation, this would come from auth context
    messageCount: 1, // Initial message is the thread content
    lastMessageAt: new Date(),
    isLocked: false,
    isPinned: data.isPinned ?? false,
    tags: data.tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_THREADS[newThread.id] = newThread

  return newThread
}

export const updateThread = async (
  _client: ReturnType<typeof createThreadClient>,
  _clientParams: GrpcConfig,
  data: UpdateThreadRequest
): Promise<Thread> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const existingThread = MOCK_THREADS[data.threadId]
  if (!existingThread) {
    throw new Error(`Thread with ID ${data.threadId} not found`)
  }

  const updatedThread: Thread = {
    ...existingThread,
    ...(data.title && { title: data.title }),
    ...(data.content && { content: data.content }),
    ...(data.isLocked !== undefined && { isLocked: data.isLocked }),
    ...(data.isPinned !== undefined && { isPinned: data.isPinned }),
    ...(data.tags && { tags: data.tags }),
    updatedAt: new Date(),
  }

  // In real implementation, this would be saved to backend
  MOCK_THREADS[data.threadId] = updatedThread

  return updatedThread
}

export const deleteThread = async (
  _client: ReturnType<typeof createThreadClient>,
  _clientParams: GrpcConfig,
  data: DeleteThreadRequest
): Promise<StandardResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  const existingThread = MOCK_THREADS[data.threadId]
  if (!existingThread) {
    return {
      success: false,
      message: `Thread with ID ${data.threadId} not found`,
    }
  }

  // In real implementation, this would be deleted from backend
  delete MOCK_THREADS[data.threadId]

  return {
    success: true,
    message: 'Thread deleted successfully',
  }
}
