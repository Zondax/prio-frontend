import { EventCollectionPermissionType, EventCollectionVisibilityType } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { describe, expect, it } from 'vitest'

import { collectionAccessTypes, collectionRoles, getAccessTypeLabel, getRoleLabel } from '../types'

describe('collection types', () => {
  describe('collectionRoles', () => {
    it('should define viewer role correctly', () => {
      const viewerRole = collectionRoles.find((role) => role.value === EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_VIEW)
      expect(viewerRole).toBeDefined()
      expect(viewerRole?.label).toBe('Viewer')
      expect(viewerRole?.description).toContain('view collection contents')
    })

    it('should define editor role correctly', () => {
      const editorRole = collectionRoles.find((role) => role.value === EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_EDIT)
      expect(editorRole).toBeDefined()
      expect(editorRole?.label).toBe('Editor')
      expect(editorRole?.description).toContain('view and edit')
    })

    it('should define admin role correctly', () => {
      const adminRole = collectionRoles.find((role) => role.value === EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_ADMIN)
      expect(adminRole).toBeDefined()
      expect(adminRole?.label).toBe('Admin')
      expect(adminRole?.description).toContain('manage permissions')
    })
  })

  describe('collectionAccessTypes', () => {
    it('should define private access type correctly', () => {
      const privateAccess = collectionAccessTypes.find(
        (access) => access.value === EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE
      )
      expect(privateAccess).toBeDefined()
      expect(privateAccess?.label).toBe('Restricted')
      expect(privateAccess?.description).toContain('people you invite')
    })

    it('should define public access type correctly', () => {
      const publicAccess = collectionAccessTypes.find(
        (access) => access.value === EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC
      )
      expect(publicAccess).toBeDefined()
      expect(publicAccess?.label).toBe('Public')
      expect(publicAccess?.description).toContain('Anyone with the link')
    })
  })

  describe('getRoleLabel', () => {
    it('should return the correct label for viewer role', () => {
      expect(getRoleLabel(EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_VIEW)).toBe('Viewer')
    })

    it('should return the correct label for editor role', () => {
      expect(getRoleLabel(EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_EDIT)).toBe('Editor')
    })

    it('should return the correct label for admin role', () => {
      expect(getRoleLabel(EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_ADMIN)).toBe('Admin')
    })

    it('should return "Unknown" for undefined role', () => {
      expect(getRoleLabel(999 as EventCollectionPermissionType)).toBe('Unknown')
    })
  })

  describe('getAccessTypeLabel', () => {
    it('should return the correct label for private access type', () => {
      expect(getAccessTypeLabel(EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE)).toBe('Restricted')
    })

    it('should return the correct label for public access type', () => {
      expect(getAccessTypeLabel(EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC)).toBe('Public')
    })

    it('should return "Unknown" for undefined access type', () => {
      expect(getAccessTypeLabel(999 as EventCollectionVisibilityType)).toBe('Unknown')
    })
  })
})
