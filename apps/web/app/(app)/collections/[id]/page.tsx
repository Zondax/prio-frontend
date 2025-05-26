'use client'

import { useCollectionById, useCollectionEvents, useEndpointStore } from '@prio-state'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { useParams } from 'next/navigation'

import { Collection } from '@/components/collection/collection'

/**
 * Single Collection Page Component
 *
 * Displays a single collection with its events using the same components
 * as the explore page for event cards and event details.
 */
export default function CollectionSinglePage() {
  const { id } = useParams<{ id: string }>()

  // Collection data
  const { collectionWithSummary, isCollectionLoading, isUpdatingCollection, updateExistingCollection, setCollectionParams } =
    useCollectionById(id)

  // Event data
  const { events, loadNextPage, isEventLoading, updateEventStatus, setEventParams } = useCollectionEvents(id)

  const { selectedEndpoint } = useEndpointStore()

  // Setup gRPC connections for both stores
  useGrpcSetup(setCollectionParams, selectedEndpoint)
  useGrpcSetup(setEventParams, selectedEndpoint)

  return (
    <div className="flex flex-col h-full">
      <Collection
        collectionWithSummary={collectionWithSummary}
        isCollectionLoading={isCollectionLoading}
        events={events}
        isEventsLoading={isEventLoading}
        loadNextPage={loadNextPage}
        updateEventStatus={updateEventStatus}
        updateCollection={updateExistingCollection}
        isUpdating={isUpdatingCollection}
      />
    </div>
  )
}
