import {
  type EventCollection,
  EventCollectionPermissionType,
  type EventCollectionWithSummary,
  createGetCollectionPermissionsRequest,
  useCollectionPermissionsStore,
  useEndpointStore,
} from '@prio-state'
import { useCollectionPermissionsLogic } from '@prio-state/feature/collections/hooks/useCollectionPermissions'
import { useGrpcSetup } from '@zondax/auth-expo'
import React, { useEffect, useMemo, useState } from 'react'
import { type DialogSharedPerson, ShareDialog } from '~/components/ui/share-dialog'

interface ShareCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collectionWithSummary?: EventCollectionWithSummary // EventCollectionWithSummary
  updateCollection?: (collectionId: string, data: Partial<EventCollection.AsObject>) => void
  isLoading?: boolean
}

// TODO: add the possibility to share to other apps
export function ShareCollectionDialog({
  open,
  onOpenChange,
  collectionWithSummary,
  updateCollection,
  isLoading = false,
}: ShareCollectionDialogProps) {
  const [isCopied, setIsCopied] = useState(false)

  const {
    setInput,
    data,
    setCollectionPermission,
    removeCollectionPermission,
    setParams,
    isLoading: isLoadingPermissions,
  } = useCollectionPermissionsStore()
  const { selectedEndpoint } = useEndpointStore()
  useGrpcSetup(setParams, selectedEndpoint)
  const collection = collectionWithSummary?.getCollection()

  useEffect(() => {
    if (collection) {
      setInput(createGetCollectionPermissionsRequest(collection.getId()))
    }
  }, [collection, setInput])

  const { people, actions, dialog, helpers } = useCollectionPermissionsLogic({
    data,
    collection: collectionWithSummary?.getCollection(),
    setCollectionPermission,
    removeCollectionPermission,
    updateCollection,
  })

  // Transform SharedPerson to DialogSharedPerson
  const dialogPeople: DialogSharedPerson[] = useMemo(
    () =>
      people.map((person) => ({
        id: person.id,
        name: person.name,
        image: person.image,
        role: String(person.role),
        isOwner: String(person.role) === String(EventCollectionPermissionType.EVENT_COLLECTION_PERMISSION_OWNER),
      })),
    [people]
  )

  const copyLinkToClipboard = async () => {
    if (!collection || !helpers) return

    const shareLink = helpers.getShareLink(collection.getId())
    if (!shareLink) return
    try {
      await navigator.clipboard.writeText(shareLink)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const isDataLoading = !collection || isLoading || isLoadingPermissions
  const canManagePermissions = !isDataLoading ? helpers?.canManagePermissions(collectionWithSummary) : false
  const title = collection?.getName() || 'Collection'

  return (
    <ShareDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      people={dialogPeople}
      isLinkCopied={isCopied}
      onShare={actions.addCollaborator}
      onCopyLink={copyLinkToClipboard}
      onAccessChange={actions.updateVisibility}
      onRoleChange={actions.handleRoleChange}
      onRemove={actions.removeCollaborator}
      roles={dialog?.rolesForDialog || []}
      accessTypes={dialog?.accessTypesForDialog || []}
      selectedAccessType={dialog?.selectedAccessType}
      canManagePermissions={canManagePermissions}
      isLoading={isDataLoading}
    />
  )
}
