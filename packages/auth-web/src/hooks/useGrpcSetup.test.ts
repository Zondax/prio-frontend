/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGrpcSetup } from './useGrpcSetup'

// Mock @clerk/nextjs
vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(),
}))

// Mock React hooks to avoid issues with React context
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return {
    ...actual,
    useEffect: vi.fn().mockImplementation((callback) => callback()),
    useCallback: vi.fn().mockImplementation((callback) => callback),
  }
})

import { useAuth } from '@clerk/nextjs'

// Test component that uses the hook
function TestComponent({ setParams, endpoint, options }: any) {
  useGrpcSetup(setParams, endpoint, options)
  return null
}

describe('useGrpcSetup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call setParams with auth interceptor when user is loaded', () => {
    // Mock the useAuth response
    const mockGetToken = vi.fn().mockResolvedValue('test-auth-token')
    vi.mocked(useAuth).mockReturnValue({
      getToken: mockGetToken,
      isLoaded: true,
    } as any)

    // Create a mock for the setParams function
    const mockSetParams = vi.fn()
    const mockEndpoint = 'https://api.example.com'

    // Call the hook through the test component
    TestComponent({
      setParams: mockSetParams,
      endpoint: mockEndpoint,
      options: { authHeaderName: 'x-auth-token' },
    })

    // Verify setParams was called with the correct structure
    expect(mockSetParams).toHaveBeenCalledWith({
      baseUrl: mockEndpoint,
      metadata: {},
      authInterceptor: expect.any(Function),
    })
  })

  it('should not call setParams when not loaded', () => {
    // Mock the useAuth response when not loaded
    vi.mocked(useAuth).mockReturnValue({
      getToken: vi.fn(),
      isLoaded: false,
    } as any)

    // Create a mock for the setParams function
    const mockSetParams = vi.fn()
    const mockEndpoint = 'https://api.example.com'

    // Call the hook through the test component
    TestComponent({
      setParams: mockSetParams,
      endpoint: mockEndpoint,
    })

    // Verify setParams was not called when not loaded
    expect(mockSetParams).not.toHaveBeenCalled()
  })

  it('should create auth interceptor that returns token metadata', async () => {
    // Mock the useAuth response
    const mockGetToken = vi.fn().mockResolvedValue('test-auth-token')
    vi.mocked(useAuth).mockReturnValue({
      getToken: mockGetToken,
      isLoaded: true,
    } as any)

    // Create a mock for the setParams function
    const mockSetParams = vi.fn()
    const mockEndpoint = 'https://api.example.com'

    // Call the hook through the test component
    TestComponent({
      setParams: mockSetParams,
      endpoint: mockEndpoint,
      options: { authHeaderName: 'custom-auth-header' },
    })

    // Get the auth interceptor from the call
    const setParamsCall = mockSetParams.mock.calls[0][0]
    const authInterceptor = setParamsCall.authInterceptor

    // Test the auth interceptor
    const metadata = await authInterceptor()

    expect(mockGetToken).toHaveBeenCalledWith({ leewayInSeconds: 45 })
    expect(metadata).toEqual({ 'custom-auth-header': 'test-auth-token' })
  })

  it('should handle auth interceptor when token is null', async () => {
    // Mock the useAuth response with null token
    const mockGetToken = vi.fn().mockResolvedValue(null)
    vi.mocked(useAuth).mockReturnValue({
      getToken: mockGetToken,
      isLoaded: true,
    } as any)

    // Create a mock for the setParams function
    const mockSetParams = vi.fn()
    const mockEndpoint = 'https://api.example.com'

    // Call the hook through the test component
    TestComponent({
      setParams: mockSetParams,
      endpoint: mockEndpoint,
    })

    // Get the auth interceptor from the call
    const setParamsCall = mockSetParams.mock.calls[0][0]
    const authInterceptor = setParamsCall.authInterceptor

    // Test the auth interceptor with null token
    const metadata = await authInterceptor()

    expect(metadata).toEqual({})
  })
})
