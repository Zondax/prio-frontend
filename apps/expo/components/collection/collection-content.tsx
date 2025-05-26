'use client'

import { type Event, ViewType } from '@prio-state'
import React from 'react'
import { Text, View, VirtualizedList } from 'react-native'

import { EventCard } from '../explore/event-card'
import { EventSkeleton } from '../explore/event-skeleton'
import { EmptyCollection } from './empty-collection'

interface CollectionContentProps {
  viewType: ViewType
  events: Event[]
  isLoading: boolean
  onEventClick: (event: Event) => void
  onPinToggle: (event: Event) => void
  checkEventPinnedById: (eventId: string) => boolean
  onLoadMore?: () => void
}

/**
 * CollectionContent - Displays the content of a single event collection.
 * Renders events in a virtualized list for Expo.
 *
 * @param viewType - The current view type (gallery or table)
 * @param events - Events to display
 * @param isLoading - Whether the events or collection is loading
 * @param onEventClick - Callback when an event is clicked
 * @param onPinToggle - Callback when an event's pin status is toggled
 * @param checkEventPinnedById - Function to check if an event is pinned by ID
 * @param onLoadMore - Callback when the end of the list is reached to load more items
 */
export function CollectionContent({
  viewType,
  events,
  isLoading,
  onEventClick,
  onPinToggle,
  checkEventPinnedById,
  onLoadMore,
}: CollectionContentProps) {
  // Define the function to get an item from the data at a specific index
  const getItem = (_data: unknown, index: number): Event => {
    return events[index]
  }

  // Show loading state with skeletons
  if (isLoading && events.length === 0) {
    return (
      <View className="flex-1 px-9">
        <EventSkeleton key="collection-skeleton-0" />
        <EventSkeleton key="collection-skeleton-1" />
        <EventSkeleton key="collection-skeleton-2" />
        <EventSkeleton key="collection-skeleton-3" />
      </View>
    )
  }

  if (viewType === ViewType.GALLERY) {
    // Show the empty state if no events and not loading
    const showEmptyState = events.length === 0 && !isLoading

    return (
      <View className="flex-1">
        {showEmptyState ? (
          <EmptyCollection />
        ) : (
          <VirtualizedList
            initialNumToRender={4}
            renderItem={({ item }: { item: Event }) => (
              <EventCard
                key={item.getId().toString()}
                event={item}
                isPinned={checkEventPinnedById(item.getId().toString())}
                onEventClick={onEventClick}
                onPinToggle={onPinToggle}
              />
            )}
            keyExtractor={(item) => item.getId().toString()}
            getItemCount={() => events.length}
            getItem={getItem}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            className="flex-1 px-9"
            // Show loading indicator at the bottom when loading more items
            ListFooterComponent={
              isLoading && events.length > 0 ? (
                <View className="py-4">
                  <EventSkeleton />
                </View>
              ) : null
            }
          />
        )}
      </View>
    )
  }

  // Table view (not implemented yet)
  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-center text-muted-foreground">Table view coming soon</Text>
    </View>
  )
}
