'use client'

import throttle from 'lodash/throttle'
import { useCallback, useEffect, useRef } from 'react'

import type { ScrollInfo } from '../types'

/**
 * Hook to handle infinite scroll loading
 */
export function useLoadMore(
  loadMore: (() => void) | undefined,
  isLoading: boolean,
  parentRef: React.RefObject<HTMLDivElement | null>,
  loadMoreRef: React.RefObject<HTMLDivElement | null>,
  rowVirtualizer: any,
  items: any[],
  itemChunks: any[][],
  overscanRows: number,
  loadMoreThreshold: number,
  debug: boolean,
  logger: any,
  hasMore = true
) {
  // Keep track of the last scroll position to determine direction
  const lastScrollTopRef = useRef(0)

  // Calculate scroll position and related values
  const getScrollInfo = useCallback(
    (scrollElement: HTMLElement): ScrollInfo => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement
      const scrollPercentage = scrollHeight <= clientHeight ? 0 : scrollTop / (scrollHeight - clientHeight)
      const isScrollingDown = scrollTop > lastScrollTopRef.current
      const hasOverflow = scrollHeight > clientHeight
      const hasScrolled = scrollTop > 0
      const isNearBottom = hasOverflow && hasScrolled && scrollPercentage > 1 - loadMoreThreshold

      // Update last scroll position
      lastScrollTopRef.current = scrollTop

      return { scrollPercentage, isScrollingDown, isNearBottom, hasOverflow, hasScrolled }
    },
    [loadMoreThreshold]
  )

  // Callback to try loading more data
  const tryLoadMore = useCallback(() => {
    if (!loadMore || isLoading || !hasMore) {
      return false
    }

    const scrollElement = parentRef.current
    if (!scrollElement) return false

    // Get scroll information
    const { scrollPercentage, hasOverflow, isScrollingDown } = getScrollInfo(scrollElement)

    // Get virtualized items information
    const virtualItems = rowVirtualizer.getVirtualItems()
    if (virtualItems.length === 0) return false

    const lastVisibleItemIndex = virtualItems[virtualItems.length - 1].index
    const totalRows = itemChunks.length
    const remainingRows = totalRows - lastVisibleItemIndex - 1

    // Simplified loading conditions:
    // 1. Near the end of data (to support column spanning layouts)
    const isNearEnd = remainingRows <= 6

    // 2. Near bottom by scroll percentage or approaching end of data
    const shouldLoadMore =
      hasMore &&
      ((hasOverflow && scrollPercentage > 0.7) || // 70% scrolled
        isNearEnd ||
        (isScrollingDown && remainingRows < 10) || // Add back scroll direction check
        items.length < 30) // Initial load case

    if (shouldLoadMore) {
      void (
        debug &&
        logger.info('LOAD_MORE:', {
          scrollPercentage: scrollPercentage.toFixed(2),
          remainingRows,
          totalRows,
          itemCount: items.length,
          scrollDirection: isScrollingDown ? 'down' : 'up',
        })
      )
      loadMore()
      return true
    }

    void (debug && logger.info('No need to load more at this time'))
    return false
  }, [loadMore, isLoading, getScrollInfo, rowVirtualizer, debug, logger, parentRef, itemChunks.length, items.length, hasMore])

  // Use Intersection Observer as the primary loading mechanism
  useEffect(() => {
    if (!loadMoreRef.current || !loadMore || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          void (debug && logger.info('LOAD_MORE: Sentinel element visible'))
          tryLoadMore()
        }
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 600px 0px', // Large margin to trigger earlier
      }
    )

    observer.observe(loadMoreRef.current)

    return () => {
      observer.disconnect()
    }
  }, [loadMore, tryLoadMore, logger, debug, loadMoreRef, hasMore])

  // Add a minimal scroll handler as backup for edge cases
  useEffect(() => {
    const scrollElement = parentRef.current
    if (!scrollElement || !loadMore || !hasMore) return

    const handleScroll = throttle(() => {
      tryLoadMore()
    }, 250) // Increased throttle time

    scrollElement.addEventListener('scroll', handleScroll)
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [loadMore, tryLoadMore, parentRef, hasMore])

  return { tryLoadMore, getScrollInfo }
}
