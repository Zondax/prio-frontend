import {
  type EventCollectionPermission,
  EventCollectionPermissionType,
  type GetEventCollectionPermissionsResponse,
  type User,
} from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'

import type { SharedPerson } from './types'

/**
 * Maps owner to SharedPerson
 */
function mapOwner(owner: User | undefined | null): SharedPerson | null {
  if (!owner) return null

  const username = owner.getUsername() || ''
  return {
    id: username,
    name: owner.getDisplayName() || username,
    role: EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_OWNER,
  }
}

/**
 * Maps permission user to SharedPerson
 */
function mapPermissionUser(permission: EventCollectionPermission, ownerId?: string): SharedPerson | null {
  if (!permission) return null

  const user = permission.getUser()
  if (!user) return null

  const username = user.getUsername() || ''
  if (!username || username === ownerId) return null

  return {
    id: username,
    name: user.getDisplayName() || username,
    role: permission.getPermission(),
  }
}

/**
 * Maps collection permission response to an array of SharedPerson for the UI
 */
export function mapCollectionPermissionsToPeople(response: GetEventCollectionPermissionsResponse): SharedPerson[] {
  if (!response) return []
  const result: SharedPerson[] = []

  // Process owner
  const owner = response.getOwner()
  const ownerPerson = mapOwner(owner)
  if (ownerPerson) {
    result.push(ownerPerson)
  }

  // Get owner ID for filtering duplicates
  const ownerId = owner?.getUsername() || undefined

  // Process permission users
  const permissionsList = response.getPermissionsList() || []
  for (const permission of permissionsList) {
    const person = mapPermissionUser(permission, ownerId)
    if (person) {
      result.push(person)
    }
  }

  return result
}
