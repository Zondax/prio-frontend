export abstract class BaseError extends Error {
  abstract code: string
  originalError?: unknown

  constructor(message: string, originalError?: unknown) {
    super(message)
    this.originalError = originalError
  }
}

export class InvalidPlatformError extends BaseError {
  code = 'INVALID_PLATFORM'
  platform?: string

  constructor(message: string, platform?: string) {
    super(message)
    this.name = 'InvalidPlatformError'
    this.platform = platform
  }
}

export class ChallengeFetchError extends BaseError {
  code = 'CHALLENGE_FETCH_FAILED'

  constructor(message: string, originalError?: unknown) {
    super(message, originalError)
    this.name = 'ChallengeFetchError'
  }
}

export class ConfigFetchError extends BaseError {
  code = 'CONFIG_FETCH_FAILED'

  constructor(message: string, originalError?: unknown) {
    super(message, originalError)
    this.name = 'ConfigFetchError'
  }
}

export class NetworkError extends BaseError {
  code = 'NETWORK_ERROR'

  constructor(message: string, originalError?: unknown) {
    super(message, originalError)
    this.name = 'NetworkError'
  }
}

export class ServerError extends BaseError {
  code = 'SERVER_ERROR'
  statusCode?: number

  constructor(message: string, statusCode?: number, originalError?: unknown) {
    super(message, originalError)
    this.name = 'ServerError'
    this.statusCode = statusCode
  }
}

export class UnknownError extends BaseError {
  code = 'UNKNOWN_ERROR'

  constructor(message: string, originalError?: unknown) {
    super(message, originalError)
    this.name = 'UnknownError'
  }
}

export class AuthContextError extends BaseError {
  code = 'AUTH_CONTEXT_ERROR'

  constructor(message = 'useAuth must be used within an AuthProvider') {
    super(message)
    this.name = 'AuthContextError'
  }
}

export class AuthenticationError extends BaseError {
  code = 'AUTHENTICATION_ERROR'

  constructor(message = 'Authentication failed', originalError?: unknown) {
    super(message, originalError)
    this.name = 'AuthenticationError'
  }
}

export class TokenRefreshError extends BaseError {
  code = 'TOKEN_REFRESH_ERROR'

  constructor(message = 'Token refresh failed', originalError?: unknown) {
    super(message, originalError)
    this.name = 'TokenRefreshError'
  }
}

export class TokenStorageError extends BaseError {
  code = 'TOKEN_STORAGE_ERROR'

  constructor(message = 'Failed to access token storage', originalError?: unknown) {
    super(message, originalError)
    this.name = 'TokenStorageError'
  }
}

export type AuthError = BaseError

export const isAuthError = (error: unknown): error is AuthError => {
  return error instanceof BaseError
}

export type AttestationError = InvalidPlatformError | ChallengeFetchError | ConfigFetchError | NetworkError | ServerError | UnknownError
