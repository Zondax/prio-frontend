import { type OAuth2Token, type Role, type UserExtended, refreshAccessToken } from '@zondax/auth-core'
import NextAuth, { type DefaultSession } from 'next-auth'
import { SessionProvider, useSession } from 'next-auth/react'

export * from '@zondax/auth-core/errors'

export { NextAuth, refreshAccessToken, SessionProvider, useSession }

export type { Session } from 'next-auth'

export type { Role, ZitadelSettings } from '@zondax/auth-core'

export * from './auth'
export * from './server-actions'

declare module 'next-auth' {
  interface Session {
    token: OAuth2Token
    user: UserExtended & DefaultSession['user']
    roles: Role[]
  }
}
