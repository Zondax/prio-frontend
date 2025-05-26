'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { createLogger } from '@/lib/logger'

/**
 * Hook to manage responsive column layout based on item minimum width
 */
export function useColumns(
  containerWidth: number,
  gridIdRef: React.MutableRefObject<string>,
  debug: boolean,
  itemMinWidth = 150, // Default minimum width if not provided
  horizontalSpacing = 0 // Default horizontal spacing if not provided
) {
  const logger = useMemo(() => createLogger(debug, gridIdRef.current), [debug, gridIdRef])
  const [numColumns, setNumColumns] = useState(1)

  // Function to determine columns based on width, itemMinWidth, and horizontalSpacing
  const getColumnsForWidth = useCallback(
    (width: number) => {
      if (width === 0 || itemMinWidth <= 0) return 1 // Avoid division by zero or invalid input
      // Account for spacing: each item effectively takes itemMinWidth + horizontalSpacing
      // The container has (numColumns - 1) gaps, total width available for these slots is width + horizontalSpacing
      const effectiveItemWidth = itemMinWidth + horizontalSpacing
      if (effectiveItemWidth <= 0) return Math.max(1, Math.floor(width / itemMinWidth || 1)) // Fallback if spacing makes item width non-positive

      const calculatedCols = Math.floor((width + horizontalSpacing) / effectiveItemWidth)
      return Math.max(1, calculatedCols) // Ensure at least 1 column
    },
    [itemMinWidth, horizontalSpacing] // Add horizontalSpacing to dependency array
  )

  // Calculate column count when container width, itemMinWidth or horizontalSpacing changes
  useEffect(() => {
    const newColumns = getColumnsForWidth(containerWidth)
    if (newColumns !== numColumns) {
      logger.info('Column count changed:', { from: numColumns, to: newColumns, width: containerWidth, itemMinWidth, horizontalSpacing })
      setNumColumns(newColumns)
    }
  }, [containerWidth, getColumnsForWidth, numColumns, logger, itemMinWidth, horizontalSpacing]) // Add horizontalSpacing to dependency array

  return {
    numColumns,
    getColumnsForWidth,
  }
}
