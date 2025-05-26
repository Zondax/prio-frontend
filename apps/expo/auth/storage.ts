import type { OAuth2Token } from '@zondax/auth-expo'
import * as SecureStore from 'expo-secure-store'

const AUTH_TOKENS_KEY = 'auth_tokens'
const INTEGRITY_KEY_ID_KEY = 'INTEGRITY_KEY_IDENTIFIER'

interface StoredTokens {
  accessToken: string
  refreshToken?: string | null
  idToken?: string | null
  expiresAt: number
}

export async function saveAuthTokens(tokenResult: OAuth2Token) {
  try {
    if (!tokenResult.expires_in) {
      throw new Error('Token must have expiration time')
    }

    if (!tokenResult.access_token) {
      throw new Error('Access token is required')
    }

    const expiresAt = tokenResult.expires_at || Math.floor(Date.now() / 1000) + tokenResult.expires_in

    const tokens: StoredTokens = {
      accessToken: tokenResult.access_token,
      refreshToken: tokenResult.refresh_token || null,
      idToken: tokenResult.id_token || null,
      expiresAt,
    }

    await SecureStore.setItemAsync(AUTH_TOKENS_KEY, JSON.stringify(tokens))
  } catch (error) {
    console.error('[saveAuthTokens] Error:', error)
    throw error
  }
}

export async function loadAuthTokens() {
  const storedTokens = await SecureStore.getItemAsync(AUTH_TOKENS_KEY)

  if (!storedTokens) {
    // No tokens found, this is normal for users who are not logged in
    console.warn('No token found, the user may not be logged in')
    return null
  }

  const tokens = JSON.parse(storedTokens) as StoredTokens

  if (!tokens.accessToken) {
    throw new Error('Access token not found in storage')
  }

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken || null,
    idToken: tokens.idToken || null,
    expiresAt: tokens.expiresAt,
  }
}

export async function clearAuthTokens() {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKENS_KEY)
  } catch (error) {
    console.error('[clearAuthTokens] Error:', error)
    throw error
  }
}

export async function getIntegrityKeyId(): Promise<string> {
  return (await SecureStore.getItemAsync(INTEGRITY_KEY_ID_KEY)) || ''
}
