import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TOKEN_ERROR, type TokenConfig, handleTokenRefreshCycle, isTokenExpired, refreshAccessToken } from './refresh'
import type { OAuth2Token } from './types'

// Create custom refreshAccessToken test functions instead of mocking axios
const createMockRefreshFn = (mockResponse: OAuth2Token | Error) => {
  if (mockResponse instanceof Error) {
    return vi.fn().mockRejectedValue(mockResponse)
  }
  return vi.fn().mockResolvedValue(mockResponse)
}

describe('Auth Token Management', () => {
  // Common test configuration
  const mockConfig: TokenConfig = {
    issuer: 'https://auth.example.com',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    scope: 'openid profile',
    debug: false,
  }

  describe('Utility Functions', () => {
    describe('isTokenExpired', () => {
      beforeEach(() => {
        vi.useFakeTimers()
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      it('should return true if expiresAt is undefined', () => {
        expect(isTokenExpired(undefined)).toBe(true)
      })

      it('should return true if token is expired', () => {
        // Set current time to 2023-01-01T00:00:00.000Z
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
        // Token expired 1 second ago (timestamp in seconds)
        const expiresAt = Math.floor(new Date('2022-12-31T23:59:59.000Z').getTime() / 1000)

        expect(isTokenExpired(expiresAt)).toBe(true)
      })

      it('should return false if token is not expired', () => {
        // Set current time to 2023-01-01T00:00:00.000Z
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
        // Token expires in 1 second (timestamp in seconds)
        const expiresAt = Math.floor(new Date('2023-01-01T00:00:01.000Z').getTime() / 1000)

        expect(isTokenExpired(expiresAt)).toBe(false)
      })

      it('should handle very large expiration timestamps correctly', () => {
        // Set current time to a known value
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
        // Large but not expired timestamp
        const largeButNotExpired = Math.floor(Number.MAX_SAFE_INTEGER / 1000)

        expect(isTokenExpired(largeButNotExpired)).toBe(false)
      })

      it('should return true when expiresAt is 0', () => {
        expect(isTokenExpired(0)).toBe(true)
      })

      it('should return true when expiresAt is negative', () => {
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
        expect(isTokenExpired(-100)).toBe(true)
      })

      it('should handle tokens that are about to expire', () => {
        // Set current time
        const now = new Date('2023-01-01T00:00:00.000Z')
        vi.setSystemTime(now)
        // Token expires in 1 second
        const expiresAt = Math.floor(now.getTime() / 1000) + 1

        expect(isTokenExpired(expiresAt)).toBe(false)
      })
    })
  })

  describe('Token Refresh', () => {
    describe('refreshAccessToken', () => {
      beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))
        vi.clearAllMocks()
        vi.spyOn(console, 'error').mockImplementation(() => {})
        vi.spyOn(console, 'warn').mockImplementation(() => {})
      })

      afterEach(() => {
        vi.useRealTimers()
      })

      it('should properly format the request and handle the response', async () => {
        // Mock the axios HTTP client
        const mockHttpClient = {
          post: vi.fn(),
          isAxiosError: () => true,
        }

        const mockResponse = {
          data: {
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token',
            token_type: 'Bearer',
            expires_in: 3600,
          },
        }

        mockHttpClient.post.mockResolvedValue(mockResponse)

        // Instead of mocking the entire module, create a local mock for OAuth2TokenSchema.parse
        const mockParse = vi.fn().mockImplementation((data) => {
          return {
            ...data,
            expires_at: data.expires_at || Math.floor(new Date('2023-01-01T00:00:00.000Z').getTime() / 1000) + (data.expires_in || 0),
          }
        })

        // Use jest.spyOn to mock specific methods without affecting the whole module
        const actualModule = await import('./types')
        const originalParse = actualModule.OAuth2TokenSchema.parse

        // Replace the parse method for just this test
        actualModule.OAuth2TokenSchema.parse = mockParse

        try {
          // Call the refreshAccessToken function with our mocked HTTP client
          const result = await refreshAccessToken('test-refresh-token', mockConfig, mockHttpClient as any)

          // Verify the request was formatted correctly
          expect(mockHttpClient.post).toHaveBeenCalledWith(
            `${mockConfig.issuer}/oauth/v2/token`,
            expect.stringContaining('client_id=test-client-id'),
            expect.objectContaining({
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
          )

          // Verify we got the expected result
          expect(result).toHaveProperty('access_token', 'new-access-token')
          expect(result).toHaveProperty('refresh_token', 'new-refresh-token')
          expect(result).toHaveProperty('expires_at')
        } finally {
          // Restore the original implementation to avoid affecting other tests
          actualModule.OAuth2TokenSchema.parse = originalParse
        }
      })

      it('should handle HTTP errors properly', async () => {
        // Set up a fixed time for deterministic testing
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))

        // Mock the axios HTTP client with an error response
        const mockError = {
          message: 'Request failed',
          response: {
            status: 401,
            statusText: 'Unauthorized',
            data: { error: 'invalid_refresh_token' },
          },
        }

        const mockHttpClient = {
          post: vi.fn().mockRejectedValue(mockError),
          isAxiosError: () => true,
        }

        // Call refreshAccessToken with our mocked HTTP client that throws an error
        await expect(refreshAccessToken('invalid-refresh-token', mockConfig, mockHttpClient as any)).rejects.toThrow(TOKEN_ERROR)

        // Verify console.error was called with the error details
        expect(console.error).toHaveBeenCalled()
      })
    })

    describe('handleTokenRefreshCycle', () => {
      const mockToken: OAuth2Token = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      }

      beforeEach(() => {
        vi.useFakeTimers()
        vi.resetAllMocks()
        vi.spyOn(console, 'error').mockImplementation(() => {})
      })

      afterEach(() => {
        vi.useRealTimers()
        vi.restoreAllMocks()
      })

      it('should return existing token if not expired', async () => {
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))

        const validToken: OAuth2Token = {
          access_token: 'valid-access-token',
          refresh_token: 'valid-refresh-token',
          expires_at: Math.floor(new Date('2023-01-01T01:00:00.000Z').getTime() / 1000), // Expires in 1 hour
        }

        const result = await handleTokenRefreshCycle(validToken, mockConfig)

        expect(result).toBe(validToken)
      })

      it('should throw TypeError if refresh_token is missing', async () => {
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))

        const expiredToken: OAuth2Token = {
          access_token: 'expired-access-token',
          expires_at: Math.floor(new Date('2022-12-31T23:00:00.000Z').getTime() / 1000), // Expired 1 hour ago
        }

        await expect(handleTokenRefreshCycle(expiredToken, mockConfig)).rejects.toThrow('Missing refresh_token')
      })

      it('should refresh token if expired and call onRefreshSuccess', async () => {
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))

        const expiredToken: OAuth2Token = {
          access_token: 'expired-access-token',
          refresh_token: 'valid-refresh-token',
          expires_at: Math.floor(new Date('2022-12-31T23:00:00.000Z').getTime() / 1000), // Expired 1 hour ago
        }

        const newToken: OAuth2Token = {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          token_type: 'Bearer',
          expires_at: Math.floor(new Date('2023-01-01T01:00:00.000Z').getTime() / 1000), // Expires in 1 hour
        }

        // Create a mock refresh function that we control directly
        const mockRefreshFn = vi.fn().mockResolvedValueOnce(newToken)

        const onRefreshSuccess = vi.fn()

        const result = await handleTokenRefreshCycle(expiredToken, mockConfig, { onRefreshSuccess }, mockRefreshFn)

        expect(mockRefreshFn).toHaveBeenCalledWith(expiredToken.refresh_token, mockConfig)
        expect(result).toEqual(newToken)
        expect(onRefreshSuccess).toHaveBeenCalledWith(newToken)
      })

      it('should call onRefreshError when refresh fails', async () => {
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))

        const expiredToken: OAuth2Token = {
          access_token: 'expired-access-token',
          refresh_token: 'invalid-refresh-token',
          expires_at: Math.floor(new Date('2022-12-31T23:00:00.000Z').getTime() / 1000), // Expired 1 hour ago
        }

        // Create a mock refresh function that we control directly
        const error = new Error(TOKEN_ERROR)
        const mockRefreshFn = vi.fn().mockRejectedValueOnce(error)

        const onRefreshError = vi.fn()

        await expect(handleTokenRefreshCycle(expiredToken, mockConfig, { onRefreshError }, mockRefreshFn)).rejects.toThrow(TOKEN_ERROR)

        expect(mockRefreshFn).toHaveBeenCalledWith(expiredToken.refresh_token, mockConfig)
        expect(onRefreshError).toHaveBeenCalledWith(error)
      })

      it('should refresh token if expired without callback functions', async () => {
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))

        const expiredToken: OAuth2Token = {
          access_token: 'expired-access-token',
          refresh_token: 'valid-refresh-token',
          expires_at: Math.floor(new Date('2022-12-31T23:00:00.000Z').getTime() / 1000), // Expired 1 hour ago
        }

        const newToken: OAuth2Token = {
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          token_type: 'Bearer',
          expires_at: Math.floor(new Date('2023-01-01T01:00:00.000Z').getTime() / 1000), // Expires in 1 hour
        }

        const mockRefreshFn = vi.fn().mockResolvedValueOnce(newToken)

        const result = await handleTokenRefreshCycle(expiredToken, mockConfig, undefined, mockRefreshFn)

        expect(mockRefreshFn).toHaveBeenCalledWith(expiredToken.refresh_token, mockConfig)
        expect(result).toEqual(newToken)
      })

      it('should successfully handle token refresh with custom function', async () => {
        // Set up a fixed time
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))

        // Mock the refresh function
        const customMockRefreshFn = createMockRefreshFn(mockToken)

        const expiredToken: OAuth2Token = {
          access_token: 'expired-access-token',
          refresh_token: 'valid-refresh-token',
          expires_at: Math.floor(new Date('2022-12-31T23:00:00.000Z').getTime() / 1000), // Already expired
        }

        const result = await handleTokenRefreshCycle(expiredToken, mockConfig, undefined, customMockRefreshFn)

        expect(customMockRefreshFn).toHaveBeenCalledWith('valid-refresh-token', mockConfig)
        expect(result).toEqual(mockToken)
      })

      it('should throw TOKEN_ERROR when refresh fails with custom function', async () => {
        // Set up a fixed time
        vi.setSystemTime(new Date('2023-01-01T00:00:00.000Z'))

        const error = new Error(TOKEN_ERROR)
        const customMockRefreshFn = createMockRefreshFn(error)

        const expiredToken: OAuth2Token = {
          access_token: 'expired-access-token',
          refresh_token: 'invalid-refresh-token',
          expires_at: Math.floor(new Date('2022-12-31T23:00:00.000Z').getTime() / 1000), // Already expired
        }

        await expect(handleTokenRefreshCycle(expiredToken, mockConfig, undefined, customMockRefreshFn)).rejects.toThrow(TOKEN_ERROR)

        expect(customMockRefreshFn).toHaveBeenCalledWith('invalid-refresh-token', mockConfig)
      })
    })
  })
})
