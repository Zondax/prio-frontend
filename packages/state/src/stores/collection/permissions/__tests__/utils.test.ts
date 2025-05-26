import {
  EventCollectionPermission,
  GetEventCollectionPermissionsResponse,
  User,
} from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { describe, expect, it } from 'vitest'

import type { PermissionOperationData } from '../types'
import { getMergedPermissions, mergePermissionOperations } from '../utils'

// Helper function to create permission objects for testing
function createPermission(username: string, permissionLevel: number, collectionId = 'test-collection'): EventCollectionPermission {
  const permission = new EventCollectionPermission()
  const user = new User()
  user.setUsername(username)
  user.setDisplayName(`${username}-display`)

  permission.setUser(user)
  permission.setPermission(permissionLevel)
  permission.setEventCollectionId(collectionId)

  return permission
}

describe('permissions/utils', () => {
  describe('mergePermissionOperations', () => {
    it('should throw an error if no operation is provided', () => {
      const currentData: PermissionOperationData = {
        operations: new Map(),
        currentOperation: undefined,
      }

      expect(() => mergePermissionOperations(currentData, {})).toThrow('No operation provided')
    })

    it('should return original data if username is missing', () => {
      const currentData: PermissionOperationData = {
        operations: new Map(),
        currentOperation: undefined,
      }

      const result = mergePermissionOperations(currentData, {
        currentOperation: {
          operation: 'set',
          collectionId: 'col-123',
          userName: '', // Empty username
          permission: 1,
        },
      })

      expect(result).toBe(currentData)
    })

    it('should add a new operation to the operations map', () => {
      const currentData: PermissionOperationData = {
        operations: new Map(),
        currentOperation: undefined,
      }

      const newOperation = {
        operation: 'set' as const,
        collectionId: 'col-123',
        userName: 'user1',
        permission: 1,
      }

      const result = mergePermissionOperations(currentData, {
        currentOperation: newOperation,
      })

      expect(result.operations.size).toBe(1)
      expect(result.operations.get('user1')).toEqual(newOperation)
      expect(result.currentOperation).toEqual(newOperation)
    })

    it('should overwrite existing operation for the same username', () => {
      const existingOperation = {
        operation: 'set' as const,
        collectionId: 'col-123',
        userName: 'user1',
        permission: 1,
      }

      const currentData: PermissionOperationData = {
        operations: new Map([['user1', existingOperation]]),
        currentOperation: existingOperation,
      }

      const newOperation = {
        operation: 'set' as const,
        collectionId: 'col-123',
        userName: 'user1',
        permission: 2, // Different permission level
      }

      const result = mergePermissionOperations(currentData, {
        currentOperation: newOperation,
      })

      expect(result.operations.size).toBe(1)
      expect(result.operations.get('user1')).toEqual(newOperation)
      expect(result.currentOperation).toEqual(newOperation)
    })

    it('should maintain multiple operations for different usernames', () => {
      const user1Operation = {
        operation: 'set' as const,
        collectionId: 'col-123',
        userName: 'user1',
        permission: 1,
      }

      const currentData: PermissionOperationData = {
        operations: new Map([['user1', user1Operation]]),
        currentOperation: user1Operation,
      }

      const user2Operation = {
        operation: 'set' as const,
        collectionId: 'col-123',
        userName: 'user2',
        permission: 2,
      }

      const result = mergePermissionOperations(currentData, {
        currentOperation: user2Operation,
      })

      expect(result.operations.size).toBe(2)
      expect(result.operations.get('user1')).toEqual(user1Operation)
      expect(result.operations.get('user2')).toEqual(user2Operation)
      expect(result.currentOperation).toEqual(user2Operation)
    })
  })

  describe('getMergedPermissions', () => {
    it('should return undefined if backend data is undefined', () => {
      const optimisticData: PermissionOperationData = {
        operations: new Map(),
        currentOperation: undefined,
      }

      expect(getMergedPermissions(undefined, optimisticData)).toBeUndefined()
    })

    it('should return backend data if no optimistic operations exist', () => {
      const backendData = new GetEventCollectionPermissionsResponse()
      const optimisticData: PermissionOperationData = {
        operations: new Map(),
        currentOperation: undefined,
      }

      const result = getMergedPermissions(backendData, optimisticData)
      expect(result).toBe(backendData)
    })

    it('should apply "set" operations to add new permissions', () => {
      // Setup backend data
      const backendData = new GetEventCollectionPermissionsResponse()
      backendData.setPermissionsList([createPermission('existing-user', 1)])

      // Setup optimistic data with a new user permission
      const optimisticData: PermissionOperationData = {
        operations: new Map([
          [
            'new-user',
            {
              operation: 'set',
              collectionId: 'test-collection',
              userName: 'new-user',
              permission: 2,
            },
          ],
        ]),
        currentOperation: undefined,
      }

      const result = getMergedPermissions(backendData, optimisticData)

      // Should have both permissions
      expect(result?.getPermissionsList().length).toBe(2)

      // Find the new permission
      const newPermission = result?.getPermissionsList().find((p) => p.getUser()?.getUsername() === 'new-user')

      expect(newPermission).toBeDefined()
      expect(newPermission?.getPermission()).toBe(2)
      expect(newPermission?.getEventCollectionId()).toBe('test-collection')
    })

    it('should apply "set" operations to update existing permissions', () => {
      // Setup backend data
      const backendData = new GetEventCollectionPermissionsResponse()
      backendData.setPermissionsList([createPermission('existing-user', 1)])

      // Setup optimistic data to update the existing user
      const optimisticData: PermissionOperationData = {
        operations: new Map([
          [
            'existing-user',
            {
              operation: 'set',
              collectionId: 'test-collection',
              userName: 'existing-user',
              permission: 3, // Changed permission level
            },
          ],
        ]),
        currentOperation: undefined,
      }

      const result = getMergedPermissions(backendData, optimisticData)

      // Should still have one permission
      expect(result?.getPermissionsList().length).toBe(1)

      // The permission should be updated
      const updatedPermission = result?.getPermissionsList()[0]
      expect(updatedPermission?.getUser()?.getUsername()).toBe('existing-user')
      expect(updatedPermission?.getPermission()).toBe(3)
    })

    it('should apply "remove" operations to delete permissions', () => {
      // Setup backend data with two users
      const backendData = new GetEventCollectionPermissionsResponse()
      backendData.setPermissionsList([createPermission('user1', 1), createPermission('user2', 2)])

      // Setup optimistic data to remove user1
      const optimisticData: PermissionOperationData = {
        operations: new Map([
          [
            'user1',
            {
              operation: 'remove',
              collectionId: 'test-collection',
              userName: 'user1',
              permission: undefined,
            },
          ],
        ]),
        currentOperation: undefined,
      }

      const result = getMergedPermissions(backendData, optimisticData)

      // Should only have user2 remaining
      expect(result?.getPermissionsList().length).toBe(1)
      expect(result?.getPermissionsList()[0].getUser()?.getUsername()).toBe('user2')
    })

    it('should apply multiple operations in the correct order', () => {
      // Setup backend data
      const backendData = new GetEventCollectionPermissionsResponse()
      backendData.setPermissionsList([createPermission('user1', 1), createPermission('user2', 2)])

      // Setup optimistic data with multiple operations
      const optimisticData: PermissionOperationData = {
        operations: new Map([
          [
            'user1',
            {
              operation: 'remove',
              collectionId: 'test-collection',
              userName: 'user1',
              permission: undefined,
            },
          ],
          [
            'user2',
            {
              operation: 'set',
              collectionId: 'test-collection',
              userName: 'user2',
              permission: 3, // Update permission
            },
          ],
          [
            'user3',
            {
              operation: 'set',
              collectionId: 'test-collection',
              userName: 'user3',
              permission: 1, // Add new user
            },
          ],
        ]),
        currentOperation: undefined,
      }

      const result = getMergedPermissions(backendData, optimisticData)

      // Should have two permissions (user2 updated, user3 added, user1 removed)
      expect(result?.getPermissionsList().length).toBe(2)

      // Check user2 was updated
      const user2 = result?.getPermissionsList().find((p) => p.getUser()?.getUsername() === 'user2')
      expect(user2?.getPermission()).toBe(3)

      // Check user3 was added
      const user3 = result?.getPermissionsList().find((p) => p.getUser()?.getUsername() === 'user3')
      expect(user3).toBeDefined()
      expect(user3?.getPermission()).toBe(1)

      // Check user1 was removed
      const user1 = result?.getPermissionsList().find((p) => p.getUser()?.getUsername() === 'user1')
      expect(user1).toBeUndefined()
    })
  })
})
