import { handleTokenRefreshCycle, parseZitadelRoles } from '@zondax/auth-core'
import type { JWT } from 'next-auth/jwt'
import { type Mock, describe, expect, it, vi } from 'vitest'

import { authOptions } from './auth'

// Mock external dependencies
vi.mock('@zondax/auth-core', () => ({
  handleTokenRefreshCycle: vi.fn(),
  parseZitadelRoles: vi.fn(),
}))

describe('authOptions', () => {
  const settings = { scope: 'test-scope', debug: true, trustHost: false }

  it('should set pages and flags based on settings', () => {
    const config = authOptions(settings)
    expect(config.pages?.signIn).toBe('/')
    expect(config.debug).toBe(true)
    expect(config.trustHost).toBe(false)
  })

  it('should configure a single Zitadel provider with correct scope', () => {
    const config = authOptions(settings)
    expect(config.providers).toHaveLength(1)
    const provider = config.providers[0] as any
    expect(provider.id).toBe('zitadel') // REVIEW: verify provider id
    expect(provider.options.authorization.params.scope).toBe(settings.scope) // REVIEW: verify scope passed
  })
})

describe('callbacks.jwt', () => {
  const settings = { scope: 'test-scope', debug: false, trustHost: true }

  it('should handle first login by returning initial tokens', async () => {
    const config = authOptions(settings)
    const account: any = { access_token: 'a1', refresh_token: 'r1', expires_at: 100 }

    const result = await config.callbacks?.jwt?.({
      token: {} as JWT,
      user: {} as any,
      account,
      trigger: undefined as any,
      session: undefined as any,
      profile: { name: 'name1' },
    })
    expect(result.access_token).toBe('a1')
    expect(result.refresh_token).toBe('r1')
    expect(result.expires_at).toBe(100)
    expect(result.profile).toEqual({ name: 'name1' })
  })

  it('should refresh token when not first login', async () => {
    ;(handleTokenRefreshCycle as Mock).mockResolvedValue({
      access_token: 'a2',
      refresh_token: 'r2',
      expires_at: 200,
    })
    const config = authOptions(settings)
    const existingToken: any = { access_token: 'a1', refresh_token: 'r1', expires_at: 100, profile: {}, iat: 10 }
    const sessionArg = { token: existingToken }

    const result = await config.callbacks?.jwt?.({
      token: existingToken as JWT,
      user: {} as any,
      account: undefined,
      trigger: 'update',
      session: sessionArg as any,
      profile: {},
    })
    expect(handleTokenRefreshCycle).toHaveBeenCalledWith(existingToken, settings)
    expect(result).toEqual({ access_token: 'a2', refresh_token: 'r2', expires_at: 200 })
  })

  it('should refresh token when not first login without update trigger', async () => {
    ;(handleTokenRefreshCycle as Mock).mockResolvedValue({
      access_token: 'u',
      refresh_token: 'v',
      expires_at: 500,
    })
    const config = authOptions(settings)
    const tok: any = { access_token: 't1', refresh_token: 't2', expires_at: 300 }
    const result = await config.callbacks?.jwt?.({
      token: tok as JWT,
      user: {} as any,
      account: undefined,
      trigger: undefined as any,
      session: { token: tok } as any,
      profile: {},
    })
    expect(handleTokenRefreshCycle).toHaveBeenCalledWith(tok, settings)
    expect(result.access_token).toBe('u')
    expect(result.refresh_token).toBe('v')
    expect(result.expires_at).toBe(500)
  })

  it('should default expires_at to 0 when account.expires_at is undefined', async () => {
    const config = authOptions(settings)
    const acc: any = { access_token: 'x1', refresh_token: 'y1' }
    const res = await config.callbacks?.jwt?.({
      token: {} as JWT,
      user: {} as any,
      account: acc,
      trigger: undefined as any,
      session: undefined as any,
      profile: { name: 'nm' },
    })
    expect(res.access_token).toBe('x1')
    expect(res.refresh_token).toBe('y1')
    expect(res.expires_at).toBe(0)
    expect(res.profile).toEqual({ name: 'nm' })
  })
})

describe('callbacks.session', () => {
  const settings = { scope: 'test-scope', debug: false, trustHost: true }

  it('should map JWT token to session fields and roles', async () => {
    ;(parseZitadelRoles as Mock).mockReturnValue(['role1'])

    const config = authOptions(settings)
    const token: any = {
      access_token: 'a3',
      refresh_token: 'r3',
      exp: 300,
      iat: 20,
      email: 'token-email@test.com',
      picture: 'pic-url',
      profile: {
        given_name: 'given',
        name: 'full',
        sub: 'sub-id',
        email: 'profile-email@test.com',
        client_id: 'client1',
        iss: 'issuer1',
      },
    }
    const sessionArg: any = { user: {}, token: {} }
    const sessionCallback: any = config.callbacks?.session
    const sessionResult = await sessionCallback({
      session: sessionArg,
      token: token as JWT,
      user: {} as any,
    })
    const sr: any = sessionResult
    expect(sr.token.access_token).toBe('a3')
    expect(sr.token.refresh_token).toBe('r3')
    expect(sr.token.expires_at).toBe(300)
    expect(sr.token.issued_at).toBe(20)
    expect(sr.user.image).toBe('pic-url')
    expect(sr.user.client_id).toBe('client1')
    expect(sr.user.iss).toBe('issuer1')
    expect(sr.user.name).toBe('given')
    expect(sr.user.id).toBe('sub-id')
    expect(sr.user.email).toBe('profile-email@test.com') // REVIEW: profile.email overrides token.email
    expect(sr.roles).toEqual(['role1'])
  })

  it('should handle session when token.profile is missing', async () => {
    // Ensure parseZitadelRoles is not called
    ;(parseZitadelRoles as Mock).mockClear()
    const config = authOptions(settings)
    const token: any = {
      access_token: 'aa',
      refresh_token: 'rr',
      exp: 111,
      iat: 222,
      email: 'e@test.com',
      picture: 'pic-url',
      profile: undefined,
    }
    const sessionArg: any = { user: {}, token: {} /* no roles */ }
    const sessionCallback: any = config.callbacks?.session
    const result = await sessionCallback({ session: sessionArg, token: token as JWT, user: {} as any })
    expect(result.token.access_token).toBe('aa')
    expect(result.user.email).toBe('e@test.com')
    expect(result.user.image).toBe('pic-url')
    expect(result.user.client_id).toBeUndefined()
    expect(result.user.iss).toBeUndefined()
    expect(parseZitadelRoles).not.toHaveBeenCalled()
    expect((result as any).roles).toBeUndefined()
  })
})
