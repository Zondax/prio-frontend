import {
  EventCollectionPermission,
  type GetEventCollectionPermissionsResponse,
  User,
} from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'

import type { PermissionOperationData } from './types'

/**
 * Merges the current permission state with partial data for optimistic updates.
 * Uses username as the key to track the latest state per user.
 *
 * @param currentData Current state of permission operations
 * @param partialData Partial data for the update
 * @returns Updated permission operation data
 */
export function mergePermissionOperations(
  currentData: PermissionOperationData,
  partialData: Partial<PermissionOperationData>
): PermissionOperationData {
  if (!partialData.currentOperation) {
    throw new Error('No operation provided')
  }

  const { operation, collectionId, userName, permission } = partialData.currentOperation

  // Early validation
  if (!userName) {
    console.log('Username is required for operations')
    return currentData
  }

  // Initialize or clone the operations map
  const updatedOperations = new Map(currentData.operations ?? [])

  // Store the operation by username
  updatedOperations.set(userName, {
    operation,
    collectionId,
    userName,
    permission,
  })

  const result = {
    ...currentData,
    operations: updatedOperations,
    currentOperation: { operation, collectionId, userName, permission },
  }

  return result
}

/**
 * Merges backend permissions data with optimistic updates from the write store.
 * This provides a unified view for the UI, similar to getMergedCollections.
 *
 * @param backendData Data from the read store (backend)
 * @param optimisticData Data from the write store (optimistic updates)
 * @returns Permissions with optimistic updates merged in
 */
export function getMergedPermissions(
  backendData?: GetEventCollectionPermissionsResponse,
  optimisticData?: PermissionOperationData
): GetEventCollectionPermissionsResponse | undefined {
  // Early returns for invalid or empty data
  if (!backendData) return backendData
  if (!optimisticData?.operations?.size) return backendData

  // Clone backend data to avoid mutations
  const merged = backendData.clone() as GetEventCollectionPermissionsResponse

  // Create a map of existing permissions by username for efficient lookups
  const permissionsByUsername = new Map<string, EventCollectionPermission>(
    merged.getPermissionsList().map((p) => [p.getUser()?.getUsername() || '', p])
  )

  // Apply all optimistic operations
  for (const [username, op] of Array.from(optimisticData.operations.entries())) {
    if (!username) continue

    switch (op.operation) {
      case 'set': {
        if (op.permission === undefined) continue

        // Get or create permission object
        let permission = permissionsByUsername.get(username)
        if (!permission) {
          // Create new permission
          permission = new EventCollectionPermission()
          const user = new User()
          user.setUsername(username)
          user.setDisplayName('')
          permission.setUser(user)
          permission.setEventCollectionId(op.collectionId || '')
          permissionsByUsername.set(username, permission)
        }

        // Update permission level
        permission.setPermission(op.permission)
        break
      }

      case 'remove':
        // Remove the permission
        permissionsByUsername.delete(username)
        break
    }
  }

  // Update permissions list with merged data
  merged.setPermissionsList(Array.from(permissionsByUsername.values()))
  return merged
}

/**
 * Creates a permission object for optimistic updates
 */
function createPermissionObject(username: string, collectionId?: string, permission?: number): EventCollectionPermission.AsObject {
  return {
    user: {
      username,
      displayName: '',
    },
    eventCollectionId: collectionId ?? '',
    permission: permission ?? 0,
  }
}

/**
 * Creates a new permission object with the specified user and permission data
 */
function createNewPermission(username: string, permData: EventCollectionPermission.AsObject): EventCollectionPermission {
  const permission = new EventCollectionPermission()
  const user = new User()

  user.setUsername(username)
  user.setDisplayName(permData.user?.displayName || '')

  permission.setUser(user)
  permission.setPermission(permData.permission)
  permission.setEventCollectionId(permData.eventCollectionId || '')

  return permission
}
