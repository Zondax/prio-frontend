import { createEntityStore, type EntityStore } from '@zondax/stores'
import { createBookmark, createBookmarkClient, deleteBookmark, getBookmark, updateBookmark } from '../api/bookmark'
import type { ConversationBookmark, CreateBookmarkRequest, UpdateBookmarkRequest } from '../api/bookmark.types'
import { createBookmarkListClient, searchBookmarks } from '../api/bookmark-list'
import type { BookmarkListFilters } from '../api/bookmark-list.types'

// Create the unified bookmark store with clean API
export const bookmarkStore = createEntityStore<ConversationBookmark>((bookmark) => bookmark.id, {
  name: 'BookmarkStore',
  enableOptimisticUpdates: true,
  enableErrorHandling: true,
  enableLoadingStates: true,
  enableLRUCache: true,
  enableListSynchronization: true,
})

// Enhanced store with clean CRUD methods
const extendedStore = Object.assign(bookmarkStore, {
  // Create bookmark with clean name
  create: async (data: CreateBookmarkRequest): Promise<ConversationBookmark> => {
    const state = bookmarkStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('create', true)

      const client = createBookmarkClient({ baseUrl: '', metadata: {} })

      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticBookmark: ConversationBookmark = {
        id: tempId,
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

      state.addEntity(optimisticBookmark)

      // Real API call
      const newBookmark = await createBookmark(client, { baseUrl: '', metadata: {} }, data)

      // Replace optimistic with real data
      state.removeEntity(tempId)
      state.addEntity(newBookmark)

      return newBookmark
    } catch (error) {
      if ('setError' in state) state.setError('create', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('create', false)
    }
  },

  // Get bookmark with clean name
  get: async (bookmarkId: string): Promise<ConversationBookmark> => {
    const state = bookmarkStore.getState()

    // Check cache first
    const cached = state.getEntity(bookmarkId)
    if (cached) return cached

    try {
      if ('setLoading' in state) state.setLoading('get', true)

      const client = createBookmarkClient({ baseUrl: '', metadata: {} })
      const bookmark = await getBookmark(client, { baseUrl: '', metadata: {} }, { bookmarkId })

      state.addEntity(bookmark)
      return bookmark
    } catch (error) {
      if ('setError' in state) state.setError('get', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('get', false)
    }
  },

  // Update bookmark with clean name
  update: async (bookmarkId: string, data: Partial<UpdateBookmarkRequest>): Promise<ConversationBookmark> => {
    const state = bookmarkStore.getState()

    const existing = state.getEntity(bookmarkId)
    if (!existing) throw new Error(`Bookmark ${bookmarkId} not found`)

    try {
      if ('setLoading' in state) state.setLoading('update', true)

      // Optimistic update
      const optimistic = { ...existing, ...data, updatedAt: new Date() }
      state.updateEntity(bookmarkId, optimistic)

      const client = createBookmarkClient({ baseUrl: '', metadata: {} })
      const updated = await updateBookmark(
        client,
        { baseUrl: '', metadata: {} },
        {
          bookmarkId,
          ...data,
        }
      )

      // Update with real data
      state.updateEntity(bookmarkId, updated)
      return updated
    } catch (error) {
      // Rollback on error
      state.updateEntity(bookmarkId, existing)
      if ('setError' in state) state.setError('update', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('update', false)
    }
  },

  // Delete bookmark with clean name
  delete: async (bookmarkId: string): Promise<void> => {
    const state = bookmarkStore.getState()

    const existing = state.getEntity(bookmarkId)
    if (!existing) throw new Error(`Bookmark ${bookmarkId} not found`)

    try {
      if ('setLoading' in state) state.setLoading('delete', true)

      // Optimistic removal
      state.removeEntity(bookmarkId)

      const client = createBookmarkClient({ baseUrl: '', metadata: {} })
      await deleteBookmark(client, { baseUrl: '', metadata: {} }, { bookmarkId })
    } catch (error) {
      // Rollback on error
      state.addEntity(existing)
      if ('setError' in state) state.setError('delete', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('delete', false)
    }
  },

  // Search bookmarks with clean name
  search: async (filters?: BookmarkListFilters): Promise<void> => {
    const state = bookmarkStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('search', true)

      const client = createBookmarkListClient({ baseUrl: '', metadata: {} })
      const response = await searchBookmarks(client, { baseUrl: '', metadata: {} }, filters)

      // Add all bookmarks to store
      state.addEntities(response.data)
    } catch (error) {
      if ('setError' in state) state.setError('search', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('search', false)
    }
  },

  // Clear all bookmarks
  clear: () => {
    const state = bookmarkStore.getState()
    state.clearAllEntities()
    state.clearSelection()
  },
})

// Export the unified store
export const useBookmarkStore = extendedStore

// Clean convenience hooks
export const useBookmark = (bookmarkId: string) => {
  const bookmark = useBookmarkStore((state: EntityStore<ConversationBookmark>) => state.getEntity(bookmarkId))
  const loading = useBookmarkStore((state: EntityStore<ConversationBookmark>) =>
    'loadingStates' in state ? state.loadingStates?.get?.(bookmarkId) || false : false
  )
  const error = useBookmarkStore((state: EntityStore<ConversationBookmark>) =>
    'errors' in state ? state.errors?.get?.(bookmarkId) : undefined
  )

  return { bookmark, loading, error }
}

export const useCreateBookmark = () => {
  const loading = useBookmarkStore((state: EntityStore<ConversationBookmark>) =>
    'loadingStates' in state ? state.loadingStates?.create || false : false
  )
  const error = useBookmarkStore((state: EntityStore<ConversationBookmark>) => ('errors' in state ? state.errors?.create : undefined))

  return {
    loading,
    error,
    create: useBookmarkStore.create,
  }
}

export const useUpdateBookmark = (bookmarkId: string) => {
  const loading = useBookmarkStore((state: EntityStore<ConversationBookmark>) =>
    'loadingStates' in state ? state.loadingStates?.update || false : false
  )
  const error = useBookmarkStore((state: EntityStore<ConversationBookmark>) => ('errors' in state ? state.errors?.update : undefined))

  return {
    loading,
    error,
    update: (data: Partial<UpdateBookmarkRequest>) => useBookmarkStore.update(bookmarkId, data),
  }
}

export const useDeleteBookmark = (bookmarkId: string) => {
  const loading = useBookmarkStore((state: EntityStore<ConversationBookmark>) =>
    'loadingStates' in state ? state.loadingStates?.delete || false : false
  )
  const error = useBookmarkStore((state: EntityStore<ConversationBookmark>) => ('errors' in state ? state.errors?.delete : undefined))

  return {
    loading,
    error,
    delete: () => useBookmarkStore.delete(bookmarkId),
  }
}

// Selectors for common queries
export const bookmarkSelectors = {
  // Get all bookmarks
  getAll: () => useBookmarkStore.getState().getAllEntities(),

  // Get bookmark by ID
  getById: (id: string) => useBookmarkStore.getState().getEntity(id),

  // Get selected bookmark
  getSelected: () => {
    const state = useBookmarkStore.getState()
    return state.selectedEntityId ? state.getEntity(state.selectedEntityId) : undefined
  },

  // Check if bookmark exists
  exists: (id: string) => useBookmarkStore.getState().hasEntity(id),

  // Get bookmarks by conversation
  getByConversation: (conversationId: string) => useBookmarkStore.getState().findEntities((b) => b.conversationId === conversationId),

  // Search by text
  searchByText: (query: string) => {
    const lowerQuery = query.toLowerCase()
    return useBookmarkStore
      .getState()
      .findEntities((b) => b.name.toLowerCase().includes(lowerQuery) || (b.description?.toLowerCase().includes(lowerQuery) ?? false))
  },

  // Get count
  getCount: () => useBookmarkStore.getState().getEntityCount(),
}
