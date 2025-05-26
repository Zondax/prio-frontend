import axios from 'axios'

import { type OAuth2Token, OAuth2TokenSchema, type ZitadelSettings } from './types'

export const TOKEN_ERROR = 'RefreshTokenError' as const
export interface TokenConfig extends Omit<ZitadelSettings, 'scope' | 'debug' | 'clientSecret'> {
  scope?: string
  debug?: boolean
  clientSecret?: string
}

export const isTokenExpired = (expiresAt?: number): boolean => {
  if (!expiresAt) {
    return true
  }
  return Date.now() >= expiresAt * 1000
}

/**
 * Client-side service to refresh OAuth2 access tokens
 * Used exclusively by mobile and web applications for token renewal
 * @param refreshToken - The refresh token to use
 * @param config - Token configuration including issuer and client details
 * @param httpClient - Optional HTTP client (for easier testing)
 * @returns Promise resolving to new OAuth2Token
 * @throws Error with TOKEN_ERROR if refresh fails
 */
export const refreshAccessToken = async (refreshToken: string, config: TokenConfig, httpClient = axios): Promise<OAuth2Token> => {
  try {
    return await refreshTokenPair(
      refreshToken,
      {
        issuer: config.issuer,
        clientId: config.clientId,
        clientSecret: config.clientSecret || '',
        scope: config.scope || '',
        debug: config.debug ?? false,
      },
      httpClient
    )
  } catch (error) {
    console.error('[refreshAccessToken] Error:', error)
    throw new Error(TOKEN_ERROR)
  }
}

/**
 * Main token management service for client applications
 * Used by mobile and web clients to handle token lifecycle
 * Manages automatic token refresh when expired
 * @param token - Current OAuth2Token
 * @param config - Token configuration
 * @param options - Optional callback options for post-refresh actions
 * @param refreshFn - Optional function for refreshing tokens (for easier testing)
 * @returns Promise resolving to either existing or refreshed OAuth2Token
 * @throws TypeError if refresh_token is missing
 */
export const handleTokenRefreshCycle = async (
  token: OAuth2Token,
  config: TokenConfig,
  options?: {
    onRefreshSuccess?: (newToken: OAuth2Token) => Promise<void> | void
    onRefreshError?: (error: unknown) => Promise<void> | void
  },
  refreshFn = refreshAccessToken
): Promise<OAuth2Token> => {
  if (!isTokenExpired(token.expires_at)) {
    return token
  }

  if (!token.refresh_token) {
    throw new TypeError('Missing refresh_token')
  }

  try {
    const newToken = await refreshFn(token.refresh_token, config)
    if (options?.onRefreshSuccess) {
      await options.onRefreshSuccess(newToken)
    }
    return newToken
  } catch (error) {
    if (options?.onRefreshError) {
      await options.onRefreshError(error)
    }
    throw error
  }
}

/**
 * Refreshes the access token using a refresh token
 * @param refreshToken The refresh token to use
 * @param config The configuration for the refresh token request
 * @param httpClient Optional HTTP client (for easier testing)
 * @returns A promise that resolves to the new token pair
 */
async function refreshTokenPair(refreshToken: string, config: ZitadelSettings, httpClient = axios): Promise<OAuth2Token> {
  if (config.scope === '') {
    console.warn('[refreshAccessToken] Scope is empty, using default scope')
  }

  try {
    const params = new URLSearchParams({
      client_id: config.clientId,
      ...(config.clientSecret && { client_secret: config.clientSecret }),
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
      scope: config.scope,
    })

    const response = await httpClient.post<OAuth2Token>(`${config.issuer}/oauth/v2/token`, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    const tokenData = response.data
    if (!tokenData.expires_at) {
      tokenData.expires_at = Math.floor(Date.now() / 1000) + (tokenData.expires_in ?? 0)
    }

    return OAuth2TokenSchema.parse(tokenData)
  } catch (error) {
    if (httpClient.isAxiosError(error)) {
      console.error('[refreshTokenPair] Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      })
    } else {
      console.error('[refreshTokenPair] Unexpected error:', error)
    }
    throw error
  }
}
