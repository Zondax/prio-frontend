import { create } from 'zustand'

// Base state structure for read-only gRPC stores
interface BaseState<TClientParams, TClient, TInput, TData> {
  // Connection parameters
  params?: TClientParams
  // Client
  client?: TClient
  // Input data
  input?: TInput
  // Current data
  response?: TData
  // Loading state
  isLoading: boolean
  // Error state
  error: string | null
  // Last update timestamp
  lastUpdated: number | null
}

// Actions available to components
interface PublicStore<TClientParams, TClient, TInput, TData> extends BaseState<TClientParams, TClient, TInput, TData> {
  // Set connection parameters
  setParams: (params: TClientParams) => void
  // Set input data
  setInput: (input: TInput) => void
  // Whether the params are ready
  clientReady: () => boolean
  // Refresh the data
  refresh: () => void
  // Force refresh the data
  forceRefresh: () => Promise<TData | undefined>
  // Get the current data
  getData: () => TData | undefined
}

// Initial state factory
const createDefaultState = <TClientParams, TClient, TInput, TData>(): BaseState<TClientParams, TClient, TInput, TData> => ({
  params: undefined,
  client: undefined,
  input: undefined,
  response: undefined,
  isLoading: false,
  error: null,
  lastUpdated: null,
})

interface GrpcStoreFunctions<TClientParams, TClient, TInput, TData> {
  createClient: (params: TClientParams) => TClient
  method: (client: TClient, params: TClientParams, input: TInput) => Promise<TData>
}

export function createGrpcSingleMethodStore<TClientParams, TClient, TInput, TData>({
  createClient,
  method,
}: GrpcStoreFunctions<TClientParams, TClient, TInput, TData>) {
  // Create the store
  const useStore = create<BaseState<TClientParams, TClient, TInput, TData> & PublicStore<TClientParams, TClient, TInput, TData>>(
    (set, get) => ({
      ...createDefaultState<TClientParams, TClient, TInput, TData>(),

      setParams: (params: TClientParams) => {
        set({ params, client: createClient(params) })
        get().refresh()
      },

      clientReady: () => {
        const { client, params } = get()
        return client !== undefined && params !== undefined
      },

      setInput: (input: TInput) => {
        set({ input })
        get().refresh()
      },

      getData: () => {
        const { response: data } = get()
        return data
      },

      refresh: () => {
        const state = get()
        const ready = state.clientReady()
        const hasInput = !!state.input

        if (!ready) {
          set({ error: 'Client not ready. Check connection parameters.' })
          return
        }

        if (!hasInput) {
          set({ error: 'Input data is missing' })
          return
        }

        get().forceRefresh()
      },

      forceRefresh: async () => {
        const { params, input, client } = get()
        if (!params) {
          set({ error: 'Connection parameters are required' })
          return
        }

        if (!client) {
          set({ error: 'Client is required' })
          return
        }

        if (!input) {
          set({ error: 'Input data is required' })
          throw new Error('Input data is required')
        }

        set({ isLoading: true, error: null })

        try {
          const data = await method(client, params, input)
          set({
            response: data,
            lastUpdated: Date.now(),
            error: null,
            isLoading: false,
          })
          return data
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch data',
            isLoading: false,
          })
          return undefined
        }
      },
    })
  )

  // Public store that only exposes the public interface
  return () => {
    const store = useStore()
    return {
      params: store.params,
      input: store.input,
      data: store.response,
      isLoading: store.isLoading,
      isInitLoading: !store.params || !store.client,
      error: store.error,
      lastUpdated: store.lastUpdated,
      clientReady: store.clientReady,
      setParams: store.setParams,
      setInput: store.setInput,
      getData: store.getData,
      forceRefresh: store.forceRefresh,
    }
  }
}
