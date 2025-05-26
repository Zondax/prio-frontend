'use client'

import type { EventDetailState } from '@prio-state/stores/event'
import type { ComponentType } from 'react'

import { MapView } from '@/components/explore/map-view'
import { NoEvents } from '@/components/explore/no-events'
import VirtualizedGrid from '@/components/virtualized-grid/index'
import { LOAD_MORE_THRESHOLD } from '@/lib/infinite-scroll'
import { cn } from '@/lib/utils'
import type { Filter } from '@prio-state/feature/events'
import type { LoadMoreCallback, MultiGridRenderItem } from './types'
import type { LayoutConfig } from '../virtualized-grid/types'

interface MultiViewBlockProps {
  viewMode: ViewMode
  className?: string

  gridItems: MultiGridRenderItem[]
  renderSkeleton: (index: number) => JSX.Element

  isLoading: boolean
  loadMore: LoadMoreCallback

  layoutConfig?: LayoutConfig

  overscanRows?: number
  onEventDetailStateUpdate: (eventDetailState: EventDetailState) => void
  filters: Filter[] | undefined
  EmptyComponent?: ComponentType<any>
}

// Export ViewMode for other components
export enum ViewMode {
  GRID = 'grid',
  MAP = 'map',
  TABLE = 'table',
}

export function MultiViewBlock({
  viewMode,
  gridItems,
  renderSkeleton,
  isLoading,
  loadMore,
  layoutConfig,
  overscanRows,
  onEventDetailStateUpdate,
  filters,
  EmptyComponent = NoEvents,
  className,
}: MultiViewBlockProps) {
  let viewComponent: JSX.Element

  switch (viewMode) {
    case ViewMode.MAP:
      viewComponent = <MapView onEventClick={onEventDetailStateUpdate} externalFilters={filters} />
      break
    case ViewMode.GRID:
      viewComponent = (
        <VirtualizedGrid
          items={gridItems}
          renderSkeleton={renderSkeleton}
          isLoading={isLoading}
          loadMore={loadMore}
          layoutConfig={layoutConfig}
          overscanRows={overscanRows}
          loadMoreThreshold={LOAD_MORE_THRESHOLD}
          emptyComponent={<EmptyComponent />}
        />
      )
      break
    case ViewMode.TABLE:
      viewComponent = <div>TABLE NOT SUPPORTED YET</div>
      break
    default:
      viewComponent = <div>Unknown view mode: {viewMode}</div>
      break
  }

  return <div className={cn('flex-1', className)}>{viewComponent}</div>
}
