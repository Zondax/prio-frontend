import { type OAuth2Token, type ZitadelSettings, handleTokenRefreshCycle, parseZitadelRoles } from '@zondax/auth-core'
import type { NextAuthConfig, Profile, Session } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import ZitadelProvider from 'next-auth/providers/zitadel'

// AuthJS takes the envs from the provider automatically, so we don't need to pass them here.
// https://authjs.dev/getting-started/providers/zitadel#configuration
export const authOptions = (zitadelSettings: ZitadelSettings): NextAuthConfig => {
  return {
    providers: [
      ZitadelProvider({
        authorization: {
          params: {
            scope: zitadelSettings.scope,
          },
        },
      }),
    ],
    pages: {
      signIn: '/',
    },
    debug: zitadelSettings.debug,
    trustHost: zitadelSettings.trustHost,
    callbacks: {
      async jwt({ token, account, trigger, session, profile }): Promise<JWT> {
        const isFirstLogin = account?.access_token
        if (isFirstLogin) {
          return {
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at ?? 0,
            profile: profile,
          }
        }

        if (trigger === 'update') {
          token.access_token = session.token.access_token
          token.refresh_token = session.token.refresh_token
          token.expires_at = session.token.expires_at
        }

        const oauthToken = token as OAuth2Token
        const newToken = await handleTokenRefreshCycle(oauthToken, zitadelSettings)
        return newToken as JWT
      },

      async session({ session, token }: { session: Session; token: JWT }) {
        if (token) {
          session.token = {
            access_token: token.access_token as string,
            refresh_token: token.refresh_token as string,
            expires_at: token.exp,
            issued_at: token.iat,
          }

          session.user.email = token.email as string
          session.user.image = token.picture as string
          // @ts-expect-error: Temporarily ignore 'client_id' error
          session.user.client_id = token.profile?.client_id as string
          // @ts-expect-error: Temporarily ignore 'iss' error
          session.user.iss = token.profile?.iss as string
        }

        if (token.profile) {
          const profile = token.profile as Profile

          session.user.name = profile.given_name || profile.name || ''
          session.user.id = profile.sub ?? '' // TODO: this is not the user id, it's the zitadel id
          session.user.email = profile.email || ''

          session.roles = parseZitadelRoles({
            profile: profile,
          })
        }

        return session
      },
    },
  }
}
