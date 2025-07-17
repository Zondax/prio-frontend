import type { GrpcConfig } from '@mono-grpc'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

import {
  createParticipantClient,
  type DeleteParticipantRequest,
  deleteParticipant,
  type GetParticipantRequest,
  getParticipant,
  type Participant,
  type StandardResponse,
  type UpdateParticipantRequest,
  updateParticipant,
} from '../api/participant'

import {
  type AddParticipantRequest,
  addParticipant,
  type BulkParticipantRequest,
  bulkParticipantAction,
  getParticipantList,
  type ParticipantListFilters,
  type ParticipantListMetadata,
  type ParticipantListResponse,
} from '../api/participant-list'

interface ParticipantStoreState {
  participants: Map<string, Participant>
  individualLoading: Map<string, boolean>
  individualErrors: Map<string, Error | null>
  lists: Map<string, Participant[]>
  listMetadata: Map<string, ParticipantListMetadata>
  listCursors: Map<string, string>
  listLoading: Map<string, boolean>
  listErrors: Map<string, Error | null>
  bulkLoading: boolean
  bulkError: Error | null
  clientConfig: GrpcConfig | null
  client: ReturnType<typeof createParticipantClient> | null
}

interface ParticipantStoreActions {
  setClientConfig: (config: GrpcConfig) => void
  getParticipant: (request: GetParticipantRequest) => Promise<Participant>
  updateParticipant: (request: UpdateParticipantRequest) => Promise<Participant>
  deleteParticipant: (request: DeleteParticipantRequest) => Promise<StandardResponse>
  getParticipantList: (filters: ParticipantListFilters) => Promise<ParticipantListResponse>
  loadNextPage: (filters: ParticipantListFilters) => Promise<void>
  addParticipant: (request: AddParticipantRequest) => Promise<Participant>
  bulkParticipantAction: (request: BulkParticipantRequest) => Promise<StandardResponse>
  getListKey: (filters: ParticipantListFilters) => string
  updateParticipantInLists: (participant: Participant) => void
  removeParticipantFromLists: (participantId: string) => void
  addParticipantToLists: (participant: Participant) => void
}

type ParticipantStore = ParticipantStoreState & ParticipantStoreActions

export const useParticipantStore = create<ParticipantStore>()(
  subscribeWithSelector((set, get) => ({
    participants: new Map(),
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

    setClientConfig: (config: GrpcConfig) => {
      set({
        clientConfig: config,
        client: createParticipantClient(config),
      })
    },

    getListKey: (filters: ParticipantListFilters) => JSON.stringify(filters),

    updateParticipantInLists: (participant: Participant) => {
      const { lists } = get()
      const newLists = new Map(lists)

      for (const [key, participantList] of newLists) {
        const index = participantList.findIndex((p) => p.id === participant.id)
        if (index !== -1) {
          const newList = [...participantList]
          newList[index] = participant
          newLists.set(key, newList)
        }
      }

      set({ lists: newLists })
    },

    removeParticipantFromLists: (participantId: string) => {
      const { lists } = get()
      const newLists = new Map(lists)

      for (const [key, participantList] of newLists) {
        const filteredList = participantList.filter((p) => p.id !== participantId)
        if (filteredList.length !== participantList.length) {
          newLists.set(key, filteredList)
        }
      }

      set({ lists: newLists })
    },

    addParticipantToLists: (participant: Participant) => {
      const { lists } = get()
      const newLists = new Map(lists)

      for (const [key, participantList] of newLists) {
        try {
          const filters = JSON.parse(key) as ParticipantListFilters
          let matches = true

          if (filters.role && participant.role !== filters.role) {
            matches = false
          }
          if (filters.searchQuery && matches) {
            const query = filters.searchQuery.toLowerCase()
            matches = participant.name.toLowerCase().includes(query) || participant.email.toLowerCase().includes(query)
          }

          if (matches) {
            const newList = [participant, ...participantList]
            newLists.set(key, newList)
          }
        } catch {
          // Skip invalid filter keys
        }
      }

      set({ lists: newLists })
    },

    getParticipant: async (request: GetParticipantRequest) => {
      const { clientConfig, client, participants, individualLoading, individualErrors } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const participantId = request.participantId

      set({
        individualLoading: new Map(individualLoading).set(participantId, true),
        individualErrors: new Map(individualErrors).set(participantId, null),
      })

      try {
        const participant = await getParticipant(client, clientConfig, request)

        set({
          participants: new Map(participants).set(participantId, participant),
          individualLoading: new Map(individualLoading).set(participantId, false),
        })

        return participant
      } catch (error) {
        set({
          individualLoading: new Map(individualLoading).set(participantId, false),
          individualErrors: new Map(individualErrors).set(participantId, error as Error),
        })
        throw error
      }
    },

    updateParticipant: async (request: UpdateParticipantRequest) => {
      const { clientConfig, client, participants, individualLoading, individualErrors, updateParticipantInLists } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const participantId = request.participantId

      set({
        individualLoading: new Map(individualLoading).set(participantId, true),
        individualErrors: new Map(individualErrors).set(participantId, null),
      })

      try {
        const participant = await updateParticipant(client, clientConfig, request)

        set({
          participants: new Map(participants).set(participantId, participant),
          individualLoading: new Map(individualLoading).set(participantId, false),
        })

        updateParticipantInLists(participant)

        return participant
      } catch (error) {
        set({
          individualLoading: new Map(individualLoading).set(participantId, false),
          individualErrors: new Map(individualErrors).set(participantId, error as Error),
        })
        throw error
      }
    },

    deleteParticipant: async (request: DeleteParticipantRequest) => {
      const { clientConfig, client, participants, individualLoading, individualErrors, removeParticipantFromLists } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const participantId = request.participantId

      set({
        individualLoading: new Map(individualLoading).set(participantId, true),
        individualErrors: new Map(individualErrors).set(participantId, null),
      })

      try {
        const response = await deleteParticipant(client, clientConfig, request)

        const newParticipants = new Map(participants)
        newParticipants.delete(participantId)

        set({
          participants: newParticipants,
          individualLoading: new Map(individualLoading).set(participantId, false),
        })

        removeParticipantFromLists(participantId)

        return response
      } catch (error) {
        set({
          individualLoading: new Map(individualLoading).set(participantId, false),
          individualErrors: new Map(individualErrors).set(participantId, error as Error),
        })
        throw error
      }
    },

    addParticipant: async (request: AddParticipantRequest) => {
      const { clientConfig, client, participants, individualLoading, individualErrors, addParticipantToLists } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const requestKey = 'add'

      set({
        individualLoading: new Map(individualLoading).set(requestKey, true),
        individualErrors: new Map(individualErrors).set(requestKey, null),
      })

      try {
        const participant = await addParticipant(client, clientConfig, request)

        set({
          participants: new Map(participants).set(participant.id, participant),
          individualLoading: new Map(individualLoading).set(requestKey, false),
        })

        addParticipantToLists(participant)

        return participant
      } catch (error) {
        set({
          individualLoading: new Map(individualLoading).set(requestKey, false),
          individualErrors: new Map(individualErrors).set(requestKey, error as Error),
        })
        throw error
      }
    },

    getParticipantList: async (filters: ParticipantListFilters) => {
      const { clientConfig, client, lists, listMetadata, listCursors, listLoading, listErrors, getListKey } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const listKey = getListKey(filters)

      set({
        listLoading: new Map(listLoading).set(listKey, true),
        listErrors: new Map(listErrors).set(listKey, null),
      })

      try {
        const response = await getParticipantList(client, clientConfig, filters)

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

    loadNextPage: async (filters: ParticipantListFilters) => {
      const { clientConfig, client, lists, listMetadata, listCursors, listLoading, listErrors, getListKey } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      const listKey = getListKey(filters)
      const currentList = lists.get(listKey) || []
      const currentMetadata = listMetadata.get(listKey)

      if (!currentMetadata?.hasMore || listLoading.get(listKey)) {
        return
      }

      set({
        listLoading: new Map(listLoading).set(listKey, true),
        listErrors: new Map(listErrors).set(listKey, null),
      })

      try {
        const nextPageFilters = {
          ...filters,
          page: (currentMetadata.currentPage || 0) + 1,
        }

        const response = await getParticipantList(client, clientConfig, nextPageFilters)
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

    bulkParticipantAction: async (request: BulkParticipantRequest) => {
      const { clientConfig, client } = get()

      if (!clientConfig || !client) {
        throw new Error('Client not configured')
      }

      set({
        bulkLoading: true,
        bulkError: null,
      })

      try {
        const response = await bulkParticipantAction(client, clientConfig, request)

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

// Convenience hooks
export const useParticipant = (participantId: string) => {
  const participant = useParticipantStore((state: ParticipantStore) => state.participants.get(participantId))
  const loading = useParticipantStore((state: ParticipantStore) => state.individualLoading.get(participantId) || false)
  const error = useParticipantStore((state: ParticipantStore) => state.individualErrors.get(participantId))
  const getParticipant = useParticipantStore((state: ParticipantStore) => state.getParticipant)

  return { participant, loading, error, getParticipant }
}

export const useParticipantList = (filters: ParticipantListFilters) => {
  const getListKey = useParticipantStore((state: ParticipantStore) => state.getListKey)
  const listKey = getListKey(filters)

  const data = useParticipantStore((state: ParticipantStore) => state.lists.get(listKey) || [])
  const metadata = useParticipantStore((state: ParticipantStore) => state.listMetadata.get(listKey))
  const loading = useParticipantStore((state: ParticipantStore) => state.listLoading.get(listKey) || false)
  const error = useParticipantStore((state: ParticipantStore) => state.listErrors.get(listKey))
  const getParticipantList = useParticipantStore((state: ParticipantStore) => state.getParticipantList)
  const loadNextPage = useParticipantStore((state: ParticipantStore) => state.loadNextPage)

  return {
    data,
    metadata,
    loading,
    error,
    getParticipantList,
    loadNextPage,
    hasMore: metadata?.hasMore || false,
    hasReachedEnd: !metadata?.hasMore,
  }
}

export const useAddParticipant = () => {
  const loading = useParticipantStore((state: ParticipantStore) => state.individualLoading.get('add') || false)
  const error = useParticipantStore((state: ParticipantStore) => state.individualErrors.get('add'))
  const addParticipant = useParticipantStore((state: ParticipantStore) => state.addParticipant)

  return { loading, error, addParticipant }
}

export const useBulkParticipantAction = () => {
  const loading = useParticipantStore((state: ParticipantStore) => state.bulkLoading)
  const error = useParticipantStore((state: ParticipantStore) => state.bulkError)
  const bulkParticipantAction = useParticipantStore((state: ParticipantStore) => state.bulkParticipantAction)

  return { loading, error, bulkParticipantAction }
}

export const useParticipantConfig = () => {
  const setClientConfig = useParticipantStore((state: ParticipantStore) => state.setClientConfig)
  const clientConfig = useParticipantStore((state: ParticipantStore) => state.clientConfig)

  return { setClientConfig, clientConfig }
}

// Legacy hook aliases for backward compatibility
export const useGetParticipantData = (participantId: string) => useParticipant(participantId).participant
export const useGetParticipantLoading = (participantId: string) => useParticipant(participantId).loading
export const useGetParticipantError = (participantId: string) => useParticipant(participantId).error
export const useGetParticipantAction = () => useParticipantStore((state: ParticipantStore) => state.getParticipant)

export const useUpdateParticipantData = (participantId: string) => useParticipant(participantId).participant
export const useUpdateParticipantLoading = (participantId: string) =>
  useParticipantStore((state: ParticipantStore) => state.individualLoading.get(participantId) || false)
export const useUpdateParticipantError = (participantId: string) =>
  useParticipantStore((state: ParticipantStore) => state.individualErrors.get(participantId))
export const useUpdateParticipantAction = () => useParticipantStore((state: ParticipantStore) => state.updateParticipant)

export const useDeleteParticipantData = () => null
export const useDeleteParticipantLoading = (participantId: string) =>
  useParticipantStore((state: ParticipantStore) => state.individualLoading.get(participantId) || false)
export const useDeleteParticipantError = (participantId: string) =>
  useParticipantStore((state: ParticipantStore) => state.individualErrors.get(participantId))
export const useDeleteParticipantAction = () => useParticipantStore((state: ParticipantStore) => state.deleteParticipant)

export const useParticipantListData = (filters: ParticipantListFilters) => useParticipantList(filters).data
export const useParticipantListMetadata = (filters: ParticipantListFilters) => useParticipantList(filters).metadata
export const useParticipantListLoading = (filters: ParticipantListFilters) => useParticipantList(filters).loading
export const useParticipantListError = (filters: ParticipantListFilters) => useParticipantList(filters).error
export const useParticipantListHasReachedEnd = (filters: ParticipantListFilters) => useParticipantList(filters).hasReachedEnd
export const useLoadNextParticipantsPage = (filters: ParticipantListFilters) => {
  const loadNextPage = useParticipantStore((state: ParticipantStore) => state.loadNextPage)
  return () => loadNextPage(filters)
}
export const useSetParticipantListFilters = () => useParticipantStore((state: ParticipantStore) => state.getParticipantList)

export const useAddParticipantData = () => useAddParticipant()
export const useAddParticipantLoading = () => useAddParticipant().loading
export const useAddParticipantError = () => useAddParticipant().error
export const useAddParticipantAction = () => useAddParticipant().addParticipant

export const useBulkParticipantActionLoading = () => useBulkParticipantAction().loading
export const useBulkParticipantActionError = () => useBulkParticipantAction().error
export const useBulkParticipantActionData = () => null
export const useBulkParticipantActionAction = () => useBulkParticipantAction().bulkParticipantAction
