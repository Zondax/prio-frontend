import { type User, refreshAccessToken } from '@zondax/auth-core'
import { jwtDecode } from 'jwt-decode'

import type { OAuth2Token } from './types'

export interface StoredToken {
  accessToken: string | null
  refreshToken: string | null
  idToken: string | null
  expiresAt: number | null
}

interface RefreshConfig {
  issuer: string
  clientId: string
  scope?: string
}

/**
 * Refresh the access token
 * @param config - The refresh config
 * @returns The refreshed token
 */
export async function refreshToken(config: RefreshConfig, refreshToken: string): Promise<OAuth2Token> {
  try {
    if (!refreshToken) {
      throw new Error('No token available')
    }

    const result = await refreshAccessToken(refreshToken, {
      issuer: config.issuer,
      clientId: config.clientId,
      scope: config.scope,
    })
    return result
  } catch (error) {
    console.error('[refreshToken] Error:', error)
    throw error
  }
}

interface TokenUser extends Omit<User, 'id'> {
  sub: string
}

export const getUserFromToken = (idToken: string | null): User | null => {
  if (!idToken) return null

  try {
    const user = jwtDecode<TokenUser>(idToken)
    return {
      id: user.sub,
      email: user.email,
      given_name: user.given_name,
      family_name: user.family_name,
      preferred_username: user.preferred_username,
    }
  } catch (error) {
    console.error('[getUserFromToken] Error decoding token:', error)
    return null
  }
}
