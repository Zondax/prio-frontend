import { vi } from 'vitest'

// Mock React hooks for testing outside of components
vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useRef: (initialValue: any) => ({ current: initialValue }),
    useState: (initialValue: any) => [initialValue, vi.fn()],
    useCallback: (callback: any) => callback,
    useMemo: (factory: any) => factory(),
    useEffect: vi.fn(),
    useLayoutEffect: vi.fn(),
  }
})

// Mock Zustand selectors
vi.mock('zustand', async () => {
  const actual = await vi.importActual('zustand')

  // Create a wrapper for the create function that simplifies testing
  const wrappedCreate = (storeCreator: any) => {
    // Extract the initial state by calling the store creator with mock functions
    // This should handle both standard Zustand and middleware patterns
    const set = vi.fn()
    const get = vi.fn(() => ({}))
    const api = { set, get }

    // Call the store creator to extract the initial state
    // This handles both middleware and non-middleware patterns
    // For middleware, storeCreator returns another function
    // For non-middleware, storeCreator returns the initial state
    let initialState: any
    try {
      // First try handling it as a middleware pattern
      const storeInitializer = typeof storeCreator === 'function' ? storeCreator(set, get, api) : storeCreator

      // Now handle the result based on its type
      initialState = typeof storeInitializer === 'function' ? storeInitializer(set, get, api) : storeInitializer
    } catch (e) {
      // If there's an error, default to empty state
      initialState = {}
    }

    // Mock store.getState() to return our state
    const mockGetState = vi.fn(() => initialState)

    // Create the mock store function that will handle selectors
    const mockStore: any = vi.fn((selector) => {
      if (typeof selector === 'function') {
        return selector(mockGetState())
      }
      return mockGetState()
    })

    // Add standard Zustand store methods and properties
    mockStore.getState = mockGetState
    mockStore.setState = vi.fn()
    mockStore.subscribe = vi.fn(() => vi.fn())
    mockStore.destroy = vi.fn()

    // Add temporal middleware mock for zundo
    mockStore.temporal = {
      getState: () => ({ futureStates: [] }),
      undo: vi.fn(),
      redo: vi.fn(),
    }

    return mockStore
  }

  return {
    ...actual,
    create: wrappedCreate,
  }
})

// Mock zundo middleware
vi.mock('zundo', async () => {
  const actual = await vi.importActual('zundo')

  return {
    ...actual,
    temporal: (fn: any) => fn,
  }
})
