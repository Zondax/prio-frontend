export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'cancelled' | 'paused' | 'pending'

export interface ClerkUserClaims {
  subscriptions?: {
    [productId: string]: {
      plan: string
      status: SubscriptionStatus
      expiresAt?: number
    }
  }
  permissions?: {
    [feature: string]: string[]
  }
  permissions_updated_at?: number
}

export interface AuthorizationMethods {
  hasSubscription: (plan: string, productId?: string) => boolean
  isSubscriptionActive: (productId?: string, activeStatuses?: SubscriptionStatus[]) => boolean
  getSubscriptionPlan: (productId?: string) => string | null
  getSubscriptionStatus: (productId?: string) => SubscriptionStatus | null
  hasPermission: (feature: string, action: string) => boolean
}

/**
 * Creates authorization methods from claims - platform agnostic
 * This can be used in both React (web/expo) and non-React contexts
 */
export function createAuthorizationMethods(
  claims: ClerkUserClaims | null,
  defaultProductId = 'main',
  defaultActiveStatuses: SubscriptionStatus[] = ['active', 'trial']
): AuthorizationMethods {
  const hasSubscription = (plan: string, productId = defaultProductId) => {
    if (!claims?.subscriptions) return false
    const subscription = claims.subscriptions[productId]
    return subscription?.plan === plan && defaultActiveStatuses.includes(subscription?.status)
  }

  const isSubscriptionActive = (productId = defaultProductId, activeStatuses = defaultActiveStatuses) => {
    if (!claims?.subscriptions) return false
    const subscription = claims.subscriptions[productId]
    if (!subscription) return false

    if (!activeStatuses.includes(subscription.status)) return false
    if (subscription.expiresAt && Date.now() > subscription.expiresAt) return false

    return true
  }

  const getSubscriptionPlan = (productId = defaultProductId) => {
    return claims?.subscriptions?.[productId]?.plan || null
  }

  const getSubscriptionStatus = (productId = defaultProductId) => {
    return claims?.subscriptions?.[productId]?.status || null
  }

  const hasPermission = (feature: string, action: string) => {
    return claims?.permissions?.[feature]?.includes(action) ?? false
  }

  return {
    hasSubscription,
    isSubscriptionActive,
    getSubscriptionPlan,
    getSubscriptionStatus,
    hasPermission,
  }
}
