import { createEntityStore, type EntityStore } from '@zondax/stores'
import {
  addMissionMember,
  createMission,
  createMissionClient,
  deleteMission,
  getMission,
  removeMissionMember,
  updateMission,
  updateMissionMemberRole,
} from '../api/mission'
import type {
  AddMissionMemberRequest,
  CreateMissionRequest,
  Mission,
  RemoveMissionMemberRequest,
  UpdateMissionMemberRoleRequest,
  UpdateMissionRequest,
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
  // Create mission
  create: async (data: CreateMissionRequest): Promise<Mission | undefined> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('create', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      const response = await createMission(client, { baseUrl: '', metadata: {} }, data)

      // Add the new mission to the store
      if (response.mission) {
        state.addEntity(response.mission)
      }

      return response.mission
    } catch (error) {
      if ('setError' in state) state.setError('create', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('create', false)
    }
  },

  // Get mission by ID
  getMission: async (missionId: string): Promise<Mission | undefined> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('getMission', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      const response = await getMission(client, { baseUrl: '', metadata: {} }, missionId)

      // Update the mission info in the store
      if (response.mission) {
        state.addEntity(response.mission)
      }

      return response.mission
    } catch (error) {
      if ('setError' in state) state.setError('getMission', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('getMission', false)
    }
  },

  // Update mission
  update: async (missionId: string, data: Partial<UpdateMissionRequest>): Promise<Mission | undefined> => {
    const state = missionStore.getState()

    const existing = state.getEntity(missionId)
    if (!existing) throw new Error(`Mission ${missionId} not found`)

    try {
      if ('setLoading' in state) state.setLoading('update', true)

      // Optimistic update
      const optimistic = { ...existing, ...data, updatedAt: new Date() }
      state.updateEntity(missionId, optimistic)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      const response = await updateMission(
        client,
        { baseUrl: '', metadata: {} },
        {
          id: missionId,
          ...data,
        }
      )

      // Update with real data
      if (response.mission) {
        state.updateEntity(missionId, response.mission)
      }
      return response.mission
    } catch (error) {
      // Rollback on error
      state.updateEntity(missionId, existing)
      if ('setError' in state) state.setError('update', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('update', false)
    }
  },

  // Delete mission
  delete: async (missionId: string): Promise<void> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('delete', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      await deleteMission(client, { baseUrl: '', metadata: {} }, missionId)

      // Remove from store
      state.removeEntity(missionId)
    } catch (error) {
      if ('setError' in state) state.setError('delete', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('delete', false)
    }
  },

  // Add mission member
  addMember: async (data: AddMissionMemberRequest): Promise<void> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('addMember', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      await addMissionMember(client, { baseUrl: '', metadata: {} }, data)
    } catch (error) {
      if ('setError' in state) state.setError('addMember', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('addMember', false)
    }
  },

  // Update mission member role
  updateMemberRole: async (data: UpdateMissionMemberRoleRequest): Promise<void> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('updateMemberRole', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      await updateMissionMemberRole(client, { baseUrl: '', metadata: {} }, data)
    } catch (error) {
      if ('setError' in state) state.setError('updateMemberRole', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('updateMemberRole', false)
    }
  },

  // Remove mission member
  removeMember: async (data: RemoveMissionMemberRequest): Promise<void> => {
    const state = missionStore.getState()

    try {
      if ('setLoading' in state) state.setLoading('removeMember', true)

      const client = createMissionClient({ baseUrl: '', metadata: {} })
      await removeMissionMember(client, { baseUrl: '', metadata: {} }, data)
    } catch (error) {
      if ('setError' in state) state.setError('removeMember', error as Error)
      throw error
    } finally {
      if ('setLoading' in state) state.setLoading('removeMember', false)
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
  const loading = useMissionStore((state: EntityStore<Mission>) => state.isLoading('get'))
  const error = useMissionStore((state: EntityStore<Mission>) => state.getError('get'))

  return { mission, loading, error }
}

export const useMissions = () => {
  const missions = useMissionStore((state: EntityStore<Mission>) => state.getAllEntities())
  const loading = useMissionStore((state: EntityStore<Mission>) => state.isLoading('list'))
  const error = useMissionStore((state: EntityStore<Mission>) => state.getError('list'))

  return { missions, loading, error }
}

export const useSelectedMission = () => {
  const selectedId = useMissionStore((state: EntityStore<Mission>) => state.selectedEntityId)
  const getEntity = useMissionStore((state: EntityStore<Mission>) => state.getEntity)
  const selectEntity = useMissionStore((state: EntityStore<Mission>) => state.selectEntity)
  const clearSelection = useMissionStore((state: EntityStore<Mission>) => state.clearSelection)

  const selectedMission = selectedId ? getEntity(selectedId) : null
  const selectMission = (id: string) => selectEntity(id)

  return { selectedMission, selectedId, selectMission, clearSelection }
}
