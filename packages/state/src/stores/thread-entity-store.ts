import { createEntityStore, type EntityStore } from '@zondax/stores'
import { createThread, createThreadClient, deleteThread, getThread, updateThread } from '../api/thread'
import type { CreateThreadRequest, Thread, UpdateThreadRequest } from '../api/thread.types'

// Create the unified thread store with clean API
export const threadStore = createEntityStore<Thread>((thread) => thread.id, {
  name: 'ThreadStore',
  enableOptimisticUpdates: true,
  enableErrorHandling: true,
  enableLoadingStates: true,
  enableLRUCache: true,
  enableListSynchronization: true,
})

// Enhanced store with clean CRUD methods
const extendedStore = Object.assign(threadStore, {
  // Create thread
  create: async (data: CreateThreadRequest): Promise<Thread> => {
    const state = threadStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('create', true)

      const client = createThreadClient({ baseUrl: '', metadata: {} })

      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticThread: Thread = {
        id: tempId,
        title: data.title,
        description: data.description,
        status: 'active',
        participantCount: 0,
        messageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      state.addEntity(optimisticThread)

      // Real API call
      const newThread = await createThread(client, { baseUrl: '', metadata: {} }, data)

      // Replace optimistic with real data
      state.removeEntity(tempId)
      state.addEntity(newThread)

      return newThread
    } catch (error) {
      if ('setError' in state) state.setError('create', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('create', false)
    }
  },

  // Get thread
  get: async (threadId: string): Promise<Thread> => {
    const state = threadStore.getState()

    // Check cache first
    const cached = state.getEntity(threadId)
    if (cached) return cached

    try {
      if ('setLoading' in state) state.setLoading('get', true)

      const client = createThreadClient({ baseUrl: '', metadata: {} })
      const thread = await getThread(client, { baseUrl: '', metadata: {} }, { threadId })

      state.addEntity(thread)
      return thread
    } catch (error) {
      if ('setError' in state) state.setError('get', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('get', false)
    }
  },

  // Update thread
  update: async (threadId: string, data: Partial<UpdateThreadRequest>): Promise<Thread> => {
    const state = threadStore.getState()

    const existing = state.getEntity(threadId)
    if (!existing) throw new Error(`Thread ${threadId} not found`)

    try {
      if ('setLoading' in state) state.setLoading('update', true)

      // Optimistic update
      const optimistic = { ...existing, ...data, updatedAt: new Date() }
      state.updateEntity(threadId, optimistic)

      const client = createThreadClient({ baseUrl: '', metadata: {} })
      const updated = await updateThread(
        client,
        { baseUrl: '', metadata: {} },
        {
          threadId,
          ...data,
        }
      )

      // Update with real data
      state.updateEntity(threadId, updated)
      return updated
    } catch (error) {
      // Rollback on error
      state.updateEntity(threadId, existing)
      if ('setError' in state) state.setError('update', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('update', false)
    }
  },

  // Delete thread
  delete: async (threadId: string): Promise<void> => {
    const state = threadStore.getState()

    const existing = state.getEntity(threadId)
    if (!existing) throw new Error(`Thread ${threadId} not found`)

    try {
      if ('setLoading' in state) state.setLoading('delete', true)

      // Optimistic removal
      state.removeEntity(threadId)

      const client = createThreadClient({ baseUrl: '', metadata: {} })
      await deleteThread(client, { baseUrl: '', metadata: {} }, { threadId })
    } catch (error) {
      // Rollback on error
      state.addEntity(existing)
      if ('setError' in state) state.setError('delete', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('delete', false)
    }
  },

  // Clear all threads
  clear: () => {
    const state = threadStore.getState()
    state.clearAllEntities()
    state.clearSelection()
  },
})

// Export the unified store
export const useThreadStore = extendedStore

// Clean convenience hooks
export const useThread = (threadId: string) => {
  const thread = useThreadStore((state: EntityStore<Thread>) => state.getEntity(threadId))
  const loading = useThreadStore((state: EntityStore<Thread>) =>
    'loadingStates' in state ? state.loadingStates?.get?.(threadId) || false : false
  )
  const error = useThreadStore((state: EntityStore<Thread>) => ('errors' in state ? state.errors?.get?.(threadId) : undefined))

  return { thread, loading, error }
}

export const useCreateThread = () => {
  const loading = useThreadStore((state: EntityStore<Thread>) => ('loadingStates' in state ? state.loadingStates?.create || false : false))
  const error = useThreadStore((state: EntityStore<Thread>) => ('errors' in state ? state.errors?.create : undefined))

  return {
    loading,
    error,
    create: useThreadStore.create,
  }
}

export const useUpdateThread = (threadId: string) => {
  const loading = useThreadStore((state: EntityStore<Thread>) => ('loadingStates' in state ? state.loadingStates?.update || false : false))
  const error = useThreadStore((state: EntityStore<Thread>) => ('errors' in state ? state.errors?.update : undefined))

  return {
    loading,
    error,
    update: (data: Partial<UpdateThreadRequest>) => useThreadStore.update(threadId, data),
  }
}

export const useDeleteThread = (threadId: string) => {
  const loading = useThreadStore((state: EntityStore<Thread>) => ('loadingStates' in state ? state.loadingStates?.delete || false : false))
  const error = useThreadStore((state: EntityStore<Thread>) => ('errors' in state ? state.errors?.delete : undefined))

  return {
    loading,
    error,
    delete: () => useThreadStore.delete(threadId),
  }
}

// Selectors for common queries
export const threadSelectors = {
  // Get all threads
  getAll: () => useThreadStore.getState().getAllEntities(),

  // Get thread by ID
  getById: (id: string) => useThreadStore.getState().getEntity(id),

  // Get selected thread
  getSelected: () => {
    const state = useThreadStore.getState()
    return state.selectedEntityId ? state.getEntity(state.selectedEntityId) : undefined
  },

  // Check if thread exists
  exists: (id: string) => useThreadStore.getState().hasEntity(id),

  // Get thread count
  getCount: () => useThreadStore.getState().getEntityCount(),

  // Get threads by status
  getByStatus: (status: string) => useThreadStore.getState().findEntities((t) => t.status === status),
}
