import type { ClientReadableStream } from '@prio-grpc'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { createGrpcReadStreamStore } from './grpcReadStreamStore'

// Mock zustand to avoid React hooks in tests
vi.mock('zustand', async () => {
  const actual = await vi.importActual('zustand')
  return {
    ...actual,
    create: (fn) => {
      const state = fn(
        (s) => {
          Object.assign(state, typeof s === 'function' ? s(state) : s)
          return state
        },
        () => state
      )
      const useStore = () => state
      useStore.getState = () => state
      return useStore
    },
  }
})

describe('grpcReadStreamStore', () => {
  let mockStream: Partial<ClientReadableStream<any>>
  let mockHandlers: Record<string, (data: any) => void>
  let createStreamMock: jest.Mock
  const originalDateNow = Date.now

  beforeEach(() => {
    mockHandlers = {}
    mockStream = {
      on: vi.fn((event: string, handler: any) => {
        mockHandlers[event] = handler
        return mockStream
      }),
      cancel: vi.fn(),
    }
    createStreamMock = vi.fn(() => mockStream)
    Date.now = vi.fn(() => 6789)
  })

  afterEach(() => {
    Date.now = originalDateNow
  })

  const createTestStore = () => {
    const useStore = createGrpcReadStreamStore({
      createStream: createStreamMock,
    })
    return useStore()
  }

  const emitStreamEvent = (event: string, data?: any) => {
    const handler = mockHandlers[event]
    if (handler) {
      handler(data)
    }
  }

  it('should initialize with default state', () => {
    const store = createTestStore()

    expect(store.data).toBeUndefined()
    expect(store.isLoading).toBe(false)
    expect(store.isStreaming).toBe(false)
    expect(store.error).toBe(null)
    expect(store.lastUpdated).toBe(null)
  })

  it('should have the expected interface', () => {
    const useTestStore = createGrpcReadStreamStore({
      createStream: createStreamMock,
    })

    const store = useTestStore()

    expect(store).toHaveProperty('data')
    expect(store).toHaveProperty('isLoading')
    expect(store).toHaveProperty('isStreaming')
    expect(store).toHaveProperty('error')
    expect(store).toHaveProperty('lastUpdated')
    expect(store).toHaveProperty('setParams')
    expect(store).toHaveProperty('getData')
    expect(store).toHaveProperty('startStream')
    expect(store).toHaveProperty('stopStream')
  })

  it('should start streaming when setParams is called', () => {
    const useTestStore = createGrpcReadStreamStore({
      createStream: createStreamMock,
    })

    const store = useTestStore()
    const testParams = { endpoint: 'test-endpoint' }
    store.setParams(testParams)

    expect(createStreamMock).toHaveBeenCalledWith(testParams)
    expect(store.isStreaming).toBe(true)
    expect(store.isLoading).toBe(true)
    expect(store.error).toBe(null)
  })

  it('should handle stream data events', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test-endpoint' })

    const testData = { value: 'test-data' }
    emitStreamEvent('data', testData)

    expect(store.data).toEqual(testData)
    expect(store.error).toBe(null)
    expect(store.isLoading).toBe(false)
    expect(store.lastUpdated).toBe(6789)
  })

  it('should handle stream error events', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test-endpoint' })

    const testError = new Error('Test error')
    emitStreamEvent('error', testError)

    expect(store.error).toBe('Test error')
    expect(store.isLoading).toBe(false)
    expect(store.isStreaming).toBe(false)
  })

  it('should handle stream end events', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test-endpoint' })

    emitStreamEvent('end')

    expect(store.isStreaming).toBe(false)
    expect(store.isLoading).toBe(false)
  })

  it('should stop streaming when stopStream is called', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test-endpoint' })
    store.stopStream()

    expect(mockStream.cancel).toHaveBeenCalled()
    expect(store.isStreaming).toBe(false)
    expect(store.isLoading).toBe(false)
  })

  it('should not start streaming if already streaming', () => {
    const useTestStore = createGrpcReadStreamStore({
      createStream: createStreamMock,
    })

    const store = useTestStore()
    store.setParams({ endpoint: 'test-endpoint' })

    // Reset mock to check if it's called again
    createStreamMock.mockClear()

    store.startStream()

    expect(createStreamMock).not.toHaveBeenCalled()
  })

  it('should not start streaming without params', () => {
    const useTestStore = createGrpcReadStreamStore({
      createStream: createStreamMock,
    })

    const store = useTestStore()
    store.startStream()

    expect(createStreamMock).not.toHaveBeenCalled()
    expect(store.isStreaming).toBe(false)
  })

  it('should handle stream creation errors', () => {
    const errorMessage = 'Failed to create stream'
    createStreamMock.mockImplementationOnce(() => {
      throw new Error(errorMessage)
    })

    const useTestStore = createGrpcReadStreamStore({
      createStream: createStreamMock,
    })

    const store = useTestStore()
    store.setParams({ endpoint: 'test-endpoint' })

    expect(store.error).toBe(errorMessage)
    expect(store.isLoading).toBe(false)
    expect(store.isStreaming).toBe(false)
  })

  it('should return current data through getData', () => {
    const useTestStore = createGrpcReadStreamStore({
      createStream: createStreamMock,
    })

    const store = useTestStore()
    store.setParams({ endpoint: 'test-endpoint' })

    const testData = { value: 'test-data' }
    emitStreamEvent('data', testData)

    expect(store.getData()).toEqual(testData)
  })

  it('should handle multiple stream starts and stops', () => {
    const store = createTestStore()

    // First stream
    store.setParams({ endpoint: 'test-1' })
    expect(store.isStreaming).toBe(true)
    expect(createStreamMock).toHaveBeenCalledTimes(1)

    // Stop stream
    store.stopStream()
    expect(store.isStreaming).toBe(false)
    expect(mockStream.cancel).toHaveBeenCalledTimes(1)

    // Start new stream
    store.setParams({ endpoint: 'test-2' })
    expect(store.isStreaming).toBe(true)
    expect(createStreamMock).toHaveBeenCalledTimes(2)
  })

  it('should handle error recovery', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test' })

    // Simulate error
    const testError = new Error('Test error')
    emitStreamEvent('error', testError)
    expect(store.error).toBe('Test error')
    expect(store.isStreaming).toBe(false)

    // Recover by starting new stream
    store.setParams({ endpoint: 'test' })
    expect(store.error).toBe(null)
    expect(store.isStreaming).toBe(true)
    expect(createStreamMock).toHaveBeenCalledTimes(2)
  })

  it('should not start multiple streams if already streaming', () => {
    const store = createTestStore()

    // Start first stream
    store.setParams({ endpoint: 'test' })
    expect(createStreamMock).toHaveBeenCalledTimes(1)

    // Try to start another stream with same params
    store.setParams({ endpoint: 'test' })
    expect(createStreamMock).toHaveBeenCalledTimes(1)

    // Try to start another stream with different params
    store.setParams({ endpoint: 'test-2' })
    expect(createStreamMock).toHaveBeenCalledTimes(2)
  })

  it('should handle rapid start/stop sequences', () => {
    const store = createTestStore()

    store.setParams({ endpoint: 'test-1' })
    store.stopStream()
    store.setParams({ endpoint: 'test-2' })
    store.stopStream()
    store.setParams({ endpoint: 'test-3' })

    expect(createStreamMock).toHaveBeenCalledTimes(3)
    expect(mockStream.cancel).toHaveBeenCalledTimes(2)
    expect(store.isStreaming).toBe(true)
  })

  it('should maintain data after stream end', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test' })

    const testData = { value: 'test-data' }
    emitStreamEvent('data', testData)
    expect(store.data).toEqual(testData)

    emitStreamEvent('end')
    expect(store.isStreaming).toBe(false)
    expect(store.data).toEqual(testData) // Data should persist
  })

  it('should validate and sanitize params before creating stream', () => {
    const store = createTestStore()

    // Empty params should not start stream
    store.setParams({})
    expect(createStreamMock).not.toHaveBeenCalled()

    // Null params should not start stream
    store.setParams(null)
    expect(createStreamMock).not.toHaveBeenCalled()

    // Invalid endpoint should not start stream
    store.setParams({ endpoint: '' })
    expect(createStreamMock).not.toHaveBeenCalled()
  })

  it('should cleanup resources when stopping stream', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test' })

    // Add some data
    const testData = { value: 'test-data' }
    emitStreamEvent('data', testData)

    // Stop stream and verify cleanup
    store.stopStream()
    expect(mockStream.cancel).toHaveBeenCalled()
    expect(store.isStreaming).toBe(false)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
    // Data should persist after cleanup
    expect(store.data).toEqual(testData)
  })

  it('should handle concurrent setParams calls', () => {
    const store = createTestStore()

    // Simulate rapid concurrent setParams calls
    store.setParams({ endpoint: 'test-1' })
    store.setParams({ endpoint: 'test-2' })
    store.setParams({ endpoint: 'test-3' })

    // Should only use the latest params
    expect(createStreamMock).toHaveBeenCalledTimes(3)
    expect(createStreamMock).toHaveBeenLastCalledWith({ endpoint: 'test-3' })
  })
})

describe('Stream Lifecycle', () => {
  let mockStream: Partial<ClientReadableStream<any>>
  let mockHandlers: Record<string, (data: any) => void>
  let createStreamMock: jest.Mock

  beforeEach(() => {
    mockHandlers = {}
    mockStream = {
      on: vi.fn((event: string, handler: any) => {
        mockHandlers[event] = handler
        return mockStream
      }),
      cancel: vi.fn(),
    }
    createStreamMock = vi.fn(() => mockStream)
  })

  const createTestStore = () => {
    const useStore = createGrpcReadStreamStore({
      createStream: createStreamMock,
    })
    return useStore()
  }

  const emitStreamEvent = (event: string, data?: any) => {
    const handler = mockHandlers[event]
    if (handler) {
      handler(data)
    }
  }

  it('should start streaming when initialized', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test' })
    expect(store.isStreaming).toBe(true)
    expect(mockStream.on).toHaveBeenCalled()
  })

  it('should handle data events', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test' })

    const testData = { value: 'test' }
    emitStreamEvent('data', testData)
    expect(store.data).toEqual(testData)
  })

  it('should handle error events', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test' })

    const testError = new Error('test error')
    emitStreamEvent('error', testError)
    expect(store.error).toBe(testError.message)
    expect(store.isStreaming).toBe(false)
  })

  it('should handle end events', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test' })
    emitStreamEvent('end')
    expect(store.isStreaming).toBe(false)
  })
})

describe('Store Properties', () => {
  let mockStream: Partial<ClientReadableStream<any>>
  let mockHandlers: Record<string, (data: any) => void>
  let createStreamMock: jest.Mock

  beforeEach(() => {
    mockHandlers = {}
    mockStream = {
      on: vi.fn((event: string, handler: any) => {
        mockHandlers[event] = handler
        return mockStream
      }),
      cancel: vi.fn(),
    }
    createStreamMock = vi.fn(() => mockStream)
  })

  const createTestStore = () => {
    const useStore = createGrpcReadStreamStore({
      createStream: createStreamMock,
    })
    return useStore()
  }

  const emitStreamEvent = (event: string, data?: any) => {
    const handler = mockHandlers[event]
    if (handler) {
      handler(data)
    }
  }

  it('should expose loading and streaming states', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test' })
    expect(store.isLoading).toBe(true)
    expect(store.isStreaming).toBe(true)
  })

  it('should expose error state', () => {
    const store = createTestStore()
    store.setParams({ endpoint: 'test' })
    const testError = new Error('test error')
    emitStreamEvent('error', testError)
    expect(store.error).toBe(testError.message)
  })
})

describe('Stream Creation Errors', () => {
  let mockStream: Partial<ClientReadableStream<any>>
  let mockHandlers: Record<string, (data: any) => void>
  let createStreamMock: jest.Mock

  beforeEach(() => {
    mockHandlers = {}
    mockStream = {
      on: vi.fn((event: string, handler: any) => {
        mockHandlers[event] = handler
        return mockStream
      }),
      cancel: vi.fn(),
    }
    createStreamMock = vi.fn(() => mockStream)
  })

  const createTestStore = () => {
    const useStore = createGrpcReadStreamStore({
      createStream: createStreamMock,
    })
    return useStore()
  }

  it('should handle stream creation errors', () => {
    const error = new Error('Failed to create stream')
    createStreamMock.mockImplementationOnce(() => {
      throw error
    })
    const store = createTestStore()
    store.setParams({ endpoint: 'test' })
    expect(store.error).toBe(error.message)
    expect(store.isStreaming).toBe(false)
  })
})
