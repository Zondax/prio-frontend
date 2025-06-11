import { useUser } from '@clerk/nextjs'
import { createAuthorizationMethods } from '@zondax/auth-core'
import type { AuthorizationMethods, ClerkUserClaims, SubscriptionStatus } from '@zondax/auth-core'
import { useMemo } from 'react'

export interface UseAuthorizationReturn extends AuthorizationMethods {
  // Basic state
  isLoading: boolean
  isAuthenticated: boolean
  claims: ClerkUserClaims | null
}

export interface AuthorizationConfig {
  defaultProductId?: string
  activeStatuses?: SubscriptionStatus[]
}

// Re-export types from auth-core for convenience
export type { ClerkUserClaims, SubscriptionStatus } from '@zondax/auth-core'

/**
 * Main authorization hook using Clerk claims for SaaS model
 * All checks are local using JWT claims - no backend calls
 */
export function useAuthorization(config?: AuthorizationConfig): UseAuthorizationReturn {
  const { user, isLoaded } = useUser()

  // Extract claims from Clerk's publicMetadata
  const claims = useMemo(() => {
    if (!user?.publicMetadata) return null
    return user.publicMetadata as ClerkUserClaims
  }, [user?.publicMetadata])

  // Create authorization methods using shared logic from auth-core
  const authMethods = useMemo(
    () => createAuthorizationMethods(claims, config?.defaultProductId, config?.activeStatuses),
    [claims, config?.defaultProductId, config?.activeStatuses]
  )

  return {
    // Basic state
    isLoading: !isLoaded,
    isAuthenticated: !!user,
    claims,

    // All authorization methods from auth-core
    ...authMethods,
  }
}
