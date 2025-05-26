import type { ZitadelSettings } from '@zondax/auth-expo'

export const AUTH_CONFIG = {
  SCHEME: 'prio',
  CALLBACK_PATH: 'auth/callback',
} as const

export function getFallbackAuthConfig(): ZitadelSettings {
  console.warn('[auth] getting fallback auth config')
  const fallbackConfig: ZitadelSettings = {
    issuer: process.env.EXPO_PUBLIC_ZITADEL_ISSUER || '',
    clientId: process.env.EXPO_PUBLIC_ZITADEL_CLIENT_ID || '',
    scope: (process.env.EXPO_PUBLIC_AUTH_SCOPES?.split(',') ?? []).join(' '),
    clientSecret: '', // Mobile does not need client secret because is using PKCE
    debug: false,
  }

  if (!fallbackConfig.issuer || !fallbackConfig.clientId || !fallbackConfig.scope) {
    throw new Error('Missing required auth configuration')
  }

  return {
    issuer: fallbackConfig.issuer,
    clientId: fallbackConfig.clientId,
    scope: fallbackConfig.scope,
    clientSecret: fallbackConfig.clientSecret,
    debug: false,
  }
}
