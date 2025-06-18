'use client'

import { useMemo } from 'react'
import type { GridRenderItem } from '../types'

/**
 * Hook to organize items into row chunks based on columns
 */
export function useItemChunks<T extends GridRenderItem>(items: T[], numColumns: number, logger: any): T[][] {
  return useMemo(() => {
    if (items.length === 0) return []

    // Calculate column spans for all items upfront
    const itemsWithSpans = items.map((item, index) => ({
      item,
      index, // Store original index for reference
      colSpan: Math.min(item.colSpan ?? 1, numColumns),
    }))

    const chunks: T[][] = []

    // For debugging purposes
    if (logger?.debug) {
      logger.debug('[useItemChunks]', {
        totalItems: items.length,
        columns: numColumns,
        itemsWithSpans: itemsWithSpans.map(({ index, colSpan }) => ({ index, colSpan })),
      })
    }

    // Process items strictly in sequential order
    let i = 0
    while (i < itemsWithSpans.length) {
      // Start a new row
      const currentRow: T[] = []
      let remainingWidth = numColumns

      // Process items in order until row is full
      while (i < itemsWithSpans.length) {
        const currentItem = itemsWithSpans[i]

        // If item fits in this row, add it
        if (currentItem.colSpan <= remainingWidth) {
          currentRow.push(currentItem.item)
          remainingWidth -= currentItem.colSpan
          i++ // Move to next item
        } else {
          // Item doesn't fit, break and start a new row
          break
        }

        // If we have a small gap at the end of the row (less than half the columns),
        // try to find a smaller item to fill it, but only look a small distance ahead
        if (remainingWidth > 0 && remainingWidth < Math.ceil(numColumns / 2) && i < itemsWithSpans.length) {
          const LOOKAHEAD_LIMIT = 3 // Limit lookahead to preserve sequential ordering
          let bestFitIndex = -1

          // Only look for exact fits when filling small gaps
          for (let j = i; j < itemsWithSpans.length && j < i + LOOKAHEAD_LIMIT; j++) {
            if (itemsWithSpans[j].colSpan === remainingWidth) {
              bestFitIndex = j
              break
            }
          }

          if (bestFitIndex !== -1) {
            // Add the best fitting item to the row
            const filler = itemsWithSpans[bestFitIndex]
            currentRow.push(filler.item)

            // Remove this item from our processing queue
            itemsWithSpans.splice(bestFitIndex, 1)

            // Row is now full
            remainingWidth = 0
            break
          }
        }

        // If row is full, move to next row
        if (remainingWidth === 0) {
          break
        }
      }

      // Add the completed row to our chunks
      if (currentRow.length > 0) {
        chunks.push(currentRow)
      }
    }

    // Log the final result for debugging
    if (logger?.debug) {
      const chunkDetails = chunks.map((chunk, index) => ({
        chunkIndex: index,
        itemCount: chunk.length,
        items: chunk.map((item) => {
          // Try to extract an id or key property if it exists
          const anyItem = item as any
          const identifier = anyItem.id || anyItem.key || anyItem.eventId || 'unknown'
          return {
            identifier,
            colSpan: item.colSpan ?? 1,
          }
        }),
      }))

      logger.debug('[useItemChunks] Final chunks:', chunkDetails)
    }

    return chunks
  }, [items, numColumns, logger])
}
