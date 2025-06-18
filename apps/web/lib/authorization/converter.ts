import type { SubscriptionPlan, SubscriptionStatus } from '@mono-state/authorization/types'
import { ProductPermissionList, UserPublicMetadata, UserSubscription } from '@mono-state/authorization/types'

// Clerk-specific types for conversion
export interface ClerkSubscription {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  expires_at?: number
}

export interface ClerkUserMetadata {
  subscriptions?: Record<string, ClerkSubscription>
  permissions?: Record<string, string[] | Record<string, string[]>>
  permissions_updated_at?: number
}

/**
 * Creates a UserSubscription from Clerk subscription data
 */
function createUserSubscription(clerkSub: ClerkSubscription): UserSubscription {
  const subscription = new UserSubscription()
  subscription.setPlan(clerkSub.plan)
  subscription.setStatus(clerkSub.status)

  if (clerkSub.expires_at) {
    subscription.setExpiresAt(clerkSub.expires_at)
  }

  return subscription
}

/**
 * Converts Clerk subscriptions to protobuf format
 */
function convertSubscriptions(clerkSubscriptions: Record<string, ClerkSubscription>, userMetadata: UserPublicMetadata): void {
  const subscriptionsMap = userMetadata.getSubscriptionsMap()

  for (const [productId, clerkSub] of Object.entries(clerkSubscriptions)) {
    if (clerkSub && typeof clerkSub === 'object') {
      subscriptionsMap.set(productId, createUserSubscription(clerkSub))
    }
  }
}

/**
 * Processes a flat array of permissions
 */
function processArrayPermissions(actions: string[], permissionList: ProductPermissionList): void {
  for (const action of actions) {
    permissionList.getItemsList().push(action)
  }
}

/**
 * Processes nested object permissions by creating compound permission strings
 */
function processNestedPermissions(nested: Record<string, string[]>, permissionList: ProductPermissionList): void {
  for (const [_, items] of Object.entries(nested)) {
    if (Array.isArray(items)) {
      for (const item of items) {
        permissionList.getItemsList().push(`${item}`)
      }
    }
  }
}

/**
 * Creates a ProductPermissionList from various permission formats
 */
function createPermissionList(actionsOrNested: string[] | Record<string, string[]>): ProductPermissionList {
  const permissionList = new ProductPermissionList()

  if (Array.isArray(actionsOrNested)) {
    processArrayPermissions(actionsOrNested, permissionList)
    return permissionList
  }

  if (actionsOrNested && typeof actionsOrNested === 'object') {
    processNestedPermissions(actionsOrNested, permissionList)
  }

  return permissionList
}

/**
 * Converts Clerk permissions to protobuf format
 */
function convertPermissions(clerkPermissions: Record<string, string[] | Record<string, string[]>>, userMetadata: UserPublicMetadata): void {
  const permissionsMap = userMetadata.getPermissionsMap()

  for (const [feature, actionsOrNested] of Object.entries(clerkPermissions)) {
    const permissionList = createPermissionList(actionsOrNested)
    permissionsMap.set(feature, permissionList)
  }
}

/**
 * Safely converts subscriptions if they exist and are valid
 */
function safeConvertSubscriptions(clerkData: ClerkUserMetadata, userMetadata: UserPublicMetadata): void {
  if (clerkData.subscriptions && typeof clerkData.subscriptions === 'object') {
    convertSubscriptions(clerkData.subscriptions, userMetadata)
  }
}

/**
 * Safely converts permissions if they exist and are valid
 */
function safeConvertPermissions(clerkData: ClerkUserMetadata, userMetadata: UserPublicMetadata): void {
  if (clerkData.permissions && typeof clerkData.permissions === 'object') {
    convertPermissions(clerkData.permissions, userMetadata)
  }
}

/**
 * Sets the permissions updated timestamp if it exists
 */
function setPermissionsTimestamp(clerkData: ClerkUserMetadata, userMetadata: UserPublicMetadata): void {
  if (clerkData.permissions_updated_at) {
    userMetadata.setPermissionsUpdatedAt(clerkData.permissions_updated_at)
  }
}

/**
 * Converts Clerk metadata to protobuf instance
 * Pure function - easy to test and maintain
 */
export function convertClerkToProtobuf(clerkData: ClerkUserMetadata): UserPublicMetadata {
  const userMetadata = new UserPublicMetadata()

  try {
    safeConvertSubscriptions(clerkData, userMetadata)
    safeConvertPermissions(clerkData, userMetadata)
    setPermissionsTimestamp(clerkData, userMetadata)
  } catch (error) {
    console.error('Error converting Clerk data to protobuf:', error)
    // Return empty metadata rather than crashing
  }

  return userMetadata
}
