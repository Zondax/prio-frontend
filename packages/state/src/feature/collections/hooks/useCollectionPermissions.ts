import {
  type EventCollection,
  EventCollectionPermissionType,
  EventCollectionVisibilityType,
  type EventCollectionWithSummary,
  type GetEventCollectionPermissionsResponse,
  type RemoveEventCollectionPermissionResponse,
} from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { APP_BASE_URL } from '../../../utils'
import { mapCollectionPermissionsToPeople } from '../permissions-mapper'
import { type SharedPerson, collectionAccessTypes, collectionRoles } from '../types'

interface UseCollectionPermissionsLogicArgs {
  data: GetEventCollectionPermissionsResponse | undefined
  collection?: EventCollection
  setCollectionPermission: (collectionId: string, userName: string, permission: number) => Promise<any>
  removeCollectionPermission: (collectionId: string, userName: string) => Promise<RemoveEventCollectionPermissionResponse>
  updateCollection?: (id: string, data: Partial<EventCollection.AsObject>) => void
}

export function useCollectionPermissionsLogic({
  data,
  collection,
  setCollectionPermission,
  removeCollectionPermission,
  updateCollection,
}: UseCollectionPermissionsLogicArgs) {
  // Get initial access type from collection
  const initialAccessType =
    collection?.getVisibility() === EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC
      ? EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC.toString()
      : EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE.toString()

  // TODO: We can resolve this (access-type changes) a store level
  const [localAccessType, setLocalAccessType] = useState<string>(initialAccessType)

  // Update local state when collection changes
  useEffect(() => {
    if (collection) {
      const newAccessType =
        collection.getVisibility() === EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC
          ? EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC.toString()
          : EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE.toString()
      setLocalAccessType(newAccessType)
    }
  }, [collection])

  const people: SharedPerson[] = useMemo(() => (data ? mapCollectionPermissionsToPeople(data) : []), [data])
  const collectionId = collection?.getId()
  // Add collaborator (default as VIEWER)
  const addCollaborator = useCallback(
    async (userName: string) => {
      if (!collectionId) return
      await setCollectionPermission(collectionId, userName, EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_VIEW)
    },
    [collectionId, setCollectionPermission]
  )

  // Change collaborator role
  const changeRole = useCallback(
    async (userName: string, role: EventCollectionPermissionType) => {
      if (!collectionId) return
      await setCollectionPermission(collectionId, userName, role)
    },
    [collectionId, setCollectionPermission]
  )

  // Remove collaborator
  const removeCollaborator = useCallback(
    async (userName: string) => {
      if (!collectionId) return
      await removeCollectionPermission(collectionId, userName)
    },
    [collectionId, removeCollectionPermission]
  )

  // Adapt roles and accessTypes to string values for ShareDialog
  const rolesForDialog = useMemo(() => collectionRoles.map((r) => ({ ...r, value: String(r.value) })), [])
  const accessTypesForDialog = useMemo(() => collectionAccessTypes.map((a) => ({ ...a, value: String(a.value) })), [])

  // Wrapper for onRoleChange to convert string to EventCollectionPermissionType
  const handleRoleChange = useCallback(
    async (personId: string, role: string) => {
      const parsedRole = Number(role) as EventCollectionPermissionType
      await changeRole(personId, parsedRole)
    },
    [changeRole]
  )

  // Update collection visibility (general access)
  const updateVisibility = useCallback(
    async (accessType: string) => {
      if (!updateCollection || !collectionId) return
      setLocalAccessType(accessType)
      let newVisibility: EventCollectionVisibilityType
      if (accessType === String(EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC)) {
        newVisibility = EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PUBLIC
      } else {
        newVisibility = EventCollectionVisibilityType.EVENT_COLLECTION_VISIBILITY_PRIVATE
      }
      await updateCollection(collectionId, { visibility: newVisibility })
    },
    [updateCollection, collectionId, collection]
  )

  const canManagePermissions = useCallback((collection: EventCollectionWithSummary | undefined) => {
    if (!collection) return false
    return collection?.getUserPermissions?.()?.getCanManagePermissions?.() ?? false
  }, [])

  const getShareLink = useCallback((currentCollectionId?: string): string => {
    if (!currentCollectionId) return ''
    return `${APP_BASE_URL}/collections/${currentCollectionId}`
  }, [])

  return {
    people,
    actions: {
      addCollaborator,
      removeCollaborator,
      changeRole,
      handleRoleChange,
      updateVisibility,
    },
    dialog: {
      rolesForDialog,
      accessTypesForDialog,
      selectedAccessType: localAccessType, // Use local state instead of direct collection access
    },
    helpers: {
      canManagePermissions,
      getShareLink,
    },
  }
}
