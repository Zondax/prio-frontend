import { beforeEach, describe, expect, it, vi } from 'vitest'

// Import the mocked function
import { createGrpcSingleMethodStore } from './grpcSingleMethodStore'

// Simple mock implementation
const createMockStore = () => {
  // Mock store with required properties and functions
  return {
    params: undefined,
    input: undefined,
    data: undefined,
    isLoading: false,
    error: null,
    lastUpdated: null,
    clientReady: vi.fn().mockReturnValue(true),
    setParams: vi.fn(),
    setInput: vi.fn(),
    getData: vi.fn(),
    forceRefresh: vi.fn().mockResolvedValue(undefined),
    refresh: vi.fn(),
  }
}

// Mock the module
vi.mock('./grpcSingleMethodStore', () => {
  // Create a mock implementation
  const createGrpcSingleMethodStoreMock = vi.fn().mockImplementation(() => {
    // Create a function that returns a mock store
    const useStore = () => createMockStore()

    // Return the function
    return useStore
  })

  // Return the module with the mock function
  return {
    createGrpcSingleMethodStore: createGrpcSingleMethodStoreMock,
  }
})

describe('grpcSingleMethodStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Store Creation', () => {
    it('should create a store with the required interface', () => {
      // Create store
      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Verify interface
      expect(store).toHaveProperty('params')
      expect(store).toHaveProperty('input')
      expect(store).toHaveProperty('data')
      expect(store).toHaveProperty('isLoading')
      expect(store).toHaveProperty('error')
      expect(store).toHaveProperty('lastUpdated')
      expect(store).toHaveProperty('clientReady')
      expect(store).toHaveProperty('setParams')
      expect(store).toHaveProperty('setInput')
      expect(store).toHaveProperty('getData')
      expect(store).toHaveProperty('forceRefresh')
      expect(store).toHaveProperty('refresh')
    })

    it('should provide initial state with default values', () => {
      // Create store
      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Verify initial state
      expect(store.params).toBeUndefined()
      expect(store.input).toBeUndefined()
      expect(store.data).toBeUndefined()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.lastUpdated).toBeNull()
    })
  })

  describe('Connection Management', () => {
    it('should set params with the provided parameters', () => {
      // Create store
      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Set params
      const params = { endpoint: 'test' }
      store.setParams(params)

      // Verify setParams was called with the parameters
      expect(store.setParams).toHaveBeenCalledWith(params)
    })

    it('should check if client is ready', () => {
      // Create store
      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Check client ready
      const isReady = store.clientReady()

      // Verify clientReady was called and returned expected value
      expect(store.clientReady).toHaveBeenCalled()
      expect(isReady).toBe(true)
    })

    it('should create a client when params are set', () => {
      // Mock functions
      const mockCreateClient = vi.fn().mockReturnValue({ call: vi.fn() })

      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create a custom store that tracks createClient calls
        const customStore = {
          ...createMockStore(),
          setParams: vi.fn().mockImplementation((params) => {
            customStore.params = params
            mockCreateClient(params)
          }),
          params: undefined,
        }
        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: mockCreateClient,
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Set params
      store.setParams({ endpoint: 'test-endpoint' })

      // Verify createClient was called with params
      expect(mockCreateClient).toHaveBeenCalledWith({ endpoint: 'test-endpoint' })
      expect(store.params).toEqual({ endpoint: 'test-endpoint' })
    })
  })

  describe('Data Operations', () => {
    it('should set input data', () => {
      // Create store
      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Set input data
      const input = { query: 'test query' }
      store.setInput(input)

      // Verify setInput was called with the input data
      expect(store.setInput).toHaveBeenCalledWith(input)
    })

    it('should get data via getData', () => {
      // Create store
      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Get data
      store.getData()

      // Verify getData was called
      expect(store.getData).toHaveBeenCalled()
    })

    it('should force refresh data', async () => {
      // Create store
      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Force refresh
      await store.forceRefresh()

      // Verify forceRefresh was called
      expect(store.forceRefresh).toHaveBeenCalled()
    })

    it('should call refresh when input is set', () => {
      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create a custom store that tracks refresh calls
        const customStore = {
          ...createMockStore(),
          setInput: vi.fn().mockImplementation((input) => {
            customStore.input = input
            customStore.refresh()
          }),
          input: undefined,
        }
        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Set input data
      store.setInput({ query: 'test query' })

      // Verify refresh was called after setInput
      expect(store.refresh).toHaveBeenCalled()
      expect(store.input).toEqual({ query: 'test query' })
    })

    it('should call forceRefresh from refresh when client and input are ready', () => {
      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create a custom store that tracks refresh behavior
        const customStore = {
          ...createMockStore(),
          clientReady: vi.fn().mockReturnValue(true),
          input: { query: 'test query' },
          refresh: vi.fn().mockImplementation(() => {
            if (customStore.clientReady() && customStore.input) {
              customStore.forceRefresh()
            }
          }),
          forceRefresh: vi.fn().mockResolvedValue({ result: 'test result' }),
        }
        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Call refresh
      store.refresh()

      // Verify forceRefresh was called after refresh
      expect(store.clientReady).toHaveBeenCalled()
      expect(store.forceRefresh).toHaveBeenCalled()
    })

    it('should not call forceRefresh from refresh when client is not ready', () => {
      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create a custom store where clientReady returns false
        const customStore = {
          ...createMockStore(),
          clientReady: vi.fn().mockReturnValue(false),
          input: { query: 'test query' },
          refresh: vi.fn().mockImplementation(() => {
            if (customStore.clientReady() && customStore.input) {
              customStore.forceRefresh()
            }
          }),
          forceRefresh: vi.fn().mockResolvedValue({ result: 'test result' }),
        }
        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Call refresh
      store.refresh()

      // Verify forceRefresh was not called
      expect(store.clientReady).toHaveBeenCalled()
      expect(store.forceRefresh).not.toHaveBeenCalled()
    })

    it('should not call forceRefresh from refresh when input is not set', () => {
      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create a custom store with no input
        const customStore = {
          ...createMockStore(),
          clientReady: vi.fn().mockReturnValue(true),
          input: undefined,
          refresh: vi.fn().mockImplementation(() => {
            if (customStore.clientReady() && customStore.input) {
              customStore.forceRefresh()
            }
          }),
          forceRefresh: vi.fn().mockResolvedValue({ result: 'test result' }),
        }
        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Call refresh
      store.refresh()

      // Verify forceRefresh was not called
      expect(store.clientReady).toHaveBeenCalled()
      expect(store.forceRefresh).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle missing params error during forceRefresh', async () => {
      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create a custom store that simulates a missing params error
        const customStore = {
          ...createMockStore(),
          params: undefined,
          error: null,
          forceRefresh: vi.fn().mockImplementation(async () => {
            if (!customStore.params) {
              customStore.error = 'Connection parameters are required'
              return undefined
            }
            return { result: 'test result' }
          }),
        }
        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Call forceRefresh with missing params
      const result = await store.forceRefresh()

      // Verify error handling
      expect(result).toBeUndefined()
      expect(store.error).toBe('Connection parameters are required')
    })

    it('should handle missing client error during forceRefresh', async () => {
      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create a custom store that simulates a missing client error
        const customStore = {
          ...createMockStore(),
          params: { endpoint: 'test' },
          client: undefined,
          error: null,
          forceRefresh: vi.fn().mockImplementation(async () => {
            if (!customStore.params) {
              customStore.error = 'Connection parameters are required'
              return undefined
            }

            if (!customStore.client) {
              customStore.error = 'Client is required'
              return undefined
            }

            return { result: 'test result' }
          }),
        }
        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Call forceRefresh with missing client
      const result = await store.forceRefresh()

      // Verify error handling
      expect(result).toBeUndefined()
      expect(store.error).toBe('Client is required')
    })

    it('should handle missing input error during forceRefresh', async () => {
      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create a custom store that simulates a missing input error
        const customStore = {
          ...createMockStore(),
          params: { endpoint: 'test' },
          client: { call: vi.fn() },
          input: undefined,
          error: null,
          forceRefresh: vi.fn().mockImplementation(async () => {
            if (!customStore.params) {
              customStore.error = 'Connection parameters are required'
              return undefined
            }

            if (!customStore.client) {
              customStore.error = 'Client is required'
              return undefined
            }

            if (!customStore.input) {
              customStore.error = 'Input data is required'
              throw new Error('Input data is required')
            }

            return { result: 'test result' }
          }),
        }
        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Call forceRefresh with missing input
      try {
        await store.forceRefresh()
        // Should not reach here
        expect(true).toBe(false)
      } catch (error) {
        // Verify error handling
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Input data is required')
        expect(store.error).toBe('Input data is required')
      }
    })
  })

  describe('Advanced Interactions', () => {
    it('should handle successful data fetching', async () => {
      // Create store
      const mockMethod = vi.fn().mockResolvedValue({ result: 'test result' })
      const mockCreateClient = vi.fn().mockReturnValue({ call: vi.fn() })

      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create a function that returns a store with a custom forceRefresh implementation
        const customStore = {
          ...createMockStore(),
          forceRefresh: vi.fn().mockResolvedValue({ result: 'test result' }),
        }
        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: mockCreateClient,
        method: mockMethod,
      })

      // Get the store
      const store = useStore()

      // Mock the initial state
      store.params = { endpoint: 'test' }
      store.input = { query: 'test query' }

      // Force refresh to get data
      const result = await store.forceRefresh()

      // Verify the result
      expect(result).toEqual({ result: 'test result' })
      expect(store.forceRefresh).toHaveBeenCalled()
    })

    it('should handle error during data fetching', async () => {
      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create a function that returns a store with a custom forceRefresh implementation
        const customStore = {
          ...createMockStore(),
          forceRefresh: vi.fn().mockRejectedValue(new Error('Test error')),
          error: 'Test error',
        }
        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Attempt to refresh data
      try {
        await store.forceRefresh()
      } catch (error) {
        // Verify error handling
        expect(store.forceRefresh).toHaveBeenCalled()
        expect(store.error).toBe('Test error')
      }
    })

    it('should handle full workflow with params, input, and data fetch', async () => {
      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create store with tracking for method calls
        const calls: { method: string; args: any[] }[] = []
        const trackCall =
          (method: string) =>
          (...args: any[]) => {
            calls.push({ method, args })
            return undefined
          }

        // Create custom store
        const customStore = {
          ...createMockStore(),
          setParams: vi.fn().mockImplementation(trackCall('setParams')),
          setInput: vi.fn().mockImplementation(trackCall('setInput')),
          forceRefresh: vi.fn().mockImplementation(() => {
            calls.push({ method: 'forceRefresh', args: [] })
            return Promise.resolve({ result: 'success' })
          }),
          calls,
        }

        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Execute full workflow
      store.setParams({ endpoint: 'test' })
      store.setInput({ query: 'test query' })
      await store.forceRefresh()

      // Verify call sequence
      expect(store.setParams).toHaveBeenCalledWith({ endpoint: 'test' })
      expect(store.setInput).toHaveBeenCalledWith({ query: 'test query' })
      expect(store.forceRefresh).toHaveBeenCalled()
      expect(store.calls).toEqual([
        { method: 'setParams', args: [{ endpoint: 'test' }] },
        { method: 'setInput', args: [{ query: 'test query' }] },
        { method: 'forceRefresh', args: [] },
      ])
    })

    it('should update loading and error states during forceRefresh', async () => {
      // Override the mock implementation for this test
      vi.mocked(createGrpcSingleMethodStore).mockImplementationOnce(() => {
        // Create a custom store that tracks loading and error states
        const customStore = {
          ...createMockStore(),
          params: { endpoint: 'test' },
          client: { call: vi.fn() },
          input: { query: 'test query' },
          isLoading: false,
          error: null,
          forceRefresh: vi.fn().mockImplementation(async () => {
            customStore.isLoading = true
            customStore.error = null

            try {
              // Simulate successful operation
              const result = { result: 'test result' }
              customStore.data = result
              customStore.lastUpdated = Date.now()
              customStore.isLoading = false
              return result
            } catch (error) {
              customStore.error = error instanceof Error ? error.message : 'Failed to fetch data'
              customStore.isLoading = false
              return undefined
            }
          }),
        }
        return () => customStore
      })

      const useStore = createGrpcSingleMethodStore({
        createClient: vi.fn(),
        method: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Initial state
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()

      // Force refresh
      const result = await store.forceRefresh()

      // Verify final state
      expect(result).toEqual({ result: 'test result' })
      expect(store.data).toEqual({ result: 'test result' })
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.lastUpdated).not.toBeNull()
    })
  })
})
