/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSession } from '..'
import { useGrpcSetup } from './useGrpcSetup'

// Mock the useSession hook from the parent module
vi.mock('..', () => ({
  useSession: vi.fn(),
}))

// Mock React's useEffect to directly execute the callback
vi.mock('react', () => ({
  useEffect: vi.fn().mockImplementation((callback) => callback()),
}))

describe('useGrpcSetup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should set gRPC params with access token when token is available', () => {
    // Mock the useSession response with an access token
    const mockAccessToken = 'test-access-token'
    vi.mocked(useSession).mockReturnValue({
      data: {
        token: {
          access_token: mockAccessToken,
        },
      },
      status: 'authenticated',
    } as any)

    // Create a mock for the setParams function
    const mockSetParams = vi.fn()
    const mockEndpoint = 'https://api.example.com'

    // Call the hook directly - our mocked useEffect will execute the callback
    useGrpcSetup(mockSetParams, mockEndpoint)

    // Verify setParams was called with expected arguments
    expect(mockSetParams).toHaveBeenCalledWith({
      baseUrl: mockEndpoint,
      metadata: { authorization: `Bearer ${mockAccessToken}` },
    })
  })

  it('should not set gRPC params when access token is not available', () => {
    // Mock the useSession response without an access token
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any)

    // Create a mock for the setParams function
    const mockSetParams = vi.fn()
    const mockEndpoint = 'https://api.example.com'

    // Call the hook directly
    useGrpcSetup(mockSetParams, mockEndpoint)

    // Verify setParams was not called
    expect(mockSetParams).not.toHaveBeenCalled()
  })
})
