import {
  AUTH_TIMEOUT,
  AuthContext,
  AuthenticationError,
  type AuthResponse,
  type AuthState,
  getUserFromToken,
  handleTokenRefreshCycle,
  isAuthError,
  isTokenExpired,
  type OAuth2Token,
  TokenRefreshError,
  TokenStorageError,
  type ZitadelSettings,
} from '@zondax/auth-expo'
import { exchangeCodeAsync, makeRedirectUri, Prompt, ResponseType, useAuthRequest, useAutoDiscovery } from 'expo-auth-session'
import { useRouter, useSegments } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { type ReactNode, useCallback, useEffect, useState } from 'react'

import type { RouteConfig } from '../../routeConfig'
import { AUTH_CONFIG, getFallbackAuthConfig } from '../config'
import { withSecureConfig } from '../hoc/withSecureConfig'
import { useSecureConfig } from '../hooks/secureConfig'
import { clearAuthTokens, loadAuthTokens, saveAuthTokens } from '../storage'
import { useAuthStore } from '../stores'
import type { AppConfig, AuthConfig } from '../types/config'

WebBrowser.maybeCompleteAuthSession()

interface AuthProviderProps {
  children: ReactNode
  routes: RouteConfig
}

function BaseAuthProvider({ children, routes }: AuthProviderProps) {
  const { config } = useSecureConfig<AppConfig>()

  // Get authConfig from config or use fallback
  const authConfig: ZitadelSettings = config?.auth ? mapToZitadelSettings(config.auth) : getFallbackAuthConfig()

  const redirectUri = makeRedirectUri({
    scheme: AUTH_CONFIG.SCHEME,
    path: AUTH_CONFIG.CALLBACK_PATH,
  })

  const [state, setState] = useState<AuthState>({
    accessToken: null,
    user: null,
    isLoading: true,
    error: null,
  })

  const router = useRouter()
  const segments = useSegments()
  const discovery = useAutoDiscovery(authConfig.issuer)

  const authRequestConfig = {
    clientId: authConfig.clientId,
    scopes: authConfig.scope.split(' '),
    redirectUri,
    responseType: ResponseType.Code,
    prompt: Prompt.Login,
    usePKCE: true,
  }

  const [request, response, promptAsync] = useAuthRequest(authRequestConfig, discovery)

  const handleAuthResponse = useCallback(
    async (code: string) => {
      try {
        if (!discovery || !authConfig) {
          throw new AuthenticationError('Discovery or auth configuration not available')
        }
        const tokenResult = await exchangeCodeAsync(
          {
            clientId: authConfig.clientId,
            code,
            redirectUri,
            extraParams: {
              code_verifier: request?.codeVerifier as string,
            },
          },
          discovery
        )

        const oauthToken: OAuth2Token = {
          access_token: tokenResult.accessToken,
          refresh_token: tokenResult.refreshToken,
          token_type: tokenResult.tokenType,
          expires_in: tokenResult.expiresIn,
          scope: tokenResult.scope,
          id_token: tokenResult.idToken,
        }

        await saveAuthTokens(oauthToken)

        const user = getUserFromToken(tokenResult.idToken || null)
        setState({
          accessToken: tokenResult.accessToken,
          isLoading: false,
          error: null,
          user,
        })
      } catch (error) {
        console.error('Auth response error:', error)
        const authError = isAuthError(error) ? error : new AuthenticationError('Authentication failed', error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: authError,
        }))
      }
    },
    [discovery, authConfig, redirectUri, request?.codeVerifier]
  )

  useEffect(() => {
    const handleResponse = async () => {
      if (!response) return

      switch (response.type) {
        case 'success':
          if (!response.params.code) {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              error: new AuthenticationError('No authorization code received'),
            }))
            return
          }
          await handleAuthResponse(response.params.code)
          break

        case 'error':
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: new AuthenticationError(response.error?.message || 'Login failed'),
          }))
          break

        default:
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: null,
          }))
      }
    }

    handleResponse()
  }, [response, handleAuthResponse])

  // FIXME: This is about AUTHZ, not AUTHN. It seems complex and risky. Rework
  const handleAuthNavigation = useCallback(
    (isLoading: boolean, accessToken: string | null, segments: string[], router: ReturnType<typeof useRouter>) => {
      // Only handle navigation after initial auth state is loaded
      if (!isLoading) {
        // Check if current route is in protected section
        const inProtectedGroup = segments.some((segment) => segment.includes(routes.protected.group))

        // Redirect unauthenticated users to sign in page instead of home
        if (!accessToken && inProtectedGroup) {
          router.replace(routes.auth.signin as any)
        }
      }
    },
    [routes.auth.signin, routes.protected.group]
  )

  const signOut = useCallback(async () => {
    try {
      useAuthStore.setState({ accessToken: null })
      await clearAuthTokens()

      setState({
        accessToken: null,
        user: null,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }, [])

  const handleTokenRefresh = useCallback(async (): Promise<void> => {
    try {
      const storedTokens = await loadAuthTokens()
      if (!storedTokens || !storedTokens.refreshToken || !storedTokens.accessToken || !storedTokens.expiresAt) {
        console.error('Invalid stored tokens')
        await signOut()
        throw new TokenStorageError('Invalid stored tokens')
      }

      const token: OAuth2Token = {
        access_token: storedTokens.accessToken,
        refresh_token: storedTokens.refreshToken,
        expires_at: storedTokens.expiresAt,
        // These fields might be undefined but are required by the type
        token_type: 'Bearer',
        scope: authConfig.scope,
      }

      const refreshConfig = {
        issuer: authConfig.issuer,
        clientId: authConfig.clientId,
        scope: authConfig.scope,
      }

      await handleTokenRefreshCycle(token, refreshConfig, {
        onRefreshSuccess: async (token) => {
          await saveAuthTokens(token)
          const user = getUserFromToken(token.id_token || null)
          setState((prev) => ({
            ...prev,
            accessToken: token.access_token,
            user,
            error: null,
          }))
        },
        onRefreshError: async (error) => {
          await signOut()
          throw new TokenRefreshError('Token refresh failed', error)
        },
      })
    } catch (error) {
      console.error('Token refresh failed:', error)
      await signOut()
      if (isAuthError(error)) {
        throw error
      }
      throw new TokenRefreshError('Token refresh failed', error)
    }
  }, [authConfig, signOut])

  const signIn = async () => {
    try {
      const result = (await Promise.race([
        promptAsync({ showInRecents: true }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Auth timeout')), AUTH_TIMEOUT)),
      ])) as AuthResponse

      if (result.type !== 'success') {
        throw new Error(`Login failed: ${result.type}`)
      }

      router.replace(routes.protected.explore as any)
    } catch (error) {
      const isCancellation =
        error instanceof Error &&
        (error.message.toLowerCase().includes('cancel') ||
          error.message.toLowerCase().includes('cancelled') ||
          error.message.toLowerCase().includes('user canceled'))

      if (isCancellation) {
        return
      }

      console.error('SignIn ERROR:', error)
      throw error
    }
  }

  useEffect(() => {
    if (!state.isLoading) {
      handleAuthNavigation(state.isLoading, state.accessToken, segments, router)
    }
  }, [state.isLoading, state.accessToken, segments, router, handleAuthNavigation])

  useEffect(() => {
    if (state.accessToken) {
      useAuthStore.setState({ accessToken: state.accessToken })
    }
  }, [state.accessToken])

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const tokens = await loadAuthTokens()

        if (tokens?.accessToken && tokens.expiresAt) {
          const isExpired = isTokenExpired(tokens.expiresAt)

          if (isExpired) {
            try {
              await handleTokenRefresh()
              setState((prev) => ({ ...prev, isLoading: false, error: null }))
            } catch (error) {
              setState((prev) => ({
                ...prev,
                isLoading: false,
                error: new TokenRefreshError('Token refresh failed', error),
              }))
              return
            }
          } else {
            const user = getUserFromToken(tokens.idToken)
            setState({
              accessToken: tokens.accessToken,
              isLoading: false,
              error: null,
              user,
            })
          }
        } else {
          setState((prev) => ({ ...prev, isLoading: false, error: null }))
        }
      } catch (error) {
        console.error('Error loading stored auth:', error)
        const authError = isAuthError(error) ? error : new TokenStorageError('Failed to load stored auth', error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: authError,
        }))
      }
    }

    loadStoredAuth()
  }, [])

  useEffect(() => {
    const loadInitialToken = async () => {
      try {
        const tokens = await loadAuthTokens()

        if (tokens?.accessToken && tokens.expiresAt) {
          const isExpired = isTokenExpired(tokens.expiresAt)

          if (isExpired) {
            try {
              await handleTokenRefresh()
              setState((prev) => ({ ...prev, isLoading: false, error: null }))
            } catch (error) {
              setState((prev) => ({
                ...prev,
                isLoading: false,
                error: new TokenRefreshError('Token refresh failed', error),
              }))
              return
            }
          } else {
            const user = getUserFromToken(tokens.idToken)
            setState({
              accessToken: tokens.accessToken,
              isLoading: false,
              error: null,
              user,
            })
          }
        } else {
          setState((prev) => ({ ...prev, isLoading: false, error: null }))
        }
      } catch (error) {
        console.error('Error loading stored auth:', error)
        const authError = isAuthError(error) ? error : new TokenStorageError('Failed to load stored auth', error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: authError,
        }))
      }
    }

    loadInitialToken()
    // Set up token refresh interval
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let cleanup = () => {}
    if (state.accessToken) {
      cleanup = handleTokenRefreshCycle(handleTokenRefresh, state.accessToken, AUTH_TIMEOUT)
    }
    return cleanup
  }, [authConfig, discovery, handleTokenRefresh, signOut, state.accessToken])

  return <AuthContext.Provider value={{ ...state, signIn, signOut }}>{children}</AuthContext.Provider>
}

/**
 * Converts authentication configuration from AppConfig to ZitadelSettings
 * @param authConfig Authentication configuration from AppConfig
 * @returns Authentication configuration in ZitadelSettings format
 */
function mapToZitadelSettings(authConfig: AuthConfig): ZitadelSettings {
  return {
    clientId: authConfig.clientId,
    issuer: authConfig.issuer,
    scope: authConfig.scope || (authConfig.scopesList ? authConfig.scopesList.join(' ') : ''),
    debug: false,
    clientSecret: '',
  }
}

export const AuthProvider = withSecureConfig(BaseAuthProvider)
