import { OAuth2Token, type User } from '@zondax/auth-core'

import type { AuthError } from '../../auth-core/src/errors'

export { OAuth2Token }

export interface RefreshTokenConfig {
  issuer: string
  clientId: string
  clientSecret?: string
  scope?: string
}

export interface RefreshTokenConfig {
  issuer: string
  clientId: string
  clientSecret?: string
  scope?: string
}

export const TOKEN_ERROR = 'RefreshTokenError' as const

export interface TokenConfig extends Omit<RefreshTokenConfig, 'scope'> {
  scope?: string
}

export interface AuthState {
  accessToken: string | null
  user: User | null
  isLoading: boolean
  error: AuthError | null
}

export interface AuthContextType extends AuthState {
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export interface AuthResponse {
  type: string
  params?: {
    code?: string
    state?: string
    [key: string]: string | undefined
  }
}

export const AUTH_TIMEOUT = 60000 as const
