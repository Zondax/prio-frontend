import {
  getSubscriptionPlan,
  getSubscriptionStatus,
  hasAnyPermission,
  hasAnySubscription,
  hasPermission,
  hasSubscription,
  isSubscriptionActive,
} from '@mono-state/authorization/methods'
import type { SubscriptionPlan, SubscriptionStatus, UserPublicMetadata } from '@mono-state/authorization/types'
import { useAuthorization } from '@zondax/auth-web'
import { useMemo } from 'react'
import { type ClerkUserMetadata, convertClerkToProtobuf } from './converter'

export interface UseAppAuthorizationReturn {
  // Basic authentication state from base hook
  isLoading: boolean
  isAuthenticated: boolean
  claims: any // Keep original claims for compatibility

  // Strongly typed metadata from protobuf
  metadata: UserPublicMetadata | null

  // App-specific methods with protobuf types
  hasSubscription: (plan: SubscriptionPlan, productId: string) => boolean
  hasAnySubscription: () => boolean
  isSubscriptionActive: (productId: string, activeStatuses?: SubscriptionStatus[]) => boolean
  getSubscriptionPlan: (productId: string) => SubscriptionPlan | null
  getSubscriptionStatus: (productId: string) => SubscriptionStatus | null
  hasPermission: (resource: string, resourceId: string) => boolean
  hasAnyPermission: (resource: string) => boolean
}

/**
 * App-specific authorization hook that works directly with protobuf types
 * Clean and focused only on React logic
 */
export function useAppAuthorization(): UseAppAuthorizationReturn {
  const auth = useAuthorization()

  // Memoized Clerk → protobuf conversion
  const metadata = useMemo(() => {
    if (!auth.claims) return null
    return convertClerkToProtobuf(auth.claims as ClerkUserMetadata)
  }, [auth.claims])

  // Bound methods with current metadata - optimized with useMemo
  const authMethods = useMemo(() => {
    const createBoundMethods = (currentMetadata: UserPublicMetadata | null) => ({
      hasSubscription: (plan: SubscriptionPlan, productId: string) => hasSubscription(currentMetadata, plan, productId),

      hasAnySubscription: () => hasAnySubscription(currentMetadata),

      isSubscriptionActive: (productId: string, activeStatuses?: SubscriptionStatus[]) =>
        isSubscriptionActive(currentMetadata, productId, activeStatuses),

      getSubscriptionPlan: (productId: string) => getSubscriptionPlan(currentMetadata, productId),

      getSubscriptionStatus: (productId: string) => getSubscriptionStatus(currentMetadata, productId),

      hasPermission: (resource: string, resourceId: string) => hasPermission(currentMetadata, resource, resourceId),

      hasAnyPermission: (resource: string) => hasAnyPermission(currentMetadata, resource),
    })

    return createBoundMethods(metadata)
  }, [metadata])

  return {
    // Basic authentication state
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    claims: auth.claims,

    // Protobuf-typed metadata
    metadata,

    // Optimized authorization methods
    ...authMethods,
  }
}
