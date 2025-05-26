'use client'

import {
  type EventCollection,
  type EventCollectionWithSummary,
  ViewType,
  useEditCollectionDialog,
  useShareCollectionDialog,
} from '@prio-state'
import type { Event, EventDetailState, UpdateEventStatusFn } from '@prio-state/stores/event'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'

import { extractEventData, getDisplayEvents, usePinnedEvents } from '@prio-state/feature/events'
import type { FormattedEventData } from '@prio-state/feature/events'
import { EventDetailsPreview } from '../explore/event-preview'
import { CollectionContent } from './collection-content'
import { CollectionHeader } from './collection-header'
import { CollectionNotFound } from './collection-not-found'
import { EditCollectionDialog, ShareCollectionDialog } from './dialogs'

interface CollectionProps {
  collectionWithSummary?: EventCollectionWithSummary
  isCollectionLoading?: boolean
  events: Event[]
  isEventsLoading?: boolean
  loadNextPage: () => void
  updateEventStatus: UpdateEventStatusFn
  updateCollection: (id: string, data: Partial<EventCollection.AsObject>) => void
  isUpdating?: boolean
}

/**
 * Collection - Component to display a single collection
 * Includes header with search and view controls
 * Displays events in the collection using the same EventCard component as explore
 *
 * @param collection - Collection object to display or null if not found
 * @param isCollectionLoading - Whether the collection is still loading
 * @param events - Events to display in the collection
 * @param isEventsLoading - Whether the events are still loading
 * @param updateEventStatus - Callback to handle pin toggling for events
 * @param updateCollection - Callback to handle collection updates
 * @param isUpdating - Whether the collection is being updated
 */
export function Collection({
  collectionWithSummary,
  isCollectionLoading = false,
  events = [],
  isEventsLoading = false,
  loadNextPage,
  updateEventStatus,
  updateCollection,
  isUpdating = false,
}: CollectionProps) {
  // State for view type and search
  const [viewType, setViewType] = useState<ViewType>(ViewType.GALLERY)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<EventDetailState | null>(null)

  const collection = collectionWithSummary?.getCollection()

  const { editDialogOpen, handleEditClick, handleEditDialogChange, handleUpdateCollection, handleEditSuccess } =
    useEditCollectionDialog(updateCollection)

  const { collectionToShare, shareDialogOpen, handleShareClick, handleShareDialogChange } = useShareCollectionDialog()

  const { togglePin, checkEventPinnedById } = usePinnedEvents(events, updateEventStatus)

  const router = useRouter()

  // Memoize formatted events
  const formattedEvents = useMemo(() => {
    return events.map((event) => extractEventData(event))
  }, [events])

  // Handle view type change
  const handleViewTypeChange = (type: ViewType) => {
    setViewType(type)
  }

  // Handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  // Handle back button click
  const handleBackClick = () => {
    router.back()
  }

  // Handle selecting an event to view details
  const handleEventClick = useCallback((event: FormattedEventData) => {
    setSelectedEvent({
      event: event.event,
      isLoading: false,
    })
  }, [])

  // Close the event details panel
  const handleCloseEventDetails = useCallback(() => {
    setSelectedEvent(null)
  }, [])

  const handleLoadMore = useCallback(() => {
    loadNextPage()
  }, [loadNextPage])

  const handleContentPinToggle = useCallback(
    (formattedEvent: FormattedEventData) => {
      // Ensure IDs are compared as strings
      const eventToToggle = events.find((e) => String(e.getId()) === String(formattedEvent.id))
      if (eventToToggle) {
        togglePin(eventToToggle) // togglePin is from usePinnedEvents
      } else {
        console.warn(`Event with id ${formattedEvent.id} not found in original events list for pinning.`)
      }
    },
    [events, togglePin]
  )

  // Handle loading states
  const isPageLoading = isEventsLoading || isCollectionLoading
  const collectionNotFound = !isPageLoading && !collectionWithSummary
  const showEmptyEvents = events.length === 0 && !isEventsLoading

  return (
    <div
      className="flex flex-col h-full"
      style={{
        height: collectionNotFound || showEmptyEvents ? 'calc(100vh - var(--topbar-height) - (var(--body-base-padding) * 2))' : '100%',
        width: '100%',
      }}
    >
      {collectionNotFound ? (
        <CollectionNotFound />
      ) : (
        <>
          <CollectionHeader
            collectionWithSummary={collectionWithSummary}
            itemsCount={collectionWithSummary?.getTotalEvents()}
            viewType={viewType}
            onViewTypeChange={handleViewTypeChange}
            onBackClick={handleBackClick}
            onShareClick={handleShareClick}
            onEditClick={handleEditClick}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            isLoading={isCollectionLoading}
          />

          <CollectionContent
            viewType={viewType}
            events={formattedEvents}
            isLoading={isPageLoading}
            loadMore={handleLoadMore}
            onEventClick={handleEventClick}
            onPinToggle={handleContentPinToggle}
            checkEventPinnedById={checkEventPinnedById}
          />

          {/* Event details panel */}
          {selectedEvent && (
            <EventDetailsPreview
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
        </>
      )}
    </div>
  )
}
