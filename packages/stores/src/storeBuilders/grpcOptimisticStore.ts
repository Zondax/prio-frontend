import * as asyncLib from 'async'
import { debounce } from 'es-toolkit'
import { temporal } from 'zundo'
import { create } from 'zustand'

// Queue configuration constants
const UPDATE_QUEUE_CONCURRENCY = 3 // Maximum concurrent backend operations

type QueueTask<T> = () => Promise<T>

// Operation types as constants
const OPERATION_TYPE = {
  WRITE: 'write',
  UPDATE: 'update',
} as const

// Create a type alias for operation types to improve readability
type OperationType = (typeof OPERATION_TYPE)[keyof typeof OPERATION_TYPE]

// Default configuration values
const DEFAULT_WRITE_DEBOUNCE_TIME = 300 // Default debounce time in milliseconds for write operations

// Generic types for gRPC functions
export type GrpcClientFn<TClientParams, TClient> = (params: TClientParams) => TClient
export type GrpcReadFn<TClient, TClientParams, TData> = (client: TClient, params: TClientParams) => Promise<TData>
export type GrpcWriteFn<TClient, TClientParams, TData, R> = (client: TClient, params: TClientParams, data: TData) => Promise<R>

// More descriptive type names for handlers
export type MergeUpdateFn<TData> = (currentState: TData, partialUpdate: Partial<TData>) => TData
export type ProcessResponseFn<TData, R> = (
  currentState: TData,
  backendResponse: R | Awaited<R> | undefined,
  partialData: Partial<TData>
) => TData

// Define a new interface for operation options
interface OperationOptions {
  /**
   * Mode of operation:
   * - 'optimistic' (default): Update UI immediately and send request to backend
   * - 'wait_for_response': Wait for backend response before updating UI
   */
  mode?: 'optimistic' | 'wait_for_response'
}

// Base state structure for all gRPC stores
interface BaseState<TClientParams, TClient, TData> {
  // Call params
  params: TClientParams
  // Client
  client?: TClient
  // Current data in the store (could be confirmed or optimistic)
  storeData?: TData
  // Loading states for different operations
  isLoading: boolean
  // Loading state for write operations
  isWriting: boolean
  // Error states for different operations
  error: string | null
  // Error state for write operations
  writeError: string | null
  // Last update timestamp
  lastUpdated: number | null
}

// Actions available to components
interface PublicStore<TClientParams, TData, TWriteResult> {
  // Loading states
  isLoading: boolean
  // Loading state for write operations
  isWriting: boolean
  // Error states
  error: string | null
  // Error state for write operations
  writeError: string | null
  // Last update timestamp
  lastUpdated: number | null
  // Set the call params
  setParams: (params: TClientParams) => void
  // Get the current data (optimistic or confirmed)
  getData: () => TData | undefined
  // Refresh data from the server
  refresh: () => void
  // Write data with optimistic update
  write: (data: TData, options?: OperationOptions) => Promise<TWriteResult | undefined>
  // Update data with merge function - only available if mergeFn is provided
  update: MergeUpdateFn<TData> extends undefined
    ? undefined
    : (partialData: Partial<TData>, options?: OperationOptions) => Promise<TWriteResult | undefined>
  // Set initial data without making a server request
  setInitialData: (data: TData) => void
}

// Initial state factory
const createDefaultState = <TClientParams, TClient, TData>(): BaseState<TClientParams, TClient, TData> => ({
  params: {} as TClientParams,
  client: undefined,
  storeData: undefined,
  isLoading: false,
  isWriting: false,
  error: null,
  writeError: null,
  lastUpdated: null,
})

interface GrpcStoreOptions {
  debounceTime?: number
}

interface GrpcStoreFunctions<TClientParams, TClient, TData, R> {
  createClient: GrpcClientFn<TClientParams, TClient>
  read: GrpcReadFn<TClient, TClientParams, TData>
  write?: GrpcWriteFn<TClient, TClientParams, TData, R>
  handlers?: {
    mergeUpdate?: MergeUpdateFn<TData>
    processResponse?: ProcessResponseFn<TData, R>
  }
}

/**
 * Creates a Zustand store for managing gRPC data with read and write operations
 * @param functions - Object containing gRPC functions for read and write operations
 * @param options - Configuration options for the store
 * @returns A hook for accessing the store
 */
export function createGrpcOptimisticStore<TClientParams, TClient, TData, TWriteResult>(
  { createClient, read: backendRead, write: backendWrite, handlers }: GrpcStoreFunctions<TClientParams, TClient, TData, TWriteResult>,
  options?: GrpcStoreOptions
) {
  const writeDebounceTime = options?.debounceTime !== undefined ? options.debounceTime : DEFAULT_WRITE_DEBOUNCE_TIME
  const { mergeUpdate, processResponse } = handlers || {}

  /**
   * Queue for handling backend operations with controlled concurrency.
   * This ensures we don't overwhelm the backend with too many concurrent requests.
   */
  const updateQueue = asyncLib.queue<QueueTask<void>, void>(async (task) => {
    return task()
  }, UPDATE_QUEUE_CONCURRENCY)

  updateQueue.error((err) => {
    console.error('[GrpcOptimisticStore] Queue error:', err)
  })

  // Helper function to create and enqueue tasks with proper error handling
  const enqueueTask = <T>(taskFn: () => Promise<T>): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      const task: QueueTask<void> = async () => {
        try {
          const result = await taskFn()
          resolve(result)
          return
        } catch (error) {
          reject(error)
          throw error // Re-throw for queue error handler
        }
      }

      updateQueue.push(task)
    })

  // Internal store with full access to state
  type StoreType = BaseState<TClientParams, TClient, TData> & PublicStore<TClientParams, TData, TWriteResult>

  const useStore = create<StoreType>()(
    temporal<StoreType>((set, get) => {
      // Private functions
      const isClientReady = () => {
        const { client, params } = get()
        return client !== undefined && params !== undefined
      }

      const getStoreData = () => {
        const { storeData } = get()
        return storeData
      }

      const loadData = async () => {
        const { params, client } = get()

        if (!params) {
          set({ error: 'Params are required' })
          return undefined
        }

        if (!client) {
          set({ error: 'Client is required' })
          return undefined
        }

        set({ isLoading: true, error: null })

        try {
          const data = await backendRead(client, params)

          set({
            storeData: data,
            lastUpdated: Date.now(),
            error: null,
          })

          return data
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Failed to fetch data'
          set({ error, storeData: undefined })
          return undefined
        } finally {
          set({ isLoading: false })
        }
      }

      // Success handlers for different operation types
      const onWriteSuccess = (data: TData) => {
        // For complete replacement operations, update state with backend data
        set({
          storeData: data,
          isWriting: false,
          writeError: null,
          lastUpdated: Date.now(),
        })
      }

      const onUpdateSuccess = (_data: TData) => {
        // For partial updates, don't modify state data to preserve pending optimistic updates
        set({
          isWriting: false,
          writeError: null,
          lastUpdated: Date.now(),
        })
      }

      /**
       * Core function that handles backend operations with proper error handling.
       * Implements the Strategy pattern to allow different behaviors for success cases.
       *
       * @param data The data to send to the backend
       * @param operationType The type of operation (write or update)
       * @param onSuccess Callback that defines what to do after successful backend operation
       */
      const performBackendOperation = async (data: TData, operationType: OperationType, onSuccess: (data: TData) => void) => {
        if (!backendWrite) return
        const { params, client } = get()

        if (!client) {
          throw new Error('Client is required')
        }
        if (!params) {
          throw new Error('Params are required')
        }

        try {
          // Execute the backend operation
          const result = await backendWrite(client, params, data)

          // Execute the strategy-specific success handling
          onSuccess(data)

          // Return the result for clients that need it
          return result
        } catch (error) {
          console.error(`[GrpcOptimisticStore] ${operationType} Error`, error)

          // Revert optimistic update on error
          // TODO: Potential concurrency issue with undo() when multiple operations are in flight.
          // This implementation always reverts the last optimistic operation in the queue,
          // but it might not be the operation that actually failed. In high concurrency scenarios,
          // this could lead to reverting successful operations while leaving failed operations in place.
          // A more robust solution would track each operation with a unique ID and only revert
          // the specific operation that failed.

          // Access the temporal middleware directly with a type assertion
          useStore.temporal.getState().undo()

          set({
            isWriting: false,
            writeError: error instanceof Error ? error.message : `Failed to ${operationType} data`,
          })

          throw error
        }
      }

      /**
       * Handles full replacement operations.
       * After backend confirmation, the state is completely replaced with the confirmed data.
       */
      const performBackendWrite = async (data: TData) => {
        return performBackendOperation(data, OPERATION_TYPE.WRITE, onWriteSuccess)
      }

      /**
       * Handles partial update operations using a queue for controlled concurrency.
       * After backend confirmation, preserves optimistic updates by not modifying the state data.
       * This allows multiple rapid updates to accumulate correctly in the UI.
       */
      const performBackendUpdate = async (data: TData): Promise<TWriteResult | undefined> => {
        return enqueueTask(() => performBackendOperation(data, OPERATION_TYPE.UPDATE, onUpdateSuccess))
      }

      // Apply debounce only to write operations if configured
      const processWrite = writeDebounceTime > 0 ? debounce(performBackendWrite, writeDebounceTime) : performBackendWrite

      // Update operations shouldn't have debounce by default
      const processUpdate = performBackendUpdate

      // Build and return the store
      return {
        ...createDefaultState<TClientParams, TClient, TData>(),

        setParams: (params: TClientParams) => {
          set({ params, client: createClient(params) })
          if (isClientReady()) {
            loadData()
          }
        },

        refresh: () => {
          if (isClientReady()) {
            loadData()
          }
        },

        getData: () => {
          // For the current data, prioritize what's in the current state
          // If no state is active, use the store data
          const currentData = getStoreData()

          // Check if we have data in the temporal future states (which would be optimistic updates)
          const { futureStates } = useStore.temporal.getState()
          const hasFutureStates = futureStates && futureStates.length > 0

          if (hasFutureStates) {
            // Return the most recent optimistic update
            return futureStates[0] as TData
          }
          return currentData
        },

        setInitialData: (data: TData) => {
          set({
            storeData: data,
            lastUpdated: Date.now(),
          })
        },

        /**
         * Complete replacement operation with optimistic UI updates.
         * Use this when the entire state needs to be replaced with new data.
         * @param newData The new data to replace the current state with
         * @param options Operation options
         */
        write: backendWrite
          ? async (newData: TData, options?: OperationOptions) => {
              set({ isWriting: true, writeError: null })

              const isWaitMode = options?.mode === 'wait_for_response'

              if (isWaitMode) {
                try {
                  const response = await performBackendWrite(newData)

                  set({
                    storeData: newData,
                    isWriting: false,
                    writeError: null,
                    lastUpdated: Date.now(),
                  })

                  return response
                } catch (error) {
                  console.error('[GrpcOptimisticStore] Write error', error)
                  return undefined
                }
              }

              // Optimistic update (default behavior)
              set({ storeData: newData })

              try {
                return await processWrite(newData)
              } catch (error) {
                console.error('[GrpcOptimisticStore] Write error', error)
                return undefined
              }
            }
          : undefined,

        /**
         * Partial update operation with optimistic UI updates and custom merge logic.
         * Use this for incremental updates where you need to preserve other pending changes.
         *
         * @param partialData Partial data provided to update the store
         * @param options Operation options - mode: 'optimistic' (default) or 'wait_for_response'
         */
        update:
          backendWrite && mergeUpdate
            ? async (partialData: Partial<TData>, options?: OperationOptions) => {
                set({ isWriting: true, writeError: null })

                // Get current data using getData to get latest optimistic state
                const currentData = get().getData()
                if (!currentData) {
                  throw new Error('Cannot update: No current data exists')
                }

                const isWaitMode = options?.mode === 'wait_for_response'
                // TODO: I don't like a lot this developer experience. We should improve it to better understand the data flow.
                // But the flow is the following:
                // Data flow for non-optimistic updates:
                // 1. Get the current data from the store
                // 2. Merge the partial data with the current data to get the complete data to send to the backend
                // 3. Send the data to the backend and wait for response
                // 4. Process the response and update the state
                // 5. Return the response to the caller
                const dataToSend = mergeUpdate(currentData, partialData)

                if (isWaitMode) {
                  try {
                    const response = await performBackendOperation(dataToSend, OPERATION_TYPE.UPDATE, onUpdateSuccess)
                    const finalData = processResponse ? processResponse(currentData, response, partialData) : dataToSend

                    set({
                      storeData: finalData,
                      isWriting: false,
                      writeError: null,
                      lastUpdated: Date.now(),
                    })

                    return response
                  } catch (error) {
                    console.error('[GrpcOptimisticStore] Update error', error)
                    return undefined
                  }
                }

                // Optimistic update (default behavior)
                set({ storeData: dataToSend })

                try {
                  return await processUpdate(dataToSend)
                } catch (error) {
                  console.error('[GrpcOptimisticStore] Update error', error)
                  return undefined
                }
              }
            : undefined,

        isLoading: false,
        isWriting: false,
        error: null,
        writeError: null,
        lastUpdated: null,
      } as StoreType // We need to cast to the correct type to avoid type errors because of the temporal middleware
    })
  )

  /**
   * Returns a hook that exposes only the public interface of the store.
   * This prevents components from accessing or modifying internal state directly.
   */
  return () => {
    const store = useStore()
    return {
      isLoading: store.isLoading,
      isWriting: store.isWriting,
      error: store.error,
      writeError: store.writeError,
      lastUpdated: store.lastUpdated,
      getData: store.getData,
      refresh: store.refresh,
      setParams: store.setParams,
      write: store.write,
      update: store.update,
      setInitialData: store.setInitialData,

      // Just for debugging, we shouldn't use these in production
      internal: store,
      forceRefresh: () => {
        store.refresh()
      },
      getConfirmedData: () => store.storeData,
      clientReady: () => {
        const { client, params } = store
        return client !== undefined && params !== undefined
      },
      //
    }
  }
}
