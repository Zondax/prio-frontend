// Stub external modules before importing index
import { describe, expect, it, vi } from 'vitest'

import { NextAuth, SessionProvider, authOptions, refreshAccessToken, useSession } from './index'

vi.mock('next-auth', () => ({ __esModule: true, default: 'NextAuthMock', DefaultSession: {} }))
vi.mock('next-auth/react', () => ({ __esModule: true, SessionProvider: 'SessionProviderMock', useSession: 'useSessionMock' }))
vi.mock('@zondax/auth-core', () => ({
  __esModule: true,
  OAuth2Token: {},
  Role: {},
  UserExtended: {},
  ZitadelSettings: {},
  refreshAccessToken: 'refreshAccessTokenMock',
}))
vi.mock('@zondax/auth-core/errors', () => ({ __esModule: true }))

describe('auth-web index exports', () => {
  it('re-exports NextAuth default', () => {
    expect(NextAuth).toBe('NextAuthMock')
  })

  it('re-exports SessionProvider', () => {
    expect(SessionProvider).toBe('SessionProviderMock')
  })

  it('re-exports useSession', () => {
    expect(useSession).toBe('useSessionMock')
  })

  it('re-exports refreshAccessToken', () => {
    expect(refreshAccessToken).toBe('refreshAccessTokenMock')
  })

  it('re-exports authOptions function from auth', () => {
    expect(typeof authOptions).toBe('function')
  })
})
