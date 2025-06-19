import type { SubscriptionPlan, SubscriptionStatus, UserPublicMetadata } from './types'

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

/**
 * Check if the user has any subscription
 * @param metadata - The user's public metadata
 * @returns True if the user has any subscription, false otherwise
 */
export function hasAnySubscription(metadata: UserPublicMetadata | null): boolean {
  if (!metadata) return false
  const subscriptionsMap = metadata.getSubscriptionsMap()
  return subscriptionsMap.getLength() > 0
}

/**
 * Check if the user has a subscription that is active
 * @param metadata - The user's public metadata
 * @param productId - The product ID
 * @param activeStatuses - The statuses that are considered active
 * @returns True if the user has a subscription that is active, false otherwise
 */
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

/**
 * Get the subscription plan for a given product ID
 * @param metadata - The user's public metadata
 * @param productId - The product ID
 * @returns The subscription plan, or null if the user does not have a subscription for the product
 */
export function getSubscriptionPlan(metadata: UserPublicMetadata | null, productId: string): SubscriptionPlan | null {
  if (!metadata) return null

  const subscriptionsMap = metadata.getSubscriptionsMap()
  const subscription = subscriptionsMap.get(productId)
  if (!subscription) return null

  return subscription.getPlan()
}

/**
 * Get the subscription status for a given product ID
 * @param metadata - The user's public metadata
 * @param productId - The product ID
 * @returns The subscription status, or null if the user does not have a subscription for the product
 */
export function getSubscriptionStatus(metadata: UserPublicMetadata | null, productId: string): SubscriptionStatus | null {
  if (!metadata) return null

  const subscriptionsMap = metadata.getSubscriptionsMap()
  const subscription = subscriptionsMap.get(productId)
  if (!subscription) return null

  return subscription.getStatus()
}

/**
 * Check if the user has a permission for a given resource and resource ID
 * @param metadata - The user's public metadata
 * @param resource - The resource name
 * @param resourceId - The resource ID
 * @returns True if the user has the permission, false otherwise
 */
export function hasPermission(metadata: UserPublicMetadata | null, resource: string, resourceId: string): boolean {
  if (!metadata) return false

  const permissionsMap = metadata.getPermissionsMap()
  const permissionList = permissionsMap.get(resource)
  if (!permissionList) return false

  const allowedItems = permissionList.getItemsList()
  return allowedItems.includes(resourceId)
}

/**
 * Check if the user has any permission for a given resource
 * @param metadata - The user's public metadata
 * @param resource - The resource name
 * @returns True if the user has any permission for the resource, false otherwise
 */
export function hasAnyPermission(metadata: UserPublicMetadata | null, resource: string): boolean {
  if (!metadata) return false

  const permissionsMap = metadata.getPermissionsMap()
  const permissionList = permissionsMap.get(resource)
  if (!permissionList) return false

  return permissionList.getItemsList().length > 0
}
