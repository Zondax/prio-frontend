import { describe, expect, it } from 'vitest'

import {
  AuthContextError,
  AuthenticationError,
  BaseError,
  ChallengeFetchError,
  ConfigFetchError,
  InvalidPlatformError,
  NetworkError,
  ServerError,
  TokenRefreshError,
  TokenStorageError,
  UnknownError,
  isAuthError,
} from './errors'

describe('Auth Error Classes', () => {
  describe('InvalidPlatformError', () => {
    it('should create error with correct properties', () => {
      const error = new InvalidPlatformError('Invalid platform', 'unknown')

      expect(error).toBeInstanceOf(BaseError)
      expect(error).toBeInstanceOf(InvalidPlatformError)
      expect(error.name).toBe('InvalidPlatformError')
      expect(error.message).toBe('Invalid platform')
      expect(error.code).toBe('INVALID_PLATFORM')
      expect(error.platform).toBe('unknown')
    })
  })

  describe('ChallengeFetchError', () => {
    it('should create error with correct properties', () => {
      const originalError = new Error('Network failure')
      const error = new ChallengeFetchError('Failed to fetch challenge', originalError)

      expect(error).toBeInstanceOf(BaseError)
      expect(error).toBeInstanceOf(ChallengeFetchError)
      expect(error.name).toBe('ChallengeFetchError')
      expect(error.message).toBe('Failed to fetch challenge')
      expect(error.code).toBe('CHALLENGE_FETCH_FAILED')
      expect(error.originalError).toBe(originalError)
    })
  })

  describe('ConfigFetchError', () => {
    it('should create error with correct properties', () => {
      const originalError = new Error('Server error')
      const error = new ConfigFetchError('Failed to fetch config', originalError)

      expect(error).toBeInstanceOf(BaseError)
      expect(error).toBeInstanceOf(ConfigFetchError)
      expect(error.name).toBe('ConfigFetchError')
      expect(error.message).toBe('Failed to fetch config')
      expect(error.code).toBe('CONFIG_FETCH_FAILED')
      expect(error.originalError).toBe(originalError)
    })
  })

  describe('NetworkError', () => {
    it('should create error with correct properties', () => {
      const originalError = new Error('Connection failed')
      const error = new NetworkError('Network request failed', originalError)

      expect(error).toBeInstanceOf(BaseError)
      expect(error).toBeInstanceOf(NetworkError)
      expect(error.name).toBe('NetworkError')
      expect(error.message).toBe('Network request failed')
      expect(error.code).toBe('NETWORK_ERROR')
      expect(error.originalError).toBe(originalError)
    })
  })

  describe('ServerError', () => {
    it('should create error with correct properties', () => {
      const originalError = new Error('Internal Server Error')
      const error = new ServerError('Server responded with error', 500, originalError)

      expect(error).toBeInstanceOf(BaseError)
      expect(error).toBeInstanceOf(ServerError)
      expect(error.name).toBe('ServerError')
      expect(error.message).toBe('Server responded with error')
      expect(error.code).toBe('SERVER_ERROR')
      expect(error.statusCode).toBe(500)
      expect(error.originalError).toBe(originalError)
    })
  })

  describe('UnknownError', () => {
    it('should create error with correct properties', () => {
      const originalError = new Error('Something went wrong')
      const error = new UnknownError('Unknown error occurred', originalError)

      expect(error).toBeInstanceOf(BaseError)
      expect(error).toBeInstanceOf(UnknownError)
      expect(error.name).toBe('UnknownError')
      expect(error.message).toBe('Unknown error occurred')
      expect(error.code).toBe('UNKNOWN_ERROR')
      expect(error.originalError).toBe(originalError)
    })
  })

  describe('AuthContextError', () => {
    it('should create error with correct properties and default message', () => {
      const error = new AuthContextError()

      expect(error).toBeInstanceOf(BaseError)
      expect(error).toBeInstanceOf(AuthContextError)
      expect(error.name).toBe('AuthContextError')
      expect(error.message).toBe('useAuth must be used within an AuthProvider')
      expect(error.code).toBe('AUTH_CONTEXT_ERROR')
    })

    it('should create error with custom message', () => {
      const error = new AuthContextError('Custom auth context error')

      expect(error.message).toBe('Custom auth context error')
    })
  })

  describe('AuthenticationError', () => {
    it('should create error with correct properties and default message', () => {
      const error = new AuthenticationError()

      expect(error).toBeInstanceOf(BaseError)
      expect(error).toBeInstanceOf(AuthenticationError)
      expect(error.name).toBe('AuthenticationError')
      expect(error.message).toBe('Authentication failed')
      expect(error.code).toBe('AUTHENTICATION_ERROR')
    })

    it('should create error with custom message and original error', () => {
      const originalError = new Error('Login failed')
      const error = new AuthenticationError('Custom auth error', originalError)

      expect(error.message).toBe('Custom auth error')
      expect(error.originalError).toBe(originalError)
    })
  })

  describe('TokenRefreshError', () => {
    it('should create error with correct properties and default message', () => {
      const error = new TokenRefreshError()

      expect(error).toBeInstanceOf(BaseError)
      expect(error).toBeInstanceOf(TokenRefreshError)
      expect(error.name).toBe('TokenRefreshError')
      expect(error.message).toBe('Token refresh failed')
      expect(error.code).toBe('TOKEN_REFRESH_ERROR')
    })

    it('should create error with custom message and original error', () => {
      const originalError = new Error('Network timeout')
      const error = new TokenRefreshError('Custom refresh error', originalError)

      expect(error.message).toBe('Custom refresh error')
      expect(error.originalError).toBe(originalError)
    })
  })

  describe('TokenStorageError', () => {
    it('should create error with correct properties and default message', () => {
      const error = new TokenStorageError()

      expect(error).toBeInstanceOf(BaseError)
      expect(error).toBeInstanceOf(TokenStorageError)
      expect(error.name).toBe('TokenStorageError')
      expect(error.message).toBe('Failed to access token storage')
      expect(error.code).toBe('TOKEN_STORAGE_ERROR')
    })

    it('should create error with custom message and original error', () => {
      const originalError = new Error('Permission denied')
      const error = new TokenStorageError('Custom storage error', originalError)

      expect(error.message).toBe('Custom storage error')
      expect(error.originalError).toBe(originalError)
    })
  })

  describe('isAuthError', () => {
    it('should return true for BaseError instances', () => {
      const error = new AuthenticationError()
      expect(isAuthError(error)).toBe(true)
    })

    it('should return false for non-BaseError instances', () => {
      const error = new Error('Regular error')
      expect(isAuthError(error)).toBe(false)
    })

    it('should return false for null and undefined', () => {
      expect(isAuthError(null)).toBe(false)
      expect(isAuthError(undefined)).toBe(false)
    })
  })
})
