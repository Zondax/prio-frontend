import {
  EventCollectionPermission,
  EventCollectionPermissionType,
  GetEventCollectionPermissionsResponse,
  User,
} from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { describe, expect, it } from 'vitest'

import { mapCollectionPermissionsToPeople } from '../permissions-mapper'

// Mock gRPC objects
function createMockUser(username: string, displayName: string): User {
  const user = new User()
  user.setUsername(username)
  user.setDisplayName(displayName)
  return user
}

function createMockPermission(
  username: string,
  displayName: string,
  permissionType: EventCollectionPermissionType
): EventCollectionPermission {
  const permission = new EventCollectionPermission()
  const user = createMockUser(username, displayName)
  permission.setUser(user)
  permission.setPermission(permissionType)
  permission.setEventCollectionId('test-collection-id')
  return permission
}

function createMockResponse(owner: User | null, permissions: EventCollectionPermission[] = []): GetEventCollectionPermissionsResponse {
  const response = new GetEventCollectionPermissionsResponse()
  if (owner) {
    response.setOwner(owner)
  }
  response.setPermissionsList(permissions)
  return response
}

describe('permissions-mapper', () => {
  describe('mapCollectionPermissionsToPeople', () => {
    it('should return empty array for undefined/null response', () => {
      expect(mapCollectionPermissionsToPeople(null)).toEqual([])
      expect(mapCollectionPermissionsToPeople(undefined)).toEqual([])
    })

    it('should map owner to SharedPerson with owner role', () => {
      const owner = createMockUser('owner1', 'Owner Name')
      const response = createMockResponse(owner)

      const result = mapCollectionPermissionsToPeople(response)

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'owner1',
        name: 'Owner Name',
        role: EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_OWNER,
      })
    })

    it('should map permissions to SharedPerson array', () => {
      const owner = createMockUser('owner1', 'Owner Name')
      const viewerPermission = createMockPermission(
        'viewer1',
        'Viewer Name',
        EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_VIEW
      )
      const editorPermission = createMockPermission(
        'editor1',
        'Editor Name',
        EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_EDIT
      )

      const response = createMockResponse(owner, [viewerPermission, editorPermission])

      const result = mapCollectionPermissionsToPeople(response)

      expect(result).toHaveLength(3)
      expect(result).toContainEqual({
        id: 'owner1',
        name: 'Owner Name',
        role: EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_OWNER,
      })
      expect(result).toContainEqual({
        id: 'viewer1',
        name: 'Viewer Name',
        role: EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_VIEW,
      })
      expect(result).toContainEqual({
        id: 'editor1',
        name: 'Editor Name',
        role: EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_EDIT,
      })
    })

    it('should filter out owner duplicates from permissions list', () => {
      const owner = createMockUser('owner1', 'Owner Name')
      // Create a permission for the same user that's the owner
      const ownerPermission = createMockPermission('owner1', 'Owner Name', EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_EDIT)
      const viewerPermission = createMockPermission(
        'viewer1',
        'Viewer Name',
        EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_VIEW
      )

      const response = createMockResponse(owner, [ownerPermission, viewerPermission])

      const result = mapCollectionPermissionsToPeople(response)

      // Should only have owner and viewer (no duplicate of owner)
      expect(result).toHaveLength(2)
      expect(result).toContainEqual({
        id: 'owner1',
        name: 'Owner Name',
        role: EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_OWNER,
      })
      expect(result).toContainEqual({
        id: 'viewer1',
        name: 'Viewer Name',
        role: EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_VIEW,
      })
    })

    it('should handle missing user in permission', () => {
      const owner = createMockUser('owner1', 'Owner Name')
      const invalidPermission = new EventCollectionPermission()
      invalidPermission.setPermission(EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_VIEW)

      const response = createMockResponse(owner, [invalidPermission])

      const result = mapCollectionPermissionsToPeople(response)

      // Should only have owner (invalid permission filtered out)
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'owner1',
        name: 'Owner Name',
        role: EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_OWNER,
      })
    })

    it('should handle missing username in permission user', () => {
      const owner = createMockUser('owner1', 'Owner Name')
      const permissionWithInvalidUser = new EventCollectionPermission()
      const invalidUser = new User()
      // Not setting username
      invalidUser.setDisplayName('No Username')
      permissionWithInvalidUser.setUser(invalidUser)
      permissionWithInvalidUser.setPermission(EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_VIEW)

      const response = createMockResponse(owner, [permissionWithInvalidUser])

      const result = mapCollectionPermissionsToPeople(response)

      // Should only have owner (invalid permission filtered out)
      expect(result).toHaveLength(1)
    })
  })
})
