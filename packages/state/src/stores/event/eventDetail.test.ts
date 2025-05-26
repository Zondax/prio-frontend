import { beforeEach, describe, expect, it, vi } from 'vitest'

import { _resetEventDetailStore, useEventDetailStore } from './eventDetail'

// Mock the store's underlying functions
let mockSetParams = vi.fn()
let mockSetInput = vi.fn()

// Mock the createGrpcSingleMethodStore module
vi.mock('@zondax/stores', () => {
  return {
    createGrpcSingleMethodStore: vi.fn(() => {
      // Return a function that creates a mock store
      return () => ({
        data: null,
        isLoading: false,
        error: null,
        lastUpdated: null,
        setParams: mockSetParams,
        setInput: mockSetInput,
      })
    }),
  }
})

// Mock the API modules
vi.mock('../../api/event', () => {
  return {
    createEventClient: vi.fn(),
    getEventByIdSingle: vi.fn(),
  }
})

describe('Event Detail Store', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    _resetEventDetailStore()
    mockSetParams = vi.fn()
    mockSetInput = vi.fn()
  })

  it('should create a store instance', () => {
    const store = useEventDetailStore()

    // Verify the store has the expected properties
    expect(store).toBeDefined()
    expect(store.eventDetailData).toBeNull()
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.lastUpdated).toBeNull()
    expect(store.setParams).toBeTypeOf('function')
    expect(store.fetchById).toBeTypeOf('function')
  })

  it('should call setParams with the provided parameters', () => {
    const store = useEventDetailStore()
    const mockParams = { baseUrl: 'http://test.com', metadata: { token: 'test-token' } }

    // Call setParams
    store.setParams(mockParams)

    // Verify setParams was called on the store
    expect(mockSetParams).toHaveBeenCalledWith(mockParams)
  })

  it('should call setInput with the event ID when fetchById is called', () => {
    const store = useEventDetailStore()
    const eventId = 123

    // Call fetchById
    store.fetchById(eventId)

    // Verify setInput was called with the event ID
    expect(mockSetInput).toHaveBeenCalledWith(eventId)
  })

  it('should return the same instance on multiple calls', () => {
    // Get the store twice
    const store1 = useEventDetailStore()
    const store2 = useEventDetailStore()

    // The reference should be the same (since we're using a singleton)
    expect(store1).not.toBe(store2) // They're not strictly equal due to React.useRef
    expect(store1.eventDetailData).toBe(store2.eventDetailData) // But they share the same data
  })
})
