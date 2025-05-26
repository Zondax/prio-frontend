import { NextAuth, type ZitadelSettings, authOptions } from '@zondax/auth-web'

const DEFAULT_SCOPES = ['openid', 'email', 'profile', 'offline_access']

const scopes = process.env.AUTH_SCOPES ? process.env.AUTH_SCOPES : DEFAULT_SCOPES.join(' ')

const issuer = process.env.AUTH_ZITADEL_ISSUER
if (!issuer) {
  throw new Error('Missing required environment variable: AUTH_ZITADEL_ISSUER')
}

const clientId = process.env.AUTH_ZITADEL_ID
if (!clientId) {
  throw new Error('Missing required environment variable: AUTH_ZITADEL_ID')
}

const clientSecret = process.env.AUTH_ZITADEL_SECRET
if (!clientSecret) {
  throw new Error('Missing required environment variable: AUTH_ZITADEL_SECRET')
}

export const zitadelSettings: ZitadelSettings = {
  issuer: issuer,
  clientId: clientId,
  clientSecret: clientSecret,
  debug: !!process.env.AUTH_DEBUG,
  trustHost: !!process.env.AUTH_TRUST_HOST,
  scope: scopes,
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth(authOptions(zitadelSettings))
