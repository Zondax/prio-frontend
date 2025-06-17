'use client'

import {
  type Event,
  type EventCollection,
  type EventCollectionWithSummary,
  type EventDetailState,
  type UpdateEventStatusFn,
  ViewType,
  useEditCollectionDialog,
  useShareCollectionDialog,
} from '@mono-state'
import { usePinnedEvents } from '@mono-state/feature/events/hooks'
import { EventStatus } from '@mono-grpc/entities/proto/api/v1/common_pb' // TODO: change it
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'

import { EventDetails } from '../explore/event-details'
import { CollectionContent } from './collection-content'
import { CollectionHeader } from './collection-header'
import { CollectionNotFound } from './collection-not-found'
import { EditCollectionDialog } from './dialogs/edit-collection-dialog'
import { ShareCollectionDialog } from './dialogs/share-collection-dialog'

interface CollectionProps {
  collectionWithSummary?: EventCollectionWithSummary
  isCollectionLoading?: boolean
  events: Event[]
  isEventsLoading?: boolean
  updateEventStatus: UpdateEventStatusFn
  updateCollection: (collectionId: string, data: Partial<EventCollection.AsObject>) => void
  isUpdating?: boolean
  onBackPress?: () => void
}

/**
 * Collection - Component to display a collection and its events
 */
export function Collection({
  collectionWithSummary,
  isCollectionLoading = false,
  events = [],
  isEventsLoading = false,
  updateEventStatus,
  updateCollection,
  isUpdating = false,
  onBackPress,
}: CollectionProps) {
  // State for view type
  const [viewType, setViewType] = useState<ViewType>(ViewType.GALLERY)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<EventDetailState | null>(null)

  const collection = collectionWithSummary?.getCollection()

  const { editDialogOpen, handleEditClick, handleEditDialogChange, handleUpdateCollection, handleEditSuccess } =
    useEditCollectionDialog(updateCollection)

  const { collectionToShare, shareDialogOpen, handleShareClick, handleShareDialogChange } = useShareCollectionDialog()

  const { togglePin, checkEventPinnedById } = usePinnedEvents(events, updateEventStatus)

  // Handle view type change
  const handleViewTypeChange = (type: ViewType) => {
    setViewType(type)
  }

  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  // Handle the back button press
  const handleBackClick = useCallback(() => {
    onBackPress?.()
  }, [onBackPress])

  // Handle selecting an event to view details
  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent({
      event,
      isLoading: false,
    })
  }, [])

  // Close the event details panel
  const handleCloseEventDetails = useCallback(() => {
    setSelectedEvent(null)
  }, [])

  // Handle loading states
  const isPageLoading = isEventsLoading || isCollectionLoading
  const collectionNotFound = !isPageLoading && !collection

  // This should not happen: collection not found.
  if (collectionNotFound) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <CollectionNotFound />
      </View>
    )
  }

  //   const name = collectionObj.getName() || 'Unnamed Collection'
  //   const description = collectionObj.getDescription() || 'No description'

  return (
    <View className="flex-1">
      {/* Header */}
      <CollectionHeader
        collectionWithSummary={collectionWithSummary}
        totalEvents={collectionWithSummary?.getTotalEvents()}
        viewType={viewType}
        onViewTypeChange={handleViewTypeChange}
        onBackPress={handleBackClick}
        onSharePress={handleShareClick}
        onEditPress={handleEditClick}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isLoading={isCollectionLoading}
      />

      {/* Events List */}
      <CollectionContent
        viewType={viewType}
        events={events}
        isLoading={isPageLoading}
        onEventClick={handleEventClick}
        onPinToggle={togglePin}
        checkEventPinnedById={checkEventPinnedById}
      />

      {/* Event details panel */}
      {selectedEvent && (
        <EventDetails
          eventDetailState={selectedEvent}
          onClose={handleCloseEventDetails}
          isPinned={selectedEvent.event ? checkEventPinnedById(selectedEvent.event.getId().toString()) : false}
          onPinToggle={togglePin}
        />
      )}

      {/* Edit Collection Dialog */}
      <EditCollectionDialog
        open={editDialogOpen}
        onOpenChange={handleEditDialogChange}
        collection={collection || undefined}
        onUpdate={handleUpdateCollection}
        isUpdating={isUpdating}
        onSuccess={handleEditSuccess}
      />

      {/* Share Collection Dialog */}
      <ShareCollectionDialog
        open={shareDialogOpen}
        onOpenChange={handleShareDialogChange}
        collectionWithSummary={collectionToShare || undefined}
        updateCollection={updateCollection}
        isLoading={isUpdating}
      />
    </View>
  )
}
