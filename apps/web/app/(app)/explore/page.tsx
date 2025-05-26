'use client'

import type { EventSortItem } from '@prio-state/api/event'
import { extractEventData, getDisplayEvents, usePinnedEvents } from '@prio-state/feature/events'
import type { FormattedEventData } from '@prio-state/feature/events'
import { type EventDetailState, useEventStore } from '@prio-state/stores/event'
import { useEventSelectionStore } from '@prio-state/stores/event-selection'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Event as GrpcEventModule } from '@prio-grpc'
import { useEventFilters } from '@prio-state/feature/events/filter-management'
import { useEndpointStore } from '@prio-state/stores'

import { EventCard } from '@/components/explore/event-card'
import { EventDetailsPreview } from '@/components/explore/event-preview'
import { PromoCard as PromotionalBannerComponent } from '@/components/explore/promo-card'
import { AiDisambiguationDialog } from '@/components/filterbar/ai-disambiguation-dialog'
import { FilterBar, type SearchMode } from '@/components/filterbar/filter-bar'
import { getDateFilterFromUrl } from '@/lib/filters'

import './virtual-grid.css'

import { EventCardSkeleton } from '@/components/explore/event-card-skeleton'
import { EventsMultiSelectionBar } from '@/components/explore/events-multi-selection-bar'
import { NoEvents } from '@/components/explore/no-events'
import { ViewToggleButton } from '@/components/explore/view-toggle-button'

import { MultiViewBlock, ViewMode } from '@/components/multi-view/multi-view'
import type { MultiGridRenderItem } from '@/components/multi-view/types'
import { type GridRenderItem, withGridRender } from '@/components/virtualized-grid/types'

// Data structure for promotional items, used by the renderPromo function
export type PromoItemData = {
  renderTag: 'promotional'
  id: string
  title: string
  // colSpan is part of GridRenderItem, will be on the final object
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const [selectedEventDetailState, setSelectedEventDetailState] = useState<EventDetailState | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [gridSize, setGridSize] = useState<string>('4')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID)

  const { data: events, metadata, setParams, setInput, isLoading, loadNextPage, error, updateEventStatus } = useEventStore()

  const gridContainerRef = useRef<HTMLDivElement>(null)
  const { selectedEndpoint } = useEndpointStore()
  useGrpcSetup(setParams, selectedEndpoint)

  const dateRangeFilter = useMemo(() => getDateFilterFromUrl(searchParams), [searchParams])

  const { filters, filterTags, search, sort, showPinnedOnly, setShowPinnedOnly, disambiguation, nlSessionId } = useEventFilters({
    metadata,
    dateRangeFilter,
  })

  // Initialize state for showing loading indicator when filters change
  const isCompactMode = gridSize === '6'

  const { selectedEventIds, clearSelection, isSelectionModeActive, isEventSelected, toggleEventSelection, selectEvents } =
    useEventSelectionStore()
  const selection = useMemo(
    () => ({
      isSelectionModeActive,
      isEventSelected,
      toggleEventSelection,
      selectEvents,
    }),
    [isSelectionModeActive, isEventSelected, toggleEventSelection, selectEvents]
  )
  const { togglePin, handleBulkPin } = usePinnedEvents(events, updateEventStatus)

  useEffect(() => {
    setInput({
      filters,
      sort: sort.current,
      nlSessionId: nlSessionId,
    })
  }, [filters, sort.current, nlSessionId])

  // Use displayed events based on the loading state
  const displayEvents = getDisplayEvents(events, { pinnedOnly: showPinnedOnly })

  // reusable render functions
  const renderEvent = withGridRender<FormattedEventData>((e, idx) => {
    // console.log('render Event', e.renderTag) // e is FormattedEventData, renderTag is on the grid item
    return (
      <EventCard
        key={`${idx}`}
        eventData={extractEventData(e.event)}
        onEventClick={handleEventClick}
        onPinToggle={(eventData) => togglePin(eventData.event)}
        /* FIXME:
        isPinned={checkEventPinnedById(e.event.getId().toString())} // Access getId from e.event
        */
        isCompact={isCompactMode}
        colSpan={1}
        showPinIcon={true}
        selection={selection}
      />
    )
  })

  const renderPromo = withGridRender<PromoItemData>(
    (p, idx): JSX.Element => (
      <PromotionalBannerComponent key={`promo-${p.id}-${idx}`} id={p.id} title={p.title} colSpan={(p as any).colSpan} />
    )
  )

  // Add promotional banners to the events list
  const gridItems: MultiGridRenderItem[] = useMemo(() => {
    if (!displayEvents || displayEvents.length === 0) return []

    // Create grid items from display events with column spans
    const items: MultiGridRenderItem[] = displayEvents.map((event: GrpcEventModule.Event) => {
      const formattedEvent = extractEventData(event)
      return {
        ...formattedEvent,
        colSpan: 1,
        gridRender: renderEvent,
        dummy: `event-${formattedEvent.id}`,
      }
    })

    // Insert a promotional banner at the third position (if there are enough events)
    if (items.length >= 2) {
      // Create a promotional banner
      const promotionalBanner: MultiGridRenderItem & PromoItemData = {
        renderTag: 'promotional',
        id: 'promo-banner-1',
        title: 'Featured Events',
        colSpan: 1,
        gridRender: renderPromo,
        dummy: 'promo-banner-1-dummy',
      }

      items.splice(2, 0, promotionalBanner)
    }

    return items
  }, [displayEvents, renderEvent, renderPromo, extractEventData])

  // Create a handler to update the event detail state
  const handleEventClick = useCallback((event: FormattedEventData) => {
    setSelectedEventDetailState({
      event: event.event,
      isLoading: false,
    })
  }, [])

  // Handle event detail state from map view
  const handleEventDetailStateUpdate = useCallback((eventDetailState: EventDetailState) => {
    setSelectedEventDetailState(eventDetailState)
  }, [])

  // Close the event details panel
  const handleCloseEventDetails = () => {
    setSelectedEventDetailState(null)
  }

  // Render a skeleton loader
  const renderSkeleton = (index: number) => {
    const colSpan = index < 10 ? 1 : 2
    return <EventCardSkeleton key={`loading-skeleton-${index}`} isCompact={isCompactMode} colSpan={colSpan} />
  }

  // Handle loadMore
  const handleLoadMore = () => {
    loadNextPage()
  }

  // Handle view mode change
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

  return (
    <div className="flex flex-col">
      <FilterBar<EventSortItem>
        filterTags={filterTags}
        searchQuery={search.query}
        onSearchChange={search.setQuery}
        onSearchSubmit={handleSearchSubmit}
        onSearchReset={search.reset}
        sortValue={sort.value}
        onSortChange={sort.handleChange}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        gridSize={gridSize}
        onGridSizeChange={setGridSize}
        viewMode={viewMode}
        onViewModeChange={handleViewChange}
        sortOptions={sort.options || []}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        showPinnedOnly={showPinnedOnly}
        onShowPinnedOnlyChange={setShowPinnedOnly}
        isLoading={isLoading}
        searchMode={search.mode}
        onSearchModeChange={onSearchModeChange}
      />
      <div className="flex-1" ref={gridContainerRef}>
        <MultiViewBlock
          viewMode={viewMode}
          gridItems={gridItems}
          renderSkeleton={renderSkeleton}
          isLoading={isLoading}
          loadMore={handleLoadMore}
          layoutConfig={{
            spacing: { x: 16, y: 16 },
            rowHeight: 420,
            itemMinWidth: 300,
          }}
          onEventDetailStateUpdate={handleEventDetailStateUpdate}
          filters={filters}
          EmptyComponent={NoEvents}
        />
      </div>
      {/* Event details dialog */}
      <EventDetailsPreview
        eventDetailState={selectedEventDetailState}
        onClose={handleCloseEventDetails}
        // FIXME:
        /*
        isPinned={selectedEventDetailState?.event ? checkEventPinnedById(selectedEventDetailState.event?.getId().toString()) : false}
*/
        onPinToggle={togglePin}
        selection={selection}
      />
      <ViewToggleButton viewMode={viewMode} onViewModeChange={handleViewChange} className="sm:hidden pb-safe" />
      <EventsMultiSelectionBar handleBulkPin={handleBulkPin} selectedEventIds={selectedEventIds} clearSelection={clearSelection} />
      <AiDisambiguationDialog
        isOpen={disambiguation.showDisambiguationDialog}
        onClose={disambiguation.handleDisambiguationDialogClose}
        ambiguousEntity={disambiguation.currentAmbiguousEntity}
        onOptionSelect={disambiguation.handleDisambiguationOptionSelect}
        position="center"
      />
    </div>
  )
}
