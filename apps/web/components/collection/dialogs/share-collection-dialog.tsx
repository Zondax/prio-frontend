'use client'

import {
  CollectionResponse,
  type EventCollection,
  EventCollectionPermissionType,
  type EventCollectionWithSummary,
  createGetCollectionPermissionsRequest,
  useCollectionPermissionsStore,
} from '@prio-state'
import { useCollectionPermissionsLogic } from '@prio-state/feature/collections/hooks'
import { useEndpointStore } from '@prio-state/stores'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { useEffect, useMemo, useState } from 'react'

import { type DialogSharedPerson, ShareDialog } from '@/components/share/dialog'
import { toast } from '@/hooks/use-toast'

interface ShareCollectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collectionWithSummary?: EventCollectionWithSummary
  updateCollection?: (id: string, data: Partial<EventCollection.AsObject>) => void
  isLoading?: boolean
}

export function ShareCollectionDialog({
  open,
  onOpenChange,
  collectionWithSummary,
  updateCollection,
  isLoading,
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
  }, [collection])

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
      toast({
        description: 'Link copied to clipboard',
        duration: 3000,
      })
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
      triggerElement={null}
      roles={dialog?.rolesForDialog || []}
      accessTypes={dialog?.accessTypesForDialog || []}
      selectedAccessType={dialog?.selectedAccessType}
      canManagePermissions={canManagePermissions}
      isLoading={isDataLoading}
    />
  )
}
