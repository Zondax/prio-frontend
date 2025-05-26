import { EventCollectionPermissionType, EventCollectionVisibilityType } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'

// SharedPerson is a frontend DTO for UI purposes only.
// It is a projection of gRPC User + permission info for the share dialog and similar UIs.
// The backend does NOT expose this type directly.

export interface SharedPerson {
  id: string
  name: string
  image?: string
  role?: EventCollectionPermissionType
}

export const collectionRoles = [
  {
    value: EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_VIEW,
    label: 'Viewer',
    description: 'Can view collection contents but cannot make changes',
  },
  {
    value: EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_EDIT,
    label: 'Editor',
    description: 'Can view and edit collection contents',
  },
  {
    value: EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_ADMIN,
    label: 'Admin',
    description: 'Can view, edit, and manage permissions for this collection',
  },
]

export const collectionAccessTypes = [
  {
    value: EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE,
    label: 'Restricted',
    description: 'Only people you invite can access',
  },
  {
    value: EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC,
    label: 'Public',
    description: 'Anyone with the link can access and it can be found through search',
  },
]

export function getRoleLabel(role: EventCollectionPermissionType): string {
  return collectionRoles.find((r) => r.value === role)?.label || 'Unknown'
}

export function getAccessTypeLabel(type: EventCollectionVisibilityType): string {
  return collectionAccessTypes.find((a) => a.value === type)?.label || 'Unknown'
}

// Types
export enum ViewType {
  GALLERY = 'gallery',
  TABLE = 'table',
}

/**
 * Form data interface for collection creation and editing
 */
export interface CollectionFormData {
  /** Collection name */
  name: string
  /** Collection description (optional) */
  description: string
  /** Collection visibility/access level */
  visibility: EventCollectionVisibilityType
  /** Optional eventId for associating with an event */
  eventId?: string
}
