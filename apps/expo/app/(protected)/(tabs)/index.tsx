'use client'

import { getDisplayEvents, usePinnedEvents } from '@prio-state/feature/events'
import { useEventFilters } from '@prio-state/feature/events/filter-management'
import { useEndpointStore } from '@prio-state/stores/endpoints'
import { type Event, type EventDetailState, useEventStore } from '@prio-state/stores/event'
import { useGrpcSetup } from '@zondax/auth-expo/src/hooks/useGrpcSetup'
import { useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { View, VirtualizedList } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AiDisambiguationDialog } from '~/components/explore/ai-disambiguation-dialog'
import { EventCard } from '~/components/explore/event-card'
import { EventDetails } from '~/components/explore/event-details'
import { EventSkeleton } from '~/components/explore/event-skeleton'
import { FilterBar, type SearchMode, ViewMode } from '~/components/explore/filter-bar'
import { MapView } from '~/components/explore/map-view'
import { NoEvents } from '~/components/explore/no-events'
import { ViewToggleButton } from '~/components/explore/view-toggle-button'
import { getDateFilterFromUrl } from '~/lib/filters'

export default function ProtectedHome() {
  const insets = useSafeAreaInsets()
  const [selectedEventDetailState, setSelectedEventDetailState] = useState<EventDetailState | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.EXPLORE)
  const [gridSize] = useState<string>('4')

  const { data: events, metadata, isLoading, metrics, setInput, setParams, loadNextPage, updateEventStatus } = useEventStore()

  const { selectedEndpoint } = useEndpointStore()
  useGrpcSetup(setParams, selectedEndpoint)

  // Get startDate and endDate from URL params if available
  const searchParams = useLocalSearchParams()
  const dateRangeFilter = getDateFilterFromUrl(searchParams)

  // Use event filters hook to manage filters, search, and sorting
  const { filters, filterTags, search, sort, showPinnedOnly, setShowPinnedOnly, nlSessionId, disambiguation } = useEventFilters({
    metadata,
    dateRangeFilter,
  })

  const { togglePin, checkEventPinnedById } = usePinnedEvents(events, updateEventStatus)

  // Update input with filters, sort, and sessionId
  useEffect(() => {
    setInput({
      filters,
      sort: sort.current,
      nlSessionId: nlSessionId,
    })
  }, [filters, sort.current, nlSessionId, setInput])

  // Use displayed events based on the loading state
  const displayEvents = getDisplayEvents(events, { pinnedOnly: showPinnedOnly }) || []

  const getItem = (_data: unknown, index: number): Event => {
    return displayEvents[index]
  }

  const fetchMore = () => {
    loadNextPage()
  }

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view)
  }

  const handleSearchSubmit = (query: string) => {
    search.executeSearch(query)
  }

  // Handle search mode change
  const onSearchModeChange = (mode: SearchMode) => {
    search.handleModeChange(mode)
  }

  // Handle when a map event is clicked
  const handleEventClick = (event: Event) => {
    setSelectedEventDetailState({
      event,
      isLoading: false,
    })
  }

  // Handle event detail state from map view
  const handleEventDetailStateUpdate = useCallback((eventDetailState: EventDetailState) => {
    setSelectedEventDetailState(eventDetailState)
  }, [])

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <View className="flex flex-1 flex-col">
        <FilterBar
          filterTags={filterTags}
          searchQuery={search.query}
          onSearchChange={search.setQuery}
          onSearchSubmit={handleSearchSubmit}
          onSearchReset={search.reset}
          sortValue={sort.value}
          onSortChange={sort.handleChange}
          sortOptions={sort.options || []}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          gridSize={gridSize}
          onGridSizeChange={() => {}}
          viewMode={viewMode}
          onViewModeChange={handleViewChange}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          showPinnedOnly={showPinnedOnly}
          onShowPinnedOnlyChange={setShowPinnedOnly}
          isLoading={isLoading}
          searchMode={search.mode}
          onSearchModeChange={onSearchModeChange}
        />

        <View className="flex-1 w-full h-full">
          {viewMode === ViewMode.EXPLORE ? (
            isLoading ? (
              // Skeleton loading state
              <View className="flex-1 px-9">
                <EventSkeleton key="skeleton-loader-0" />
                <EventSkeleton key="skeleton-loader-1" />
                <EventSkeleton key="skeleton-loader-2" />
                <EventSkeleton key="skeleton-loader-3" />
              </View>
            ) : (
              <VirtualizedList
                initialNumToRender={4}
                renderItem={({ item }) => (
                  <EventCard
                    key={item.getId()}
                    event={item}
                    isPinned={checkEventPinnedById(item.getId().toString())}
                    onEventClick={handleEventClick}
                    onPinToggle={togglePin}
                  />
                )}
                keyExtractor={(item) => item.getId().toString()}
                getItemCount={() => displayEvents.length}
                getItem={getItem}
                onEndReached={() => {
                  fetchMore()
                }}
                onEndReachedThreshold={0.5}
                className="flex-1 px-9"
                ListEmptyComponent={() => (
                  <View style={{ flex: 1, minHeight: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <NoEvents />
                  </View>
                )}
              />
            )
          ) : (
            <MapView
              onEventClick={handleEventDetailStateUpdate}
              searchQuery={search.query}
              isPinnedOnly={showPinnedOnly}
              externalFilters={filters}
            />
          )}
        </View>
      </View>

      {/* View toggle button */}
      <ViewToggleButton currentView={viewMode} onViewChange={handleViewChange} />

      {/* Event details dialog */}
      {selectedEventDetailState && (
        <EventDetails
          eventDetailState={selectedEventDetailState}
          onClose={() => setSelectedEventDetailState(null)}
          isPinned={selectedEventDetailState.event ? checkEventPinnedById(selectedEventDetailState.event.getId().toString()) : false}
          onPinToggle={togglePin}
        />
      )}

      {/* AI Disambiguation Dialog */}
      <AiDisambiguationDialog
        isOpen={disambiguation.showDisambiguationDialog}
        onClose={disambiguation.handleDisambiguationDialogClose}
        ambiguousEntity={disambiguation.currentAmbiguousEntity}
        onOptionSelect={disambiguation.handleDisambiguationOptionSelect}
        position="center"
      />
    </View>
  )
}
