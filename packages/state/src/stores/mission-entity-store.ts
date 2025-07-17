import { createEntityStore, type EntityStore } from '@zondax/stores'
import {
  addObjective,
  addTeamMember,
  createMissionClient,
  deleteObjective,
  getMissionDetails,
  removeTeamMember,
  updateMission,
  updateObjective,
} from '../api/mission'
import type {
  AddObjectiveRequest,
  AddTeamMemberRequest,
  DeleteObjectiveRequest,
  Mission,
  MissionDetails,
  RemoveTeamMemberRequest,
  UpdateMissionRequest,
  UpdateObjectiveRequest,
} from '../api/mission.types'

// Create the unified mission store with clean API
export const missionStore = createEntityStore<Mission>((mission) => mission.id, {
  name: 'MissionStore',
  enableOptimisticUpdates: true,
  enableErrorHandling: true,
  enableLoadingStates: true,
  enableLRUCache: true,
  enableListSynchronization: true,
})

// Enhanced store with clean CRUD methods
const extendedStore = Object.assign(missionStore, {
  // Get mission details
  getDetails: async (missionId: string): Promise<MissionDetails> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('getDetails', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      const details = await getMissionDetails(client, { baseUrl: '', metadata: {} }, { missionId })

      // Update the basic mission info in the store
      if (details.mission) {
        state.addEntity(details.mission)
      }

      return details
    } catch (error) {
      if ('setError' in state) state.setError('getDetails', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('getDetails', false)
    }
  },

  // Update mission
  update: async (missionId: string, data: Partial<UpdateMissionRequest>): Promise<Mission> => {
    const state = missionStore.getState()

    const existing = state.getEntity(missionId)
    if (!existing) throw new Error(`Mission ${missionId} not found`)

    try {
      if ('setLoading' in state) state.setLoading('update', true)

      // Optimistic update
      const optimistic = { ...existing, ...data, updatedAt: new Date() }
      state.updateEntity(missionId, optimistic)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      const updated = await updateMission(
        client,
        { baseUrl: '', metadata: {} },
        {
          missionId,
          ...data,
        }
      )

      // Update with real data
      state.updateEntity(missionId, updated)
      return updated
    } catch (error) {
      // Rollback on error
      state.updateEntity(missionId, existing)
      if ('setError' in state) state.setError('update', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('update', false)
    }
  },

  // Add objective to mission
  addObjective: async (data: AddObjectiveRequest): Promise<void> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('addObjective', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      await addObjective(client, { baseUrl: '', metadata: {} }, data)

      // Note: This doesn't return the updated mission, so we'd need to refresh
      // the mission details to see the new objective
    } catch (error) {
      if ('setError' in state) state.setError('addObjective', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('addObjective', false)
    }
  },

  // Update objective
  updateObjective: async (data: UpdateObjectiveRequest): Promise<void> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('updateObjective', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      await updateObjective(client, { baseUrl: '', metadata: {} }, data)
    } catch (error) {
      if ('setError' in state) state.setError('updateObjective', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('updateObjective', false)
    }
  },

  // Delete objective
  deleteObjective: async (data: DeleteObjectiveRequest): Promise<void> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('deleteObjective', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      await deleteObjective(client, { baseUrl: '', metadata: {} }, data)
    } catch (error) {
      if ('setError' in state) state.setError('deleteObjective', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('deleteObjective', false)
    }
  },

  // Add team member
  addTeamMember: async (data: AddTeamMemberRequest): Promise<void> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('addTeamMember', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      await addTeamMember(client, { baseUrl: '', metadata: {} }, data)
    } catch (error) {
      if ('setError' in state) state.setError('addTeamMember', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('addTeamMember', false)
    }
  },

  // Remove team member
  removeTeamMember: async (data: RemoveTeamMemberRequest): Promise<void> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('removeTeamMember', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      await removeTeamMember(client, { baseUrl: '', metadata: {} }, data)
    } catch (error) {
      if ('setError' in state) state.setError('removeTeamMember', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('removeTeamMember', false)
    }
  },

  // Clear all missions
  clear: () => {
    const state = missionStore.getState()
    state.clearAllEntities()
    state.clearSelection()
  },
})

// Export the unified store
export const useMissionStore = extendedStore

// Clean convenience hooks
export const useMission = (missionId: string) => {
  const mission = useMissionStore((state: EntityStore<Mission>) => state.getEntity(missionId))
  const loading = useMissionStore((state: EntityStore<Mission>) =>
    'loadingStates' in state ? state.loadingStates?.get?.(missionId) || false : false
  )
  const error = useMissionStore((state: EntityStore<Mission>) => ('errors' in state ? state.errors?.get?.(missionId) : undefined))

  return { mission, loading, error }
}

export const useMissionDetails = (missionId: string) => {
  const loading = useMissionStore((state: EntityStore<Mission>) =>
    'loadingStates' in state ? state.loadingStates?.getDetails || false : false
  )
  const error = useMissionStore((state: EntityStore<Mission>) => ('errors' in state ? state.errors?.getDetails : undefined))

  return {
    loading,
    error,
    getDetails: () => useMissionStore.getDetails(missionId),
  }
}

export const useUpdateMission = (missionId: string) => {
  const loading = useMissionStore((state: EntityStore<Mission>) =>
    'loadingStates' in state ? state.loadingStates?.update || false : false
  )
  const error = useMissionStore((state: EntityStore<Mission>) => ('errors' in state ? state.errors?.update : undefined))

  return {
    loading,
    error,
    update: (data: Partial<UpdateMissionRequest>) => useMissionStore.update(missionId, data),
  }
}

// Selectors for common queries
export const missionSelectors = {
  // Get all missions
  getAll: () => useMissionStore.getState().getAllEntities(),

  // Get mission by ID
  getById: (id: string) => useMissionStore.getState().getEntity(id),

  // Get selected mission
  getSelected: () => {
    const state = useMissionStore.getState()
    return state.selectedEntityId ? state.getEntity(state.selectedEntityId) : undefined
  },

  // Check if mission exists
  exists: (id: string) => useMissionStore.getState().hasEntity(id),

  // Get mission count
  getCount: () => useMissionStore.getState().getEntityCount(),
}
