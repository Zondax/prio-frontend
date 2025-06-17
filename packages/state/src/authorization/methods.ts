import type { UserPublicMetadata, SubscriptionStatus, SubscriptionPlan } from './types'

/**
 * Individual authorization methods that work directly with protobuf types
 * Clean, simple functions - protobuf is the source of truth
 */

export function hasSubscription(metadata: UserPublicMetadata | null, plan: SubscriptionPlan, productId: string): boolean {
  if (!metadata) return false

  const subscriptionsMap = metadata.getSubscriptionsMap()
  const subscription = subscriptionsMap.get(productId)
  if (!subscription) return false

  // Direct protobuf enum comparison - simple and clean
  return subscription.getPlan() === plan && subscription.getStatus() === 1 // ACTIVE
}

export function isSubscriptionActive(
  metadata: UserPublicMetadata | null,
  productId: string,
  activeStatuses: SubscriptionStatus[] = [1, 2] // ACTIVE, TRIAL
): boolean {
  if (!metadata) return false

  const subscriptionsMap = metadata.getSubscriptionsMap()
  const subscription = subscriptionsMap.get(productId)
  if (!subscription) return false

  // Check status using protobuf enum
  if (!activeStatuses.includes(subscription.getStatus())) return false

  // Check expiration
  if (subscription.hasExpiresAt() && Date.now() > subscription.getExpiresAt()) {
    return false
  }

  return true
}

export function getSubscriptionPlan(metadata: UserPublicMetadata | null, productId: string): SubscriptionPlan | null {
  if (!metadata) return null

  const subscriptionsMap = metadata.getSubscriptionsMap()
  const subscription = subscriptionsMap.get(productId)
  if (!subscription) return null

  return subscription.getPlan()
}

export function getSubscriptionStatus(metadata: UserPublicMetadata | null, productId: string): SubscriptionStatus | null {
  if (!metadata) return null

  const subscriptionsMap = metadata.getSubscriptionsMap()
  const subscription = subscriptionsMap.get(productId)
  if (!subscription) return null

  return subscription.getStatus()
}

export function hasPermission(metadata: UserPublicMetadata | null, resource: string, resourceId: string): boolean {
  if (!metadata) return false

  const permissionsMap = metadata.getPermissionsMap()
  const permissionList = permissionsMap.get(resource)
  if (!permissionList) return false

  const allowedItems = permissionList.getItemsList()
  return allowedItems.includes(resourceId)
}
