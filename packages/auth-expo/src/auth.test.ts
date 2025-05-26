import { refreshAccessToken } from '@zondax/auth-core'
import { jwtDecode } from 'jwt-decode'
import { type Mock, describe, expect, it, vi } from 'vitest'

import { getUserFromToken, refreshToken } from './auth'
import type { OAuth2Token } from './types'

// Mock dependencies
vi.mock('@zondax/auth-core', () => ({ refreshAccessToken: vi.fn() }))
vi.mock('jwt-decode', () => ({ jwtDecode: vi.fn() }))

const mockRefreshAccessToken = refreshAccessToken as unknown as Mock
const mockJwtDecode = jwtDecode as unknown as Mock

describe('refreshToken', () => {
  const config = { issuer: 'https://auth', clientId: 'cid', scope: 's' }

  it('throws when refreshToken is empty', async () => {
    await expect(refreshToken(config, '')).rejects.toThrow('No token available')
  })

  it('returns token when refreshAccessToken resolves', async () => {
    const token: OAuth2Token = { access_token: 'a', refresh_token: 'r', expires_in: 0, token_type: 'Bearer', expires_at: 100 }
    mockRefreshAccessToken.mockResolvedValue(token)
    const result = await refreshToken(config, 'rt')
    expect(mockRefreshAccessToken).toHaveBeenCalledWith('rt', { issuer: config.issuer, clientId: config.clientId, scope: config.scope })
    expect(result).toBe(token)
  })

  it('logs and rethrows on error from refreshAccessToken', async () => {
    const err = new Error('fail')
    mockRefreshAccessToken.mockRejectedValue(err)
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    await expect(refreshToken(config, 'x')).rejects.toThrow(err)
    expect(spy).toHaveBeenCalledWith('[refreshToken] Error:', err)
    spy.mockRestore()
  })
})

describe('getUserFromToken', () => {
  it('returns null for null idToken', () => {
    expect(getUserFromToken(null)).toBeNull()
  })

  it('returns mapped user for valid token', () => {
    const decoded = { sub: 'id', email: 'e', given_name: 'g', family_name: 'f', preferred_username: 'u' }
    mockJwtDecode.mockReturnValue(decoded)
    const user = getUserFromToken('token')
    expect(user).toEqual({ id: 'id', email: 'e', given_name: 'g', family_name: 'f', preferred_username: 'u' })
  })

  it('returns null and logs error on invalid token format', () => {
    const error = new Error('invalid')
    mockJwtDecode.mockImplementation(() => {
      throw error
    })
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(getUserFromToken('bad')).toBeNull()
    expect(spy).toHaveBeenCalledWith('[getUserFromToken] Error decoding token:', error)
    spy.mockRestore()
  })
})
