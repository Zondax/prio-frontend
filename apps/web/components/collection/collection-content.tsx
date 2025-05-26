'use client'

import type { Event } from '@prio-state/stores/event'
import { useCallback, useMemo, useRef, useState } from 'react'

import VirtualizedGrid from '@/components/virtualized-grid'
import { LOAD_MORE_THRESHOLD } from '@/lib/infinite-scroll'

import { extractEventData } from '@prio-state/feature/events'
import type { FormattedEventData } from '@prio-state/feature/events'
import { EventCard } from '../explore/event-card'
import { EventCardSkeleton } from '../explore/event-card-skeleton'
import { type GenericItem, withGridRender } from '../virtualized-grid/types'
import { ViewType } from './collections-config'
import { EmptyCollection } from './empty-collection'

interface CollectionContentProps {
  viewType: ViewType
  events: FormattedEventData[]
  isLoading: boolean
  hasMore?: boolean
  loadMore: () => void
  onEventClick: (event: FormattedEventData) => void
  onPinToggle: (event: FormattedEventData) => void
  checkEventPinnedById: (eventId: string) => boolean
}

/**
 * CollectionContent - Displays the content of a single event collection.
 * Renders events in a virtualized grid (gallery or table view).
 *
 * @param viewType - The current view type (gallery or table)
 * @param events - Events to display
 * @param isLoading - Whether the events or collection is loading
 * @param onEventClick - Callback when an event is clicked
 * @param onPinToggle - Callback when an event's pin status is toggled
 * @param checkEventPinnedById - Function to check if an event is pinned by ID
 */
export function CollectionContent({
  viewType,
  events,
  isLoading,
  hasMore = true,
  loadMore,
  onEventClick,
  onPinToggle,
  checkEventPinnedById,
}: CollectionContentProps) {
  const gridContainerRef = useRef<HTMLDivElement>(null)
  const [spacing] = useState(16)

  // Grid column configuration
  const columnConfig = {
    sm: 1,
    md: 2,
    lg: 3,
  }

  // Define the actual render function for an event item
  const eventCardRenderer = useCallback(
    (eventData: FormattedEventData, _idx: number): JSX.Element => {
      return (
        <EventCard
          key={eventData.id}
          eventData={eventData}
          isPinned={checkEventPinnedById(eventData.id)}
          onEventClick={onEventClick}
          onPinToggle={onPinToggle}
          colSpan={1}
        />
      )
    },
    [checkEventPinnedById, onEventClick, onPinToggle]
  )

  // Prepare the renderFunc for GenericItem using the helper
  const renderEventFunc = withGridRender<FormattedEventData>(eventCardRenderer)

  // Transform events into GenericItem structure for VirtualizedGrid
  const gridItems: GenericItem[] = useMemo(() => {
    return events.map((eventData) => ({
      renderTag: 'event',
      renderFunc: renderEventFunc,
      ...(eventData as any),
    }))
  }, [events, renderEventFunc])

  // Render a skeleton loader
  const renderSkeleton = useCallback((index: number) => {
    const colSpan = index < 10 ? 1 : 2
    return <EventCardSkeleton key={`loading-skeleton-${index}`} colSpan={colSpan} />
  }, [])

  const handleLoadMore = useCallback(() => {
    loadMore()
  }, [loadMore])

  if (viewType === ViewType.GALLERY) {
    // Show the empty state if no events and not loading
    const showEmptyState = gridItems.length === 0 && !isLoading

    return (
      <div className="h-full w-full overflow-hidden" ref={gridContainerRef}>
        {showEmptyState ? (
          <EmptyCollection />
        ) : (
          <VirtualizedGrid
            items={gridItems}
            renderSkeleton={renderSkeleton}
            isLoading={isLoading}
            loadMore={handleLoadMore}
            hasMore={hasMore}
            columnConfig={columnConfig}
            spacing={spacing}
            rowHeight={440}
            overscanRows={3}
            loadMoreThreshold={LOAD_MORE_THRESHOLD}
            topPadding={16}
          />
        )}
      </div>
    )
  }

  // Table view can be implemented later
  return <div className="p-4 text-center text-muted-foreground">Table view coming soon</div>
}
