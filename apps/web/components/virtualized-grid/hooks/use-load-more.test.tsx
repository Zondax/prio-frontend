/**
 * @vitest-environment jsdom
 */

import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLoadMore } from './use-load-more'

// Create a mock for IntersectionObserver
const mockIntersectionObserverCallback = vi.fn()
const mockObserve = vi.fn()
const mockDisconnect = vi.fn()

// Track the most recent callback and observed element
let intersectionCallback: IntersectionObserverCallback
let observedElement: Element | null = null

// Mock IntersectionObserver implementation
global.IntersectionObserver = vi.fn().mockImplementation((callback) => {
  intersectionCallback = callback
  return {
    observe: (element: Element) => {
      mockObserve(element)
      observedElement = element
    },
    disconnect: mockDisconnect,
    root: null,
    rootMargin: '',
    thresholds: [],
    takeRecords: () => [],
    unobserve: () => {},
  }
})

// Helper to simulate intersection
function simulateIntersection(isIntersecting: boolean) {
  if (intersectionCallback && observedElement) {
    const entry = {
      isIntersecting,
      target: observedElement,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    }
    intersectionCallback([entry], {} as IntersectionObserver)
  }
}

describe('useLoadMore', () => {
  const mockLogger = {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
    custom: vi.fn(),
  }

  const loadMore = vi.fn()
  const rowVirtualizer = {
    getVirtualItems: vi.fn().mockReturnValue([
      { index: 0, start: 0, end: 100, size: 100 },
      { index: 1, start: 100, end: 200, size: 100 },
      { index: 2, start: 200, end: 300, size: 100 },
    ]),
  }

  // Create mock DOM elements
  let parentElement: HTMLDivElement
  let loadMoreElement: HTMLDivElement

  beforeEach(() => {
    vi.clearAllMocks()

    // Reset DOM elements
    parentElement = document.createElement('div')
    loadMoreElement = document.createElement('div')

    // Setup scroll properties
    Object.defineProperties(parentElement, {
      scrollTop: { writable: true, value: 0 },
      scrollHeight: { writable: true, value: 1000 },
      clientHeight: { writable: true, value: 500 },
    })

    // Setup event listener mocking
    parentElement.addEventListener = vi.fn()
    parentElement.removeEventListener = vi.fn()

    // Reset IntersectionObserver tracking variables
    observedElement = null
  })

  it('should calculate scroll info correctly', () => {
    const parentRef = { current: parentElement }
    const loadMoreRef = { current: loadMoreElement }

    const { result } = renderHook(() =>
      useLoadMore(
        loadMore,
        false,
        parentRef,
        loadMoreRef,
        rowVirtualizer,
        new Array(20),
        [new Array(5), new Array(5), new Array(5), new Array(5)],
        2,
        0.2,
        false,
        mockLogger
      )
    )

    // Test initial scroll info calculation
    parentElement.scrollTop = 200
    const scrollInfo = result.current.getScrollInfo(parentElement)

    expect(scrollInfo.scrollPercentage).toBeCloseTo(0.4, 1) // 200 / (1000 - 500) = 0.4
    expect(scrollInfo.isScrollingDown).toBe(true)
    expect(scrollInfo.isNearBottom).toBe(false)

    // Test near bottom detection
    parentElement.scrollTop = 450
    const scrollInfoNearBottom = result.current.getScrollInfo(parentElement)

    expect(scrollInfoNearBottom.isNearBottom).toBe(true)
  })

  it('should not load more if already loading', () => {
    const parentRef = { current: parentElement }
    const loadMoreRef = { current: loadMoreElement }

    const { result } = renderHook(() =>
      useLoadMore(
        loadMore,
        true, // is loading
        parentRef,
        loadMoreRef,
        rowVirtualizer,
        new Array(20),
        [new Array(5), new Array(5), new Array(5), new Array(5)],
        2,
        0.2,
        false,
        mockLogger
      )
    )

    result.current.tryLoadMore()
    expect(loadMore).not.toHaveBeenCalled()
  })

  it('should load more when near bottom', () => {
    const parentRef = { current: parentElement }
    const loadMoreRef = { current: loadMoreElement }

    // Set scroll position to near bottom
    parentElement.scrollTop = 450

    const { result } = renderHook(() =>
      useLoadMore(
        loadMore,
        false,
        parentRef,
        loadMoreRef,
        rowVirtualizer,
        new Array(20),
        [new Array(5), new Array(5), new Array(5), new Array(5)],
        2,
        0.2,
        false,
        mockLogger
      )
    )

    result.current.tryLoadMore()
    expect(loadMore).toHaveBeenCalled()
  })

  it('should handle intersection observer', () => {
    const parentRef = { current: parentElement }
    const loadMoreRef = { current: loadMoreElement }

    // Set scroll position to near bottom to ensure loadMore can be triggered
    parentElement.scrollTop = 450 // This makes isNearBottom true

    renderHook(() =>
      useLoadMore(
        loadMore,
        false, // not loading
        parentRef,
        loadMoreRef,
        rowVirtualizer,
        new Array(20),
        [new Array(5), new Array(5), new Array(5), new Array(5)],
        2,
        0.2,
        false,
        mockLogger
      )
    )

    // Verify that observe was called with our load more element
    expect(mockObserve).toHaveBeenCalledWith(loadMoreElement)

    // Simulate intersection
    simulateIntersection(true)

    // Verify loadMore was called
    expect(loadMore).toHaveBeenCalled()
  })

  it('should setup scroll event listener', () => {
    const parentRef = { current: parentElement }
    const loadMoreRef = { current: loadMoreElement }

    renderHook(() =>
      useLoadMore(
        loadMore,
        false,
        parentRef,
        loadMoreRef,
        rowVirtualizer,
        new Array(20),
        [new Array(5), new Array(5), new Array(5), new Array(5)],
        2,
        0.2,
        false,
        mockLogger
      )
    )

    expect(parentElement.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
  })
})
