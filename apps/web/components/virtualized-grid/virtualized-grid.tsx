'use client'

import { useVirtualizer } from '@tanstack/react-virtual'
import throttle from 'lodash/throttle'
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import { createLogger } from '@/lib/logger'
import { cn } from '@/lib/utils'

import { useColumns } from './hooks/use-columns'
import { useItemChunks } from './hooks/use-item-chunks'
import { useLoadMore } from './hooks/use-load-more'
import type { ColumnPosition, DebugConfig, GridRenderItem, LayoutConfig, VirtualizedGridProps } from './types'
import { getGridColumnClasses, getSpacingValues } from './utils/grid-utils'

// Default configurations
const DEFAULT_LAYOUT_CONFIG: Required<LayoutConfig> = {
  itemMinWidth: 150, // Default item minimum width in pixels
  rowHeight: 440,
  spacing: { x: 0, y: 0 },
}

const DEFAULT_DEBUG_CONFIG: Required<DebugConfig> = {
  enabled: false,
  showGridVisualization: false,
}

/**
 * A virtualized grid component that supports:
 * - Variable column layouts for different screen sizes
 * - Item spanning multiple columns
 * - Infinite scrolling
 * - Dynamic spacing and layout
 * - Debug visualization
 */
export default function VirtualizedGrid<T extends GridRenderItem>({
  className,
  items,
  renderSkeleton,
  emptyComponent,
  isLoading = false,
  hasMore = true,
  loadMore,
  loadMoreThreshold = 0.3,
  overscanRows = 5,
  layoutConfig: layoutConfigProp,
  debugConfig: debugConfigProp,
  hasEverLoaded = false,
}: VirtualizedGridProps<T>) {
  // Merge with defaults
  const layoutConfig = { ...DEFAULT_LAYOUT_CONFIG, ...layoutConfigProp }
  const debugConfig = { ...DEFAULT_DEBUG_CONFIG, ...debugConfigProp }

  const { itemMinWidth, rowHeight, spacing } = layoutConfig
  const { enabled: debug, showGridVisualization: showGrid } = debugConfig

  // Create a unique ID for this grid instance for logging
  const gridIdRef = useRef<string>(`grid-${Math.floor(Math.random() * 10000)}`)

  // Create a logger
  const logger = useMemo(() => createLogger(debug, gridIdRef.current), [debug])

  // State for debug controls (overscanRows might still be dynamic if needed later)
  const [overscanRowsValue, _setOverscanRowsValue] = useState<number>(overscanRows)

  const parentRef = useRef<HTMLDivElement>(null)
  // loadMoreRef is now conditionally rendered, so it might not always exist.
  // The useLoadMore hook needs to handle this gracefully or its usage adjusted.
  const loadMoreSentinelRef = useRef<HTMLDivElement>(null)

  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // Track container dimensions
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  // Extract spacing values
  const { horizontalSpacing, verticalSpacing } = useMemo(() => getSpacingValues(spacing), [spacing])

  // Setup resize observer to track container width
  useEffect(() => {
    const parentElement = parentRef.current
    if (!parentElement) return

    setContainerWidth(parentElement.offsetWidth)
    setContainerHeight(parentElement.offsetHeight)
    logger.info('Initial container width:', parentElement.offsetWidth)

    resizeObserverRef.current = new ResizeObserver(
      throttle((entries) => {
        for (const entry of entries) {
          if (entry.target === parentElement) {
            const newWidth = entry.contentRect.width
            const newHeight = entry.contentRect.height
            setContainerWidth((currentWidth) => (currentWidth === newWidth ? currentWidth : newWidth))
            setContainerHeight((currentHeight) => (currentHeight === newHeight ? currentHeight : newHeight))
          }
        }
      }, 100)
    )

    resizeObserverRef.current.observe(parentElement)

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [logger])

  // Use the columns hook to manage responsive column layout
  const { numColumns } = useColumns(containerWidth, gridIdRef, debug, itemMinWidth, horizontalSpacing)

  // Use the itemChunks hook to organize items into rows
  const itemChunks = useItemChunks(items, numColumns, logger)

  // Pre-memoize rendered items to reduce work during scrolling
  const renderedItems = useMemo(() => {
    return itemChunks.map((chunk, rowIndex) => chunk.map((item, colIndex) => item.gridRender(item, rowIndex * numColumns + colIndex)))
  }, [itemChunks, numColumns])

  // Pre-memoize skeletons to avoid recreating during scrolling
  const renderedSkeletons = useMemo(() => {
    if (!renderSkeleton) return []
    const skeletonId = `skeleton-${Date.now()}`
    // biome-ignore lint/suspicious/noArrayIndexKey: skeleton position is stable and appropriate for keys
    return Array.from({ length: numColumns }).map((_, i) => <div key={`${skeletonId}-col-${i}`}>{renderSkeleton(i)}</div>)
  }, [numColumns, renderSkeleton])

  // Setup virtualizer for rows
  const rowVirtualizer = useVirtualizer({
    count: itemChunks.length + (isLoading && hasMore ? 1 : 0), // Loader row only if loading and hasMore
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight + verticalSpacing, // Each row effectively takes up its height + the space below it
    overscan: overscanRowsValue,
    // Remove padding at the start, items will be flush with the top of the scroll container.
    paddingStart: 0,
  })

  // Generate grid column classes based on the dynamic numColumns
  const gridColumnClasses = useMemo(() => getGridColumnClasses(numColumns), [numColumns])

  // Use the loadMore hook to handle infinite scrolling
  useLoadMore(
    loadMore,
    isLoading,
    parentRef,
    loadMoreSentinelRef, // Use the new ref for the sentinel
    rowVirtualizer,
    items,
    itemChunks,
    overscanRowsValue,
    loadMoreThreshold,
    debug,
    logger,
    hasMore
  )

  // Force recalculation of virtualizer when spacing or height changes
  useEffect(() => {
    logger.info('Vertical spacing or rowVirtualizer changed, recalculating virtualizer')
    rowVirtualizer.measure()
  }, [rowVirtualizer, logger]) // Add logger to dependencies

  const virtualItems = rowVirtualizer.getVirtualItems()

  const totalSizeWithSpacing = rowVirtualizer.getTotalSize()

  // Helper function to determine row content (items or skeletons)
  const _renderRowContent = (isLoaderRowParam: boolean, rowIndexParam: number): React.ReactNode | null => {
    if (!isLoaderRowParam) {
      // console.log('render row', rowIndexParam, renderedItems[rowIndexParam])
      return renderedItems[rowIndexParam] ?? null
    }
    // isLoaderRow is true, check if we have a renderSkeleton function
    if (renderSkeleton) {
      // renderedSkeletons is an array of pre-rendered skeleton elements
      return renderedSkeletons
    }

    return null // No skeleton renderer provided, render nothing for loader row
  }

  // Generate grid visualization overlay if debug mode is enabled
  const gridVisualization = useMemo(() => {
    if (!showGrid) return null
    const rowCount = containerHeight ? Math.ceil((containerHeight * 1.5) / (rowHeight + verticalSpacing)) : 15
    const gapPercent = (horizontalSpacing / (containerWidth || 1)) * 100
    const totalGapPercent = gapPercent * (numColumns - 1)
    const contentPercent = (100 - totalGapPercent) / numColumns
    const columnPositions = Array(numColumns)
      .fill(0)
      .map((_, i) => {
        const leftPos = i * (contentPercent + gapPercent)
        return { id: `col-${i}`, index: i, left: leftPos, width: contentPercent }
      })
    // Pass 0 for topPaddingForViz to renderGridVisualization, as items now start at the top.
    return renderGridVisualization(columnPositions, numColumns, rowCount, gapPercent, rowHeight, verticalSpacing, 0)
  }, [showGrid, numColumns, horizontalSpacing, verticalSpacing, rowHeight, containerWidth, containerHeight])

  const showEmptyState = items.length === 0 && !isLoading && emptyComponent && hasEverLoaded

  return (
    <div
      ref={parentRef}
      className={cn('h-full w-full overflow-y-auto relative', className)} // Changed overflow-hidden to y-auto
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {showEmptyState ? (
        emptyComponent
      ) : (
        <div
          style={{
            height: `${totalSizeWithSpacing}px`,
            width: '100%',
            position: 'relative',
            willChange: 'transform',
            overflow: 'hidden', // Keep this to prevent inner scrollbars
          }}
        >
          {gridVisualization}
          {virtualItems.map((virtualRow) => {
            const rowIndex = virtualRow.index
            const isLoaderRow = rowIndex === itemChunks.length

            // The virtualRow.start already includes paddingStart and any spacing logic handled by the virtualizer itself
            // if estimateSize includes spacing.
            // The transform should just use virtualRow.start directly.
            // The height of the row div should be rowHeight, spacing is handled by virtualizer\'s item placement.

            return (
              <div
                key={virtualRow.key}
                className={cn(`absolute top-0 left-0 w-full grid ${gridColumnClasses}`)}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  height: `${rowHeight}px`,
                  columnGap: `${horizontalSpacing}px`,
                  willChange: 'transform',
                  // contain: 'layout paint style', // Already tested
                  // overflow: 'hidden', // Temporarily removed for testing
                }}
              >
                {_renderRowContent(isLoaderRow, rowIndex)}
              </div>
            )
          })}
        </div>
      )}
      {/* Render loadMoreSentinelRef only when not in empty state, and if loadMore is possible */}
      {!showEmptyState && loadMore && hasMore && !isLoading && (
        <div ref={loadMoreSentinelRef} style={{ height: '1px', width: '100%', position: 'absolute', bottom: '0' }} />
      )}
    </div>
  )
}

// Helper function to render grid visualization
function renderGridVisualization(
  columnPositions: ColumnPosition[],
  numColumns: number,
  rowCount: number,
  gapPercent: number,
  rowHeight: number,
  verticalSpacing: number,
  // Attempt to fix linter error by removing explicit type from default parameter
  topPaddingForViz = 0
): ReactNode {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Column guides */}
      <div className="h-full w-full relative overflow-hidden">
        {/* Horizontal spacing guides */}
        {numColumns > 1 &&
          Array.from({ length: numColumns - 1 }).map((_, i) => {
            const position = columnPositions[i].left + columnPositions[i].width
            return (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: only for debugging
                key={`gap-${i}`}
                className="absolute h-full bg-violet-500 bg-opacity-20 overflow-hidden"
                style={{ left: `${position}%`, width: `${gapPercent}%` }}
              />
            )
          })}
        {/* Column content areas */}
        {columnPositions.map((col) => (
          <div
            key={`col-${col.index}`}
            className="absolute h-full bg-blue-500 bg-opacity-10 border-x border-blue-500 border-opacity-30 flex items-start justify-center overflow-hidden"
            style={{ left: `${col.left}%`, width: `${col.width}%` }}
          >
            <span className="mt-2 text-blue-600 font-medium opacity-70 bg-card bg-opacity-50 px-1 rounded">{col.index + 1}</span>
          </div>
        ))}
      </div>

      {/* Row guides */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {Array.from({ length: rowCount }).map((_, i) => {
          // Adjust visualization top position by topPaddingForViz
          const top = i * (rowHeight + verticalSpacing) + topPaddingForViz
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: only for debugging
              key={`row-${i}`}
              className="absolute w-full border-t border-red-400 border-opacity-30 flex items-center overflow-hidden"
              style={{ top: `${top}px`, height: `${rowHeight}px` }}
            >
              <span className="ml-1 text-red-600 font-medium opacity-70 bg-red-100 bg-opacity-50 px-1 rounded text-xs">{i + 1}</span>
            </div>
          )
        })}
        {/* Vertical spacing guides */}
        {Array.from({ length: rowCount - 1 }).map((_, i) => {
          // Adjust visualization top position by topPaddingForViz
          const top = (i + 1) * rowHeight + i * verticalSpacing + topPaddingForViz
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: only for debugging
              key={`vgap-${i}`}
              className="absolute w-full bg-violet-500 bg-opacity-20 overflow-hidden"
              style={{ top: `${top}px`, height: `${verticalSpacing}px` }}
            />
          )
        })}
      </div>
    </div>
  )
}
