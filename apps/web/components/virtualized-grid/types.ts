import type { ReactNode } from 'react'

export interface GridRenderItem {
  colSpan?: number
  gridRender: (item: GridRenderItem, index: number) => ReactNode
  onGridClick?: (item: GridRenderItem) => void
}

// helper to cast GenericItem to a specific type for rendering
export function withGridRender<T>(fn: (typed: T, idx: number) => JSX.Element): (item: GridRenderItem, idx: number) => JSX.Element {
  return (item, idx) => fn(item as unknown as T, idx)
}

export interface LayoutConfig {
  itemMinWidth?: number // Minimum width for each item in pixels
  rowHeight?: number
  spacing?: number | string | { x?: number | string; y?: number | string }
}

export interface DebugConfig {
  enabled?: boolean
  showGridVisualization?: boolean
}

export interface SpacingValues {
  horizontalSpacing: number
  verticalSpacing: number
}

export interface ColumnPosition {
  id: string
  index: number
  left: number
  width: number
}

export interface ScrollInfo {
  scrollPercentage: number
  isScrollingDown: boolean
  isNearBottom: boolean
  hasOverflow: boolean
  hasScrolled: boolean
}

export interface VirtualizedGridProps<T extends GridRenderItem> {
  /**
   * CSS class name for the grid container
   */
  className?: string

  /**
   * Array of items to render in the grid
   */
  items: T[]

  /**
   * Function to render a loading skeleton
   * This is called when the component is loading
   */
  renderSkeleton?: (index: number) => ReactNode

  /**
   * Indicates whether the grid is loading
   * When true, the component will show a loading state
   */
  isLoading?: boolean

  /**
   * Callback function to load more items
   * This is called when the user scrolls to the bottom of the grid
   */
  loadMore?: () => void
  /**
   * Indicates whether there is more data to load
   * When false, the component will stop attempting to load more data
   */
  hasMore?: boolean

  /**
   * Configuration for layout properties like columns, row height, and spacing.
   */
  layoutConfig?: LayoutConfig

  /**
   * Number of additional rows to render outside the visible area
   * Higher values result in smoother scrolling but more DOM nodes
   */
  overscanRows?: number
  /**
   * Distance from the bottom (as a percentage) at which to start loading more items
   * 0.1 means 10% from the bottom
   */
  loadMoreThreshold?: number

  /**
   * Configuration for debugging features.
   */
  debugConfig?: DebugConfig

  /**
   * Component to display when there are no items and not loading
   */
  emptyComponent?: ReactNode
}
