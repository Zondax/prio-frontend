import type { ClientReadableStream } from '@prio-grpc'
import { create } from 'zustand'

// Base state structure for streaming gRPC stores
interface BaseState<CP, T> {
  // Connection parameters
  params?: CP
  // Current stream
  stream?: ClientReadableStream<T>
  // Current data
  data?: T
  // Loading state
  isLoading: boolean
  // Stream state
  isStreaming: boolean
  // Error state
  error: string | null
  // Last update timestamp
  lastUpdated: number | null
}

// Actions available to components
interface PublicStore<CP, T> extends BaseState<CP, T> {
  // Set connection parameters and restart stream
  setParams: (params: CP) => void
  // Start streaming
  startStream: () => void
  // Stop streaming
  stopStream: () => void
  // Get the current data
  getData: () => T | undefined
}

// Initial state factory
const createDefaultState = <CP, T>(): BaseState<CP, T> => ({
  params: undefined,
  stream: undefined,
  data: undefined,
  isLoading: false,
  isStreaming: false,
  error: null,
  lastUpdated: null,
})

interface GrpcStreamFunctions<CP, T> {
  createStream: (params: CP) => ClientReadableStream<T>
}

export function createGrpcReadStreamStore<CP, T>({ createStream }: GrpcStreamFunctions<CP, T>) {
  // Create the store
  return create<BaseState<CP, T> & PublicStore<CP, T>>((set, get) => ({
    ...createDefaultState<CP, T>(),

    setParams: (params: CP) => {
      // Validate params
      if (!params || (typeof params === 'object' && (Object.keys(params).length === 0 || Object.values(params).every((v) => !v)))) {
        return
      }

      const { stream, isStreaming, params: currentParams } = get()

      // Don't restart stream if already streaming with same params
      if (isStreaming && JSON.stringify(params) === JSON.stringify(currentParams)) {
        return
      }

      // Cleanup existing stream
      if (stream) {
        stream.cancel()
      }

      set({ params, stream: undefined, isStreaming: false, isLoading: true })

      try {
        // Create new stream
        const newStream = createStream(params)

        // Setup stream handlers
        newStream.on('data', (data: T) => {
          set({
            data,
            error: null,
            isLoading: false,
            lastUpdated: Date.now(),
          })
        })

        newStream.on('error', (error: Error) => {
          set({
            error: error.message,
            isLoading: false,
            isStreaming: false,
          })
        })

        newStream.on('end', () => {
          set({
            isStreaming: false,
            isLoading: false,
          })
        })

        // Update state with new stream
        set({
          stream: newStream,
          isStreaming: true,
          isLoading: true,
          error: null,
        })
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to create stream',
          isLoading: false,
          isStreaming: false,
        })
      }
    },

    getData: () => {
      const { data } = get()
      return data
    },

    startStream: () => {
      const { params, isStreaming } = get()
      if (!params || isStreaming) return
      get().setParams(params)
    },

    stopStream: () => {
      const { stream } = get()
      if (stream) {
        stream.cancel()
        set({
          stream: undefined,
          isStreaming: false,
          isLoading: false,
        })
      }
    },
  }))
}
