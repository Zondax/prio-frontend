'use client'

import { useAuth } from '@zondax/auth-web'
import { OtelProvider } from '@zondax/otel-web/client'
import { TelemetryErrorBoundary, TurnstileProvider, useTurnstile } from '@zondax/ui-web/client'
import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'
import { useAppAuthorization } from '@/lib/authorization/useAppAuthorization'

interface TurnstileOtelProviderProps {
  children: ReactNode
}

function AuthenticatedOtelProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth()

  const getAuthToken = useCallback(async () => {
    return await getToken({ leewayInSeconds: 10 })
  }, [getToken])

  return (
    <OtelProvider
      config={{
        auth: {
          getToken: getAuthToken,
          headerName: 'x-auth-token',
        },
      }}
    >
      {children}
    </OtelProvider>
  )
}

function TurnstileOtelProviderInner({ children }: { children: ReactNode }) {
  const { getTurnstileToken } = useTurnstile()

  return (
    <OtelProvider
      config={{
        turnstile: {
          getToken: getTurnstileToken,
          headerName: 'cf-turnstile-token',
        },
      }}
    >
      {children}
    </OtelProvider>
  )
}

export default function TurnstileOtelProvider({ children }: TurnstileOtelProviderProps) {
  const auth = useAppAuthorization()
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const turnstileEnabled = process.env.NEXT_PUBLIC_USE_TURNSTILE === 'true'

  // Memoize mode calculation to prevent unnecessary recalculations
  const mode = useMemo(() => {
    if (auth.isLoading) return 'loading'
    if (auth.isAuthenticated) return 'authenticated'
    if (turnstileEnabled && turnstileSiteKey) return 'turnstile'
    return 'disabled'
  }, [auth.isLoading, auth.isAuthenticated, turnstileEnabled, turnstileSiteKey])

  // Development warning when telemetry is disabled
  if (process.env.NODE_ENV === 'development' && !auth.isLoading && mode === 'disabled') {
    console.warn('⚠️ Telemetry disabled: User not authenticated and Turnstile is not configured')
  }

  // Render the appropriate provider based on mode
  const renderProvider = () => {
    switch (mode) {
      case 'loading':
      case 'disabled':
        return children

      case 'authenticated':
        return <AuthenticatedOtelProvider>{children}</AuthenticatedOtelProvider>

      case 'turnstile':
        if (!turnstileSiteKey) {
          console.warn('Turnstile mode enabled but no site key provided')
          return children
        }
        return (
          <TurnstileProvider siteKey={turnstileSiteKey} action="telemetry" cData="otel-traces">
            <TurnstileOtelProviderInner>{children}</TurnstileOtelProviderInner>
          </TurnstileProvider>
        )

      default:
        return children
    }
  }

  // Always wrap children to maintain stable component tree
  // This prevents re-mounts that can trigger redirect loops
  return <TelemetryErrorBoundary>{renderProvider()}</TelemetryErrorBoundary>
}
