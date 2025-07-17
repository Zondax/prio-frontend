// Types for individual thread operations
export interface Thread {
  id: string
  title: string
  content: string
  chatChannelId: string
  authorId: string
  messageCount: number
  lastMessageAt: Date
  isLocked: boolean
  isPinned: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface GetThreadRequest {
  threadId: string
}

export interface CreateThreadRequest {
  title: string
  content: string
  chatChannelId: string
  tags?: string[]
  isPinned?: boolean
}

export interface UpdateThreadRequest {
  threadId: string
  title?: string
  content?: string
  isLocked?: boolean
  isPinned?: boolean
  tags?: string[]
}

export interface DeleteThreadRequest {
  threadId: string
}

export interface StandardResponse {
  success: boolean
  message: string
}
