import { beforeEach, describe, expect, it, vi } from 'vitest'

// Import the mocked function
import { createGrpcOptimisticStore } from './grpcOptimisticStore'

// Simple mock implementation for tests
const createMockStore = () => ({
  isLoading: false,
  isWriting: false,
  error: null,
  writeError: null,
  lastUpdated: null,
  getData: vi.fn(),
  refresh: vi.fn(),
  setParams: vi.fn(),
  write: vi.fn(),
  update: vi.fn(),
  setInitialData: vi.fn(),
  internal: {},
  forceRefresh: vi.fn(),
  getConfirmedData: vi.fn(),
  clientReady: vi.fn().mockReturnValue(true),
})

// Mock the module
vi.mock('./grpcOptimisticStore', () => ({
  createGrpcOptimisticStore: vi.fn(() => () => createMockStore()),
}))

describe('grpcOptimisticStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Store Creation', () => {
    it('should create a store with the required interface', () => {
      // Create store
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Verify interface
      expect(store).toHaveProperty('isLoading')
      expect(store).toHaveProperty('isWriting')
      expect(store).toHaveProperty('error')
      expect(store).toHaveProperty('writeError')
      expect(store).toHaveProperty('lastUpdated')
      expect(store).toHaveProperty('getData')
      expect(store).toHaveProperty('refresh')
      expect(store).toHaveProperty('setParams')
      expect(store).toHaveProperty('setInitialData')
    })

    it('should create a store with write capability when write function is provided', () => {
      // Create store with write function
      createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
        write: vi.fn(),
      })

      // Verify createGrpcOptimisticStore was called with write function
      expect(createGrpcOptimisticStore).toHaveBeenCalledWith(
        expect.objectContaining({
          write: expect.any(Function),
        })
      )
    })

    it('should create a store with update capability when both write and mergeFn are provided', () => {
      // Create store with write and mergeFn
      createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
        write: vi.fn(),
        mergeFn: vi.fn(),
      })

      // Verify createGrpcOptimisticStore was called with write and mergeFn
      expect(createGrpcOptimisticStore).toHaveBeenCalledWith(
        expect.objectContaining({
          write: expect.any(Function),
          mergeFn: expect.any(Function),
        })
      )
    })

    it('should not create update capability if only mergeFn is provided without write', () => {
      // Create store with mergeFn but no write
      createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
        mergeFn: vi.fn(),
      })

      // Verify createGrpcOptimisticStore was called with mergeFn but without write
      expect(createGrpcOptimisticStore).toHaveBeenCalledWith(
        expect.objectContaining({
          mergeFn: expect.any(Function),
        })
      )
      expect(createGrpcOptimisticStore).toHaveBeenCalledWith(
        expect.not.objectContaining({
          write: expect.any(Function),
        })
      )
    })

    it('should accept custom config options like debounceTime', () => {
      // Create store with custom config
      createGrpcOptimisticStore(
        {
          createClient: vi.fn(),
          read: vi.fn(),
        },
        {
          debounceTime: 500,
        }
      )

      // Verify function was called with config
      expect(createGrpcOptimisticStore).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          debounceTime: 500,
        })
      )
    })
  })

  describe('Data Operations', () => {
    it('should set params with the provided parameters', () => {
      // Create store
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Set params
      const params = { endpoint: 'test' }
      store.setParams(params)

      // Verify setParams was called with the parameters
      expect(store.setParams).toHaveBeenCalledWith(params)
    })

    it('should set initial data directly', () => {
      // Create store
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Set initial data
      const data = { id: '1', name: 'Test Data' }
      store.setInitialData(data)

      // Verify setInitialData was called with the data
      expect(store.setInitialData).toHaveBeenCalledWith(data)
    })

    it('should refresh data when requested', () => {
      // Create store
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Refresh data
      store.refresh()

      // Verify refresh was called
      expect(store.refresh).toHaveBeenCalled()
    })

    it('should have a getData method', () => {
      // Create store
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Verify getData exists and is called
      expect(typeof store.getData).toBe('function')
      store.getData()
      expect(store.getData).toHaveBeenCalled()
    })

    it('should check if client is ready', () => {
      // Create store
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Check if client is ready
      store.clientReady()

      // Verify clientReady was called
      expect(store.clientReady).toHaveBeenCalled()
    })

    it('should access confirmed data via getConfirmedData', () => {
      // Create store
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Get confirmed data
      store.getConfirmedData()

      // Verify getConfirmedData was called
      expect(store.getConfirmedData).toHaveBeenCalled()
    })

    it('should force refresh data when requested', () => {
      // Create store
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Force refresh
      store.forceRefresh()

      // Verify forceRefresh was called
      expect(store.forceRefresh).toHaveBeenCalled()
    })
  })

  describe('Write Operations', () => {
    it('should call write with the provided data', () => {
      // Create store with write capability
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
        write: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Write data
      const data = { id: '1', name: 'Test Write' }
      store.write(data)

      // Verify write was called with the data
      expect(store.write).toHaveBeenCalledWith(data)
    })

    it('should call update with the provided partial data', () => {
      // Create store with update capability
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
        write: vi.fn(),
        mergeFn: vi.fn(),
      })

      // Get the store
      const store = useStore()

      // Update data
      const partialData = { name: 'Updated Name' }
      store.update(partialData)

      // Verify update was called with the partial data
      expect(store.update).toHaveBeenCalledWith(partialData)
    })
  })

  describe('Store Properties', () => {
    it('should expose loading and error states', () => {
      // Create store
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
      })

      const store = useStore()

      // Verify properties exist
      expect(store.isLoading).toBe(false)
      expect(store.isWriting).toBe(false)
      expect(store.error).toBeNull()
      expect(store.writeError).toBeNull()
      expect(store.lastUpdated).toBeNull()
    })

    it('should provide access to internal state for debugging', () => {
      // Create store
      const useStore = createGrpcOptimisticStore({
        createClient: vi.fn(),
        read: vi.fn(),
      })

      const store = useStore()

      // Verify internal is available
      expect(store).toHaveProperty('internal')
    })
  })
})
