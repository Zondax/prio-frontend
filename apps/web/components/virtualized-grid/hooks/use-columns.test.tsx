/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react'
import type React from 'react' // For React.MutableRefObject
import { describe, expect, it, test } from 'vitest'

import { useColumns } from './use-columns'

describe('useColumns with itemMinWidth', () => {
  const mockGridIdRef = { current: 'test-grid' } as React.MutableRefObject<string>
  const mockDebug = false

  // Test cases: [containerWidth, itemMinWidth, horizontalSpacing, expectedColumns]
  const testCases: [number, number, number, number][] = [
    [0, 150, 0, 1], // containerWidth = 0
    [100, 150, 0, 1], // containerWidth < itemMinWidth
    [150, 150, 0, 1], // containerWidth = itemMinWidth
    [299, 150, 0, 1], // containerWidth < 2 * itemMinWidth
    [300, 150, 0, 2], // containerWidth = 2 * itemMinWidth
    [448, 150, 0, 2], // MD example (max-w-md / 448px)
    [599, 150, 0, 3], // Just below 4 columns (150*4 = 600)
    [600, 150, 0, 4], // Exactly 4 columns
    [672, 150, 0, 4], // XL example (max-w-xl / 576px, but using 2XL image 672px) -> 672/150 = 4.48 -> 4 cols
    [749, 150, 0, 4], // Just below 5 columns (150*5 = 750)
    [768, 150, 0, 5], // 2XL example (max-w-2xl / 672px, but using 3XL image 768px) -> 768/150 = 5.12 -> 5 cols - REVIEW
    [1024, 150, 0, 6], // Wider screen (e.g., max-w-5xl) -> 1024/150 = 6.82 -> 6 cols
    [1280, 150, 0, 8], // Even wider screen (e.g., max-w-7xl) -> 1280/150 = 8.53 -> 8 cols
    [320, 150, 10, 2], // With spacing: (320+10)/(150+10) = 330/160 = 2.06 -> 2
    [512, 150, 10, 3], // With spacing: (512+10)/(150+10) = 522/160 = 3.26 -> 3
    [768, 150, 20, 4], // With spacing: (768+20)/(150+20) = 788/170 = 4.63 -> 4 cols
    [500, 100, 20, 4], // With spacing: (500+20)/(100+20) = 520/120 = 4.33 -> 4.
    [100, 0, 0, 1], // itemMinWidth <= 0, fallback to 1
    [100, 10, -5, 19], // Corrected: effectiveItemWidth = 5. (100-5)/5 = 19.
    [100, 10, -10, 10], // Corrected: effectiveItemWidth = 0. Fallback: Math.max(1, floor(100/10)) = 10.
    [100, 10, -15, 10], // effectiveItemWidth < 0. Fallback. Math.max(1, floor(100/10)) = 10
  ]

  test.each(testCases)(
    'width %p, itemMinWidth %p, spacing %p => %p columns',
    (containerWidth, itemMinWidth, horizontalSpacing, expectedColumns) => {
      const { result } = renderHook(() => useColumns(containerWidth, mockGridIdRef, mockDebug, itemMinWidth, horizontalSpacing))
      expect(result.current.numColumns).toBe(expectedColumns)
    }
  )

  it('should update numColumns when containerWidth changes', () => {
    const itemMinWidth = 150
    const horizontalSpacing = 0
    const { result, rerender } = renderHook(({ width }) => useColumns(width, mockGridIdRef, mockDebug, itemMinWidth, horizontalSpacing), {
      initialProps: { width: 300 },
    })
    expect(result.current.numColumns).toBe(2) // 300/150 = 2

    act(() => {
      rerender({ width: 512 })
    })
    // REVIEW: This is the crucial LG case from the screenshot
    expect(result.current.numColumns).toBe(3) // 512/150 = 3 (floor(3.41))

    act(() => {
      rerender({ width: 768 })
    })
    // REVIEW: Test for 3XL size (768px)
    expect(result.current.numColumns).toBe(5) // 768/150 = 5 (floor(5.12))

    act(() => {
      rerender({ width: 1024 })
    })
    expect(result.current.numColumns).toBe(6) // 1024/150 = 6 (floor(6.82))
  })

  it('should update numColumns when itemMinWidth changes', () => {
    const containerWidth = 512
    const horizontalSpacing = 0
    const { result, rerender } = renderHook(
      ({ minWidth }) => useColumns(containerWidth, mockGridIdRef, mockDebug, minWidth, horizontalSpacing),
      { initialProps: { minWidth: 150 } }
    )
    expect(result.current.numColumns).toBe(3)

    act(() => {
      rerender({ minWidth: 200 })
    })
    expect(result.current.numColumns).toBe(2) // 512/200 = 2 (floor(2.56))
  })

  it('should update numColumns when horizontalSpacing changes', () => {
    const containerWidth = 512
    const itemMinWidth = 150
    const { result, rerender } = renderHook(
      ({ hSpacing }) => useColumns(containerWidth, mockGridIdRef, mockDebug, itemMinWidth, hSpacing),
      { initialProps: { hSpacing: 0 } }
    )
    expect(result.current.numColumns).toBe(3) // (512+0)/(150+0) = 3

    act(() => {
      rerender({ hSpacing: 20 })
    })
    // (512+20)/(150+20) = 532/170 = 3.12 -> 3
    expect(result.current.numColumns).toBe(3)
  })
})
