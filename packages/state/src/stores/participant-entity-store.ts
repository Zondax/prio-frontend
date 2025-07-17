import { createEntityStore, type EntityStore } from '@zondax/stores'
import { createParticipantClient, deleteParticipant, getParticipant, updateParticipant } from '../api/participant'
import type { Participant, UpdateParticipantRequest } from '../api/participant.types'

// Create the unified participant store with clean API
export const participantStore = createEntityStore<Participant>((participant) => participant.id, {
  name: 'ParticipantStore',
  enableOptimisticUpdates: true,
  enableErrorHandling: true,
  enableLoadingStates: true,
  enableLRUCache: true,
  enableListSynchronization: true,
})

// Enhanced store with clean CRUD methods
const extendedStore = Object.assign(participantStore, {
  // Get participant
  get: async (participantId: string): Promise<Participant> => {
    const state = participantStore.getState()

    // Check cache first
    const cached = state.getEntity(participantId)
    if (cached) return cached

    try {
      if ('setLoading' in state) state.setLoading('get', true)

      const client = createParticipantClient({ baseUrl: '', metadata: {} })
      const participant = await getParticipant(client, { baseUrl: '', metadata: {} }, { participantId })

      state.addEntity(participant)
      return participant
    } catch (error) {
      if ('setError' in state) state.setError('get', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('get', false)
    }
  },

  // Update participant
  update: async (participantId: string, data: Partial<UpdateParticipantRequest>): Promise<Participant> => {
    const state = participantStore.getState()

    const existing = state.getEntity(participantId)
    if (!existing) throw new Error(`Participant ${participantId} not found`)

    try {
      if ('setLoading' in state) state.setLoading('update', true)

      // Optimistic update
      const optimistic = { ...existing, ...data, updatedAt: new Date() }
      state.updateEntity(participantId, optimistic)

      const client = createParticipantClient({ baseUrl: '', metadata: {} })
      const updated = await updateParticipant(
        client,
        { baseUrl: '', metadata: {} },
        {
          participantId,
          ...data,
        }
      )

      // Update with real data
      state.updateEntity(participantId, updated)
      return updated
    } catch (error) {
      // Rollback on error
      state.updateEntity(participantId, existing)
      if ('setError' in state) state.setError('update', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('update', false)
    }
  },

  // Delete participant
  delete: async (participantId: string): Promise<void> => {
    const state = participantStore.getState()

    const existing = state.getEntity(participantId)
    if (!existing) throw new Error(`Participant ${participantId} not found`)

    try {
      if ('setLoading' in state) state.setLoading('delete', true)

      // Optimistic removal
      state.removeEntity(participantId)

      const client = createParticipantClient({ baseUrl: '', metadata: {} })
      await deleteParticipant(client, { baseUrl: '', metadata: {} }, { participantId })
    } catch (error) {
      // Rollback on error
      state.addEntity(existing)
      if ('setError' in state) state.setError('delete', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('delete', false)
    }
  },

  // Clear all participants
  clear: () => {
    const state = participantStore.getState()
    state.clearAllEntities()
    state.clearSelection()
  },
})

// Export the unified store
export const useParticipantStore = extendedStore

// Clean convenience hooks
export const useParticipant = (participantId: string) => {
  const participant = useParticipantStore((state: EntityStore<Participant>) => state.getEntity(participantId))
  const loading = useParticipantStore((state: EntityStore<Participant>) => state.isLoading('get'))
  const error = useParticipantStore((state: EntityStore<Participant>) => state.getError('get'))

  return { participant, loading, error }
}

export const useUpdateParticipant = (participantId: string) => {
  const loading = useParticipantStore((state: EntityStore<Participant>) => state.isLoading('update'))
  const error = useParticipantStore((state: EntityStore<Participant>) => state.getError('update'))

  return {
    loading,
    error,
    update: (data: Partial<UpdateParticipantRequest>) => useParticipantStore.update(participantId, data),
  }
}

export const useDeleteParticipant = (participantId: string) => {
  const loading = useParticipantStore((state: EntityStore<Participant>) => state.isLoading('delete'))
  const error = useParticipantStore((state: EntityStore<Participant>) => state.getError('delete'))

  return {
    loading,
    error,
    delete: () => useParticipantStore.delete(participantId),
  }
}

// Selectors for common queries
export const participantSelectors = {
  // Get all participants
  getAll: () => useParticipantStore.getState().getAllEntities(),

  // Get participant by ID
  getById: (id: string) => useParticipantStore.getState().getEntity(id),

  // Get selected participant
  getSelected: () => {
    const state = useParticipantStore.getState()
    return state.selectedEntityId ? state.getEntity(state.selectedEntityId) : undefined
  },

  // Check if participant exists
  exists: (id: string) => useParticipantStore.getState().hasEntity(id),

  // Get participant count
  getCount: () => useParticipantStore.getState().getEntityCount(),
}
