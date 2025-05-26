import { create } from 'zustand'

export interface TPageableResponse<T, U> {
  data: T[]
  metadata: U
  cursor: string
}

interface GrpcStoreFunctions<TClientParams, TClient, TInput, TData, TMetadata> {
  createClient: (params: TClientParams) => TClient
  fetch: (client: TClient, params: TClientParams, input: TInput, cursor?: string) => Promise<TPageableResponse<TData, TMetadata>>
}

// Base state structure for read-only gRPC stores
export interface BaseState<TClientParams, TClient, TInput, TData, TMetadata> {
  // Connection parameters
  params?: TClientParams
  // Client
  client?: TClient
  // Input data
  input?: TInput
  // Extracted data
  data: TData[]
  // Cursor for pagination
  cursor?: string
  // Initial loading state
  isInitLoading: boolean
  // Loading state
  isLoading: boolean
  // Has reached end of data
  hasReachedEnd: boolean
  // Error state
  error: string | null
  // Last update timestamp
  lastUpdated: number | null
  // Metadata
  metadata: TMetadata
  // Store metrics
  metrics: {
    totalCallCount: number
    fetchCount: number
    resetCount: number
    lastCallType: 'fetch' | 'reset' | 'none'
    lastCallTimestamp: number | null
    averageCallDuration: number | null
    lastCallDuration: number | null
  }
}

// Actions available to components
interface PublicStore<TClientParams, TInput, TData, TMetadata> {
  // Connection parameters
  params?: TClientParams
  // Input data
  input?: TInput
  // Extracted data
  data: TData[]
  // Metadata
  metadata: TMetadata
  // Initial loading state
  isInitLoading: boolean
  // Loading state
  isLoading: boolean
  // Error state
  error: string | null
  // Last update timestamp
  lastUpdated: number | null
  // Store metrics
  metrics: {
    totalCallCount: number
    fetchCount: number
    resetCount: number
    lastCallType: 'fetch' | 'reset' | 'none'
    lastCallTimestamp: number | null
    averageCallDuration: number | null
    lastCallDuration: number | null
  }
  // Set connection parameters
  setParams: (params: TClientParams) => void
  // Set input data
  setInput: (input: TInput) => void
  // Load next page or fetch new data
  loadNextPage: (resetData?: boolean) => void
  // Has reached end of data
  hasReachedEnd: boolean
}

// Internal methods that should not be exposed publicly
interface PrivateStore<TClient, _TData, _TMetadata> {
  // Client instance
  client?: TClient
  // Whether the client is ready
  clientReady: () => boolean
  // Reset store data and start fresh
  reset: () => void
  // Performance metrics tracking
  trackMetrics: (
    callType: 'fetch' | 'reset',
    startTime: number
  ) => {
    callDuration: number
    newAvgDuration: number
  }
}

// Constants for special cursor values
const NO_MORE_DATA_CURSOR = ''

export function createPageableStore<TClientParams, TClient, TInput, TData, TMetadata>({
  createClient,
  fetch,
}: GrpcStoreFunctions<TClientParams, TClient, TInput, TData, TMetadata>) {
  // Create the store
  const useStore = create<
    BaseState<TClientParams, TClient, TInput, TData, TMetadata> &
      PublicStore<TClientParams, TInput, TData, TMetadata> &
      PrivateStore<TClient, TData, TMetadata>
  >((set, get) => ({
    ...createDefaultState<TClientParams, TClient, TInput, TData, TMetadata>(),

    clientReady: () => {
      const { params, client } = get()
      return !!params && !!client
    },

    setParams: (params: TClientParams) => {
      set({ params, client: createClient(params) })
      get().loadNextPage(true)
    },

    setInput: (input: TInput) => {
      // Reset hasReachedEnd when input changes
      set({ input, hasReachedEnd: false })
      get().loadNextPage(true)
    },

    trackMetrics: (callType: 'fetch' | 'reset', startTime: number) => {
      const { metrics } = get()
      const endTime = performance.now()
      const callDuration = endTime - startTime

      // Update average call duration
      const newAvgDuration = metrics.averageCallDuration
        ? (metrics.averageCallDuration * metrics.totalCallCount + callDuration) / (metrics.totalCallCount + 1)
        : callDuration

      return { callDuration, newAvgDuration }
    },

    loadNextPage: async (resetData = false) => {
      const startTime = performance.now()
      const { params, input, client, metrics, hasReachedEnd } = get()

      // Skip if required data is missing
      if (!get().clientReady() || !input) {
        return
      }

      // If we've already determined we reached the end and this isn't a reset, skip
      if (hasReachedEnd && !resetData) {
        console.log('⏹️ End of data already reached, skipping loadNextPage call')
        return
      }

      set({ isLoading: true })

      try {
        // Get the current cursor, or undefined for the first request
        const currentCursor = resetData ? undefined : get().cursor

        // Skip if cursor is empty (no more data available)
        if (currentCursor === NO_MORE_DATA_CURSOR && !resetData) {
          set({ isLoading: false, hasReachedEnd: true })
          return
        }

        // Track call type for metrics
        const callType: 'fetch' | 'reset' = resetData ? 'reset' : 'fetch'

        // Make the API call
        const clientParams = params as TClientParams

        // Ensure client is available
        if (!client) {
          console.error('GRPC Pageable Store: Client is not configured. Cannot fetch data.')
          set({
            isLoading: false,
            error: 'Client not configured for data fetching.',
          })
          return
        }

        // Use the fetch function from the store configuration
        fetch(client, clientParams, input, currentCursor)
          .then((response) => {
            let newData: TData[]

            if (resetData) {
              // First page or reset case
              newData = response.data
            } else {
              // Next page case - append new data to existing data
              newData = [...get().data, ...response.data]
            }

            // Now that we have the data, update the state all at once
            set({
              data: newData,
              cursor: response.cursor || NO_MORE_DATA_CURSOR,
              metadata: response.metadata,
              lastUpdated: Date.now(),
              error: null,
              isLoading: false,
              // Set hasReachedEnd flag if we got an empty cursor
              hasReachedEnd: !response.cursor,
              metrics: {
                ...metrics,
                totalCallCount: metrics.totalCallCount + 1,
                [resetData ? 'resetCount' : 'fetchCount']: resetData ? metrics.resetCount + 1 : metrics.fetchCount + 1,
                lastCallType: callType,
                lastCallTimestamp: Date.now(),
                averageCallDuration: metrics.averageCallDuration
                  ? (metrics.averageCallDuration * metrics.totalCallCount + (performance.now() - startTime)) / (metrics.totalCallCount + 1)
                  : performance.now() - startTime,
                lastCallDuration: performance.now() - startTime,
              },
            })
          })
          .catch((error) => {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch data',
              isLoading: false,
              metrics: {
                ...metrics,
                totalCallCount: metrics.totalCallCount + 1,
                [resetData ? 'resetCount' : 'fetchCount']: resetData ? metrics.resetCount + 1 : metrics.fetchCount + 1,
                lastCallType: callType,
                lastCallTimestamp: Date.now(),
              },
            })
          })
      } catch (error) {
        const callType: 'fetch' | 'reset' = resetData ? 'reset' : 'fetch'
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch data',
          isLoading: false,
          metrics: {
            ...metrics,
            totalCallCount: metrics.totalCallCount + 1,
            [resetData ? 'resetCount' : 'fetchCount']: resetData ? metrics.resetCount + 1 : metrics.fetchCount + 1,
            lastCallType: callType,
            lastCallTimestamp: Date.now(),
          },
        })
      }
    },

    reset: () => {
      const startTime = performance.now()
      const defaultState = createDefaultState<TClientParams, TClient, TInput, TData, TMetadata>()

      // Keep the client and parameters but reset everything else
      set({
        ...defaultState,
        client: get().client,
        params: get().params,
        hasReachedEnd: false, // Make sure to reset this flag
      })

      // Track metrics for reset operation
      const { metrics } = get()
      const { callDuration, newAvgDuration } = get().trackMetrics('reset', startTime)

      set({
        metrics: {
          ...metrics,
          lastCallDuration: callDuration,
          averageCallDuration: newAvgDuration,
        },
      })
    },
  }))

  // Public store that only exposes the public interface
  return () => {
    const store = useStore()
    return {
      setParams: store.setParams,
      setInput: store.setInput,
      data: store.data,
      metadata: store.metadata,
      isLoading: store.isLoading,
      isInitLoading: !store.params || !store.client,
      error: store.error,
      lastUpdated: store.lastUpdated,
      metrics: store.metrics,
      loadNextPage: store.loadNextPage,
      hasReachedEnd: store.hasReachedEnd,
    } as PublicStore<TClientParams, TInput, TData, TMetadata>
  }
}

// Initial state factory
const createDefaultState = <TClientParams, TClient, TInput, TData, TMetadata>(): BaseState<
  TClientParams,
  TClient,
  TInput,
  TData,
  TMetadata
> => ({
  params: undefined,
  client: undefined,
  input: undefined,
  data: [],
  cursor: undefined,
  isLoading: false,
  isInitLoading: false,
  hasReachedEnd: false,
  error: null,
  lastUpdated: null,
  metadata: {} as TMetadata,
  metrics: {
    totalCallCount: 0,
    fetchCount: 0,
    resetCount: 0,
    lastCallType: 'none',
    lastCallTimestamp: null,
    averageCallDuration: null,
    lastCallDuration: null,
  },
})
