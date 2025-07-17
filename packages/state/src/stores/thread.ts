import type { GrpcConfig } from '@mono-grpc'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

import {
  type CreateThreadRequest,
  createThread,
  createThreadClient,
  type DeleteThreadRequest,
  deleteThread,
  type GetThreadRequest,
  getThread,
  type StandardResponse,
  type Thread,
  type UpdateThreadRequest,
  updateThread,
} from '../api/thread'

import {
  type BulkThreadRequest,
  bulkThreadAction,
  getThreadList,
  type ThreadListFilters,
  type ThreadListMetadata,
  type ThreadListResponse,
} from '../api/thread-list'

// Define the store state interface
interface ThreadStoreState {
  // Individual thread operations
  threads: Map<string, Thread>
  individualLoading: Map<string, boolean>
  individualErrors: Map<string, Error | null>

  // List operations
  lists: Map<string, Thread[]>
  listMetadata: Map<string, ThreadListMetadata>
  listCursors: Map<string, string>
  listLoading: Map<string, boolean>
  listErrors: Map<string, Error | null>

  // Bulk operations
  bulkLoading: boolean
  bulkError: Error | null

  // Shared client config
  clientConfig: GrpcConfig | null
  client: ReturnType<typeof createThreadClient> | null
}

// Define the store actions interface
interface ThreadStoreActions {
  // Configuration
  setClientConfig: (config: GrpcConfig) => void

  // Individual operations
  getThread: (request: GetThreadRequest) => Promise<Thread>
  createThread: (request: CreateThreadRequest) => Promise<Thread>
  updateThread: (request: UpdateThreadRequest) => Promise<Thread>
  deleteThread: (request: DeleteThreadRequest) => Promise<StandardResponse>

  // List operations
  getThreadList: (filters: ThreadListFilters) => Promise<ThreadListResponse>
  loadNextPage: (filters: ThreadListFilters) => Promise<void>

  // Bulk operations
  bulkThreadAction: (request: BulkThreadRequest) => Promise<StandardResponse>

  // Utility functions
  getListKey: (filters: ThreadListFilters) => string
  updateThreadInLists: (thread: Thread) => void
  removeThreadFromLists: (threadId: string) => void
  addThreadToLists: (thread: Thread) => void
  bulkUpdateThreadsInLists: (threadIds: string[], updates: Partial<Thread>) => void
}

type ThreadStore = ThreadStoreState & ThreadStoreActions

// Create the unified thread store
export const useThreadStore = create<ThreadStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    threads: new Map(),
    individualLoading: new Map(),
    individualErrors: new Map(),
    lists: new Map(),
    listMetadata: new Map(),
    listCursors: new Map(),
    listLoading: new Map(),
    listErrors: new Map(),
    bulkLoading: false,
    bulkError: null,
    clientConfig: null,
    client: null,

    // Configuration
    setClientConfig: (config: GrpcConfig) => {
      set({
        clientConfig: config,
        client: createThreadClient(config),
      })
    },

    // Utility functions
    getListKey: (filters: ThreadListFilters) => {
      return JSON.stringify(filters)
    },

    updateThreadInLists: (thread: Thread) => {
      const { lists } = get()
      const newLists = new Map(lists)

      // Update thread in all lists where it exists
      for (const [key, threadList] of newLists) {
        const index = threadList.findIndex((t) => t.id === thread.id)
        if (index !== -1) {
          const newList = [...threadList]
          newList[index] = thread
          newLists.set(key, newList)
        }
      }

      set({ lists: newLists })
    },

    removeThreadFromLists: (threadId: string) => {
      const { lists } = get()
      const newLists = new Map(lists)

      // Remove thread from all lists
      for (const [key, threadList] of newLists) {
        const filteredList = threadList.filter((t) => t.id !== threadId)
        if (filteredList.length !== threadList.length) {
          newLists.set(key, filteredList)
        }
      }

      set({ lists: newLists })
    },

    addThreadToLists: (thread: Thread) => {
      const { lists } = get()
      const newLists = new Map(lists)

      // Add thread to lists where it matches the filters
      for (const [key, threadList] of newLists) {
        try {
          const filters = JSON.parse(key) as ThreadListFilters

          // Check if thread matches filters
          let matches = true

          if (filters.chatChannelId && thread.chatChannelId !== filters.chatChannelId) {
            matches = false
          }

          if (filters.authorId && thread.authorId !== filters.authorId) {
            matches = false
          }

          if (filters.isLocked !== undefined && thread.isLocked !== filters.isLocked) {
            matches = false
          }

          if (filters.isPinned !== undefined && thread.isPinned !== filters.isPinned) {
            matches = false
          }

          if (filters.tags && filters.tags.length > 0 && matches) {
            matches = filters.tags.some((tag) => thread.tags.includes(tag))
          }

          if (matches) {
            // Add to beginning of list (most recent first)
            const newList = [thread, ...threadList]
            newLists.set(key, newList)
          }
        } catch {
          // Skip invalid filter keys
        }
      }

      set({ lists: newLists })
    },

    bulkUpdateThreadsInLists: (threadIds: string[], updates: Partial<Thread>) => {
      const { lists } = get()
      const newLists = new Map(lists)

      // Update threads in all lists where they exist
      for (const [key, threadList] of newLists) {
        let hasChanges = false
        const newList = threadList.map((thread) => {
          if (threadIds.includes(thread.id)) {
            hasChanges = true
            return { ...thread, ...updates }
          }
          return thread
        })

        if (hasChanges) {
          newLists.set(key, newList)
        }
      }

      set({ lists: newLists })
    },

    // Individual operations
    getThread: async (request: GetThreadRequest) => {
      const { clientConfig, client, threads, individualLoading, individualErrors } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const threadId = request.threadId

      // Set loading state
      set({
        individualLoading: new Map(individualLoading).set(threadId, true),
        individualErrors: new Map(individualErrors).set(threadId, null),
      })

      try {
        const thread = await getThread(client, clientConfig, request)

        // Update cache
        set({
          threads: new Map(threads).set(threadId, thread),
          individualLoading: new Map(individualLoading).set(threadId, false),
        })

        return thread
      } catch (error) {
        set({
          individualLoading: new Map(individualLoading).set(threadId, false),
          individualErrors: new Map(individualErrors).set(threadId, error as Error),
        })
        throw error
      }
    },

    createThread: async (request: CreateThreadRequest) => {
      const { clientConfig, client, threads, individualLoading, individualErrors, addThreadToLists } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const requestKey = 'create'

      // Set loading state
      set({
        individualLoading: new Map(individualLoading).set(requestKey, true),
        individualErrors: new Map(individualErrors).set(requestKey, null),
      })

      try {
        const thread = await createThread(client, clientConfig, request)

        // Update cache
        set({
          threads: new Map(threads).set(thread.id, thread),
          individualLoading: new Map(individualLoading).set(requestKey, false),
        })

        // Add to relevant lists
        addThreadToLists(thread)

        return thread
      } catch (error) {
        set({
          individualLoading: new Map(individualLoading).set(requestKey, false),
          individualErrors: new Map(individualErrors).set(requestKey, error as Error),
        })
        throw error
      }
    },

    updateThread: async (request: UpdateThreadRequest) => {
      const { clientConfig, client, threads, individualLoading, individualErrors, updateThreadInLists } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const threadId = request.threadId

      // Set loading state
      set({
        individualLoading: new Map(individualLoading).set(threadId, true),
        individualErrors: new Map(individualErrors).set(threadId, null),
      })

      try {
        const thread = await updateThread(client, clientConfig, request)

        // Update cache
        set({
          threads: new Map(threads).set(threadId, thread),
          individualLoading: new Map(individualLoading).set(threadId, false),
        })

        // Update in all lists
        updateThreadInLists(thread)

        return thread
      } catch (error) {
        set({
          individualLoading: new Map(individualLoading).set(threadId, false),
          individualErrors: new Map(individualErrors).set(threadId, error as Error),
        })
        throw error
      }
    },

    deleteThread: async (request: DeleteThreadRequest) => {
      const { clientConfig, client, threads, individualLoading, individualErrors, removeThreadFromLists } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const threadId = request.threadId

      // Set loading state
      set({
        individualLoading: new Map(individualLoading).set(threadId, true),
        individualErrors: new Map(individualErrors).set(threadId, null),
      })

      try {
        const response = await deleteThread(client, clientConfig, request)

        // Remove from cache
        const newThreads = new Map(threads)
        newThreads.delete(threadId)

        set({
          threads: newThreads,
          individualLoading: new Map(individualLoading).set(threadId, false),
        })

        // Remove from all lists
        removeThreadFromLists(threadId)

        return response
      } catch (error) {
        set({
          individualLoading: new Map(individualLoading).set(threadId, false),
          individualErrors: new Map(individualErrors).set(threadId, error as Error),
        })
        throw error
      }
    },

    // List operations
    getThreadList: async (filters: ThreadListFilters) => {
      const { clientConfig, client, lists, listMetadata, listCursors, listLoading, listErrors, getListKey } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const listKey = getListKey(filters)

      // Set loading state
      set({
        listLoading: new Map(listLoading).set(listKey, true),
        listErrors: new Map(listErrors).set(listKey, null),
      })

      try {
        const response = await getThreadList(client, clientConfig, filters)

        // Update cache
        set({
          lists: new Map(lists).set(listKey, response.data),
          listMetadata: new Map(listMetadata).set(listKey, response.metadata),
          listCursors: new Map(listCursors).set(listKey, response.cursor),
          listLoading: new Map(listLoading).set(listKey, false),
        })

        return response
      } catch (error) {
        set({
          listLoading: new Map(listLoading).set(listKey, false),
          listErrors: new Map(listErrors).set(listKey, error as Error),
        })
        throw error
      }
    },

    loadNextPage: async (filters: ThreadListFilters) => {
      const { clientConfig, client, lists, listMetadata, listCursors, listLoading, listErrors, getListKey } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const listKey = getListKey(filters)
      const currentList = lists.get(listKey) || []
      const currentMetadata = listMetadata.get(listKey)

      // Don't load if no more data or already loading
      if (!currentMetadata?.hasMore || listLoading.get(listKey)) {
        return
      }

      // Set loading state
      set({
        listLoading: new Map(listLoading).set(listKey, true),
        listErrors: new Map(listErrors).set(listKey, null),
      })

      try {
        // Create filters for next page
        const nextPageFilters = {
          ...filters,
          page: (currentMetadata.currentPage || 0) + 1,
        }

        const response = await getThreadList(client, clientConfig, nextPageFilters)

        // Append to existing list
        const newList = [...currentList, ...response.data]

        set({
          lists: new Map(lists).set(listKey, newList),
          listMetadata: new Map(listMetadata).set(listKey, response.metadata),
          listCursors: new Map(listCursors).set(listKey, response.cursor || ''),
          listLoading: new Map(listLoading).set(listKey, false),
        })
      } catch (error) {
        set({
          listLoading: new Map(listLoading).set(listKey, false),
          listErrors: new Map(listErrors).set(listKey, error as Error),
        })
        throw error
      }
    },

    // Bulk operations
    bulkThreadAction: async (request: BulkThreadRequest) => {
      const { clientConfig, client, bulkUpdateThreadsInLists } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      // Set loading state
      set({
        bulkLoading: true,
        bulkError: null,
      })

      try {
        const response = await bulkThreadAction(client, clientConfig, request)

        // Update threads in lists based on the action
        if (request.action === 'lock') {
          bulkUpdateThreadsInLists(request.threadIds, { isLocked: true })
        } else if (request.action === 'unlock') {
          bulkUpdateThreadsInLists(request.threadIds, { isLocked: false })
        } else if (request.action === 'pin') {
          bulkUpdateThreadsInLists(request.threadIds, { isPinned: true })
        } else if (request.action === 'unpin') {
          bulkUpdateThreadsInLists(request.threadIds, { isPinned: false })
        }

        set({
          bulkLoading: false,
        })

        return response
      } catch (error) {
        set({
          bulkLoading: false,
          bulkError: error as Error,
        })
        throw error
      }
    },
  }))
)

// Convenience hooks for individual operations
export const useThread = (threadId: string) => {
  const thread = useThreadStore((state: ThreadStore) => state.threads.get(threadId))
  const loading = useThreadStore((state: ThreadStore) => state.individualLoading.get(threadId) || false)
  const error = useThreadStore((state: ThreadStore) => state.individualErrors.get(threadId))
  const getThread = useThreadStore((state: ThreadStore) => state.getThread)

  return { thread, loading, error, getThread }
}

export const useCreateThread = () => {
  const loading = useThreadStore((state: ThreadStore) => state.individualLoading.get('create') || false)
  const error = useThreadStore((state: ThreadStore) => state.individualErrors.get('create'))
  const createThread = useThreadStore((state: ThreadStore) => state.createThread)

  return { loading, error, createThread }
}

export const useUpdateThread = (threadId: string) => {
  const loading = useThreadStore((state: ThreadStore) => state.individualLoading.get(threadId) || false)
  const error = useThreadStore((state: ThreadStore) => state.individualErrors.get(threadId))
  const updateThread = useThreadStore((state: ThreadStore) => state.updateThread)

  return { loading, error, updateThread }
}

export const useDeleteThread = (threadId: string) => {
  const loading = useThreadStore((state: ThreadStore) => state.individualLoading.get(threadId) || false)
  const error = useThreadStore((state: ThreadStore) => state.individualErrors.get(threadId))
  const deleteThread = useThreadStore((state: ThreadStore) => state.deleteThread)

  return { loading, error, deleteThread }
}

// Convenience hooks for list operations
export const useThreadList = (filters: ThreadListFilters) => {
  const getListKey = useThreadStore((state: ThreadStore) => state.getListKey)
  const listKey = getListKey(filters)

  const data = useThreadStore((state: ThreadStore) => state.lists.get(listKey) || [])
  const metadata = useThreadStore((state: ThreadStore) => state.listMetadata.get(listKey))
  const loading = useThreadStore((state: ThreadStore) => state.listLoading.get(listKey) || false)
  const error = useThreadStore((state: ThreadStore) => state.listErrors.get(listKey))
  const getThreadList = useThreadStore((state: ThreadStore) => state.getThreadList)
  const loadNextPage = useThreadStore((state: ThreadStore) => state.loadNextPage)

  return {
    data,
    metadata,
    loading,
    error,
    getThreadList,
    loadNextPage,
    hasMore: metadata?.hasMore || false,
    hasReachedEnd: !metadata?.hasMore,
  }
}

// Convenience hooks for bulk operations
export const useBulkThreadAction = () => {
  const loading = useThreadStore((state: ThreadStore) => state.bulkLoading)
  const error = useThreadStore((state: ThreadStore) => state.bulkError)
  const bulkThreadAction = useThreadStore((state: ThreadStore) => state.bulkThreadAction)

  return { loading, error, bulkThreadAction }
}

// Configuration hook
export const useThreadConfig = () => {
  const setClientConfig = useThreadStore((state: ThreadStore) => state.setClientConfig)
  const clientConfig = useThreadStore((state: ThreadStore) => state.clientConfig)

  return { setClientConfig, clientConfig }
}

// Legacy hook aliases for backward compatibility
export const useGetThreadData = (threadId: string) => useThread(threadId).thread
export const useGetThreadLoading = (threadId: string) => useThread(threadId).loading
export const useGetThreadError = (threadId: string) => useThread(threadId).error
export const useGetThreadAction = () => useThreadStore((state: ThreadStore) => state.getThread)

export const useCreateThreadData = () => useThreadStore((state: ThreadStore) => state.threads.get('create'))
export const useCreateThreadLoading = () => useCreateThread().loading
export const useCreateThreadError = () => useCreateThread().error
export const useCreateThreadAction = () => useCreateThread().createThread

export const useUpdateThreadData = (threadId: string) => useThread(threadId).thread
export const useUpdateThreadLoading = (threadId: string) => useUpdateThread(threadId).loading
export const useUpdateThreadError = (threadId: string) => useUpdateThread(threadId).error
export const useUpdateThreadAction = () => useThreadStore((state: ThreadStore) => state.updateThread)

export const useDeleteThreadData = () => null // Not applicable for delete operations
export const useDeleteThreadLoading = (threadId: string) => useDeleteThread(threadId).loading
export const useDeleteThreadError = (threadId: string) => useDeleteThread(threadId).error
export const useDeleteThreadAction = () => useThreadStore((state: ThreadStore) => state.deleteThread)

export const useThreadListData = (filters: ThreadListFilters) => useThreadList(filters).data
export const useThreadListMetadata = (filters: ThreadListFilters) => useThreadList(filters).metadata
export const useThreadListLoading = (filters: ThreadListFilters) => useThreadList(filters).loading
export const useThreadListError = (filters: ThreadListFilters) => useThreadList(filters).error
export const useThreadListHasReachedEnd = (filters: ThreadListFilters) => useThreadList(filters).hasReachedEnd
export const useLoadNextThreadsPage = (filters: ThreadListFilters) => {
  const loadNextPage = useThreadStore((state: ThreadStore) => state.loadNextPage)
  return () => loadNextPage(filters)
}
export const useSetThreadListFilters = () => useThreadStore((state: ThreadStore) => state.getThreadList)

export const useBulkThreadActionLoading = () => useBulkThreadAction().loading
export const useBulkThreadActionError = () => useBulkThreadAction().error
export const useBulkThreadActionData = () => null // Not applicable for bulk operations
export const useBulkThreadActionAction = () => useBulkThreadAction().bulkThreadAction
