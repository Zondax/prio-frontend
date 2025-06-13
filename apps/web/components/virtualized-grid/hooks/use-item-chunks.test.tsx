/**
 * @vitest-environment jsdom
 */
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

import type { GridRenderItem } from '../types'
import { useItemChunks } from './use-item-chunks'

// Mock logger
const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
}

// Base properties for test items, not including GridRenderItem specifics like colSpan initially
interface TestItemBase {
  id: string // Changed to string for consistency with new tests
  size?: number // Example of another test-specific property
}

// MockGridItem extends GridRenderItem and adds test-specific properties like 'id'.
// It does not need to redefine gridRender's signature if mockRender is compatible.
interface MockGridItem extends GridRenderItem, TestItemBase {}

// mockRender must match the signature of GridRenderItem['gridRender']
// It takes 'item: GridRenderItem'. Inside, we cast to MockGridItem to access 'id'.
const mockRender = (item: GridRenderItem, index: number): ReactNode => {
  // Type assertion to access 'id', specific to test environment
  const mockItem = item as MockGridItem
  return <div key={mockItem.id || index}>{`Item ${mockItem.id || index}`}</div>
}

// Updated createItems to use string IDs and ensure MockGridItem structure
const createItems = (configs: Array<{ id: string; colSpan?: number }>): MockGridItem[] => {
  return configs.map((config, i) => ({
    ...config, // Spread id and colSpan
    gridRender: mockRender, // Assign the compatible mock render function
    // Add any other properties from TestItemBase or GridRenderItem if necessary
  }))
}

// Helper to create a list of simple items for tests that don't need specific IDs or colSpans upfront
const createSimpleItems = (count: number, colSpans?: number[]): MockGridItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `simple-${i + 1}`,
    colSpan: colSpans?.[i] || 1,
    gridRender: mockRender,
  }))
}

describe('useItemChunks', () => {
  // Use createSimpleItems for existing tests that don't rely on specific string IDs
  it('returns empty array for empty input', () => {
    const { result } = renderHook(() => useItemChunks<MockGridItem>([], 4, mockLogger))
    expect(result.current).toEqual([])
  })

  it('handles single column layout correctly', () => {
    const items = createSimpleItems(3)
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 1, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([[items[0].id], [items[1].id], [items[2].id]])
  })

  it('organizes items in multi-column layout', () => {
    const items = createSimpleItems(4)
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 2, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([
      [items[0].id, items[1].id],
      [items[2].id, items[3].id],
    ])
  })

  it('handles items with different column spans', () => {
    const items = createSimpleItems(4, [2, 1, 2, 1])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 3, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([
      [items[0].id, items[1].id],
      [items[2].id, items[3].id],
    ])
  })

  it('limits column spans to available columns', () => {
    const items = createSimpleItems(2, [4, 2])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 3, mockLogger))
    expect(result.current[0].length).toBe(1)
    expect(result.current[0][0].id).toBe(items[0].id)
    expect(result.current[1].length).toBe(1)
    expect(result.current[1][0].id).toBe(items[1].id)
  })

  it('optimizes gap filling by looking ahead', () => {
    const items = createSimpleItems(4, [2, 2, 1, 1]) // ids: simple-1, simple-2, simple-3, simple-4
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 3, mockLogger))
    // Expected: item0 (simple-1, span 2), item2 (simple-3, span 1) -> total 3
    //           item1 (simple-2, span 2), item3 (simple-4, span 1) -> total 3
    expect(result.current[0].map((item) => item.id)).toEqual([items[0].id, items[2].id])
    expect(result.current[1].map((item) => item.id)).toEqual([items[1].id, items[3].id])
  })

  it('handles complex layout with mixed spans', () => {
    const items = createSimpleItems(6, [2, 1, 1, 3, 2, 1])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 4, mockLogger))
    const actual = result.current
    const allItemsFlat = actual.flat()
    expect(allItemsFlat).toHaveLength(6)
    for (const item of items) {
      expect(allItemsFlat.map((i) => i.id)).toContain(item.id)
    }
    for (const row of actual) {
      const totalSpan = row.reduce((sum, item) => sum + (item.colSpan || 1), 0)
      expect(totalSpan).toBeLessThanOrEqual(4)
    }
  })

  it('handles edge case with all full-width items', () => {
    const items = createSimpleItems(3, [4, 4, 4])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 4, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([[items[0].id], [items[1].id], [items[2].id]])
  })

  it('handles gap filling with multiple candidates', () => {
    // ids: simple-1 (2), simple-2 (2), simple-3 (1), simple-4 (1), simple-5 (1)
    // numCols = 4
    // Row 1: simple-1 (2), simple-2 (2) -> sum 4. Items left: simple-3, simple-4, simple-5 (all span 1)
    // Row 2: simple-3 (1), simple-4 (1), simple-5 (1) -> sum 3. Items left: none
    const items = createSimpleItems(5, [2, 2, 1, 1, 1])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 4, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([
      [items[0].id, items[1].id],
      [items[2].id, items[3].id, items[4].id],
    ])
  })

  it('correctly chunks a mix of 2-col and 1-col items', () => {
    // ids: simple-1(2), simple-2(1), simple-3(1), simple-4(1), simple-5(2), simple-6(1), simple-7(1), simple-8(1), simple-9(1), simple-10(1)
    // numCols = 4
    // Row 1: s1(2), s2(1), s3(1) -> sum 4. Left: s4(1), s5(2), s6(1), s7(1), s8(1), s9(1), s10(1)
    // Row 2: s4(1), s5(2), s6(1) -> sum 4. Left: s7(1), s8(1), s9(1), s10(1)
    // Row 3: s7(1), s8(1), s9(1), s10(1) -> sum 4. Left: none
    const items = createSimpleItems(10, [2, 1, 1, 1, 2, 1, 1, 1, 1, 1])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 4, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([
      [items[0].id, items[1].id, items[2].id],
      [items[3].id, items[4].id, items[5].id],
      [items[6].id, items[7].id, items[8].id, items[9].id],
    ])
  })

  it('handles items with 3-column spans correctly', () => {
    // ids: s1(3), s2(1), s3(3), s4(1), s5(1)
    // numCols = 4
    // Row 1: s1(3), s2(1) -> sum 4. Left: s3(3), s4(1), s5(1)
    // Row 2: s3(3), s4(1) -> sum 4. Left: s5(1)
    // Row 3: s5(1) -> sum 1. Left: none
    const items = createSimpleItems(5, [3, 1, 3, 1, 1])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 4, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([
      [items[0].id, items[1].id],
      [items[2].id, items[3].id],
      [items[4].id],
    ])
  })

  it('handles sequential 2-column items in a 6-column grid', () => {
    const items = createSimpleItems(6, [2, 2, 2, 2, 2, 2])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 6, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([
      [items[0].id, items[1].id, items[2].id],
      [items[3].id, items[4].id, items[5].id],
    ])
  })

  it('handles mixed column spans with odd number of columns', () => {
    // ids: s1(2), s2(3), s3(1), s4(2), s5(3)
    // numCols = 5
    // Row 1: s1(2), s2(3) -> sum 5. Left: s3(1), s4(2), s5(3)
    // Row 2: s3(1), s4(2) -> lookahead for 2. No, s5 is 3. So: s3(1), s4(2). sum 3. Left: s5(3)
    // Row 3: s5(3) -> sum 3. Left: none
    const items = createSimpleItems(5, [2, 3, 1, 2, 3])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 5, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([
      [items[0].id, items[1].id],
      [items[2].id, items[3].id],
      [items[4].id],
    ])
  })

  it('handles a single item that spans all columns', () => {
    const items = createSimpleItems(1, [6])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 6, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([[items[0].id]])
  })

  it('optimizes layout with alternating item sizes', () => {
    // ids: s1(2),s2(1),s3(2),s4(1),s5(2),s6(1),s7(2),s8(1)
    // numCols = 3
    // Row 1: s1(2),s2(1) -> sum 3
    // Row 2: s3(2),s4(1) -> sum 3
    // Row 3: s5(2),s6(1) -> sum 3
    // Row 4: s7(2),s8(1) -> sum 3
    const items = createSimpleItems(8, [2, 1, 2, 1, 2, 1, 2, 1])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 3, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([
      [items[0].id, items[1].id],
      [items[2].id, items[3].id],
      [items[4].id, items[5].id],
      [items[6].id, items[7].id],
    ])
  })

  it('handles items that would exceed row width', () => {
    const items = createSimpleItems(5, [2, 3, 2, 3, 1])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 6, mockLogger))
    const chunks = result.current
    expect(chunks[0].map((i) => i.id)).toContain(items[0].id)
    for (const row of chunks) {
      const totalColSpan = row.reduce((sum, item) => sum + (item.colSpan || 1), 0)
      expect(totalColSpan).toBeLessThanOrEqual(6)
    }
    const allItemsFlat = chunks.flat()
    expect(allItemsFlat).toHaveLength(5)
    for (const item of items) {
      expect(allItemsFlat.map((i) => i.id)).toContain(item.id)
    }
  })

  it('handles a large number of items efficiently', () => {
    const randomSpans = Array.from({ length: 20 }, () => Math.floor(Math.random() * 3) + 1)
    const items = createSimpleItems(20, randomSpans)
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 6, mockLogger))
    const allItemsFlat = result.current.flat()
    expect(allItemsFlat.length).toBe(20)
    for (const row of result.current) {
      const totalSpan = row.reduce((sum, item) => sum + (item.colSpan || 1), 0)
      expect(totalSpan).toBeLessThanOrEqual(6)
    }
  })

  it('handles items with mixed spans in a wider grid', () => {
    // s1(3) s2(3) s3(2) s4(4) s5(3) s6(3) s7(2) s8(1)
    // numCols = 6
    // R1: s1(3) s2(3) -> sum 6
    // R2: s3(2) s4(4) -> sum 6
    // R3: s5(3) s6(3) -> sum 6
    // R4: s7(2) s8(1) -> sum 3
    const items = createSimpleItems(8, [3, 3, 2, 4, 3, 3, 2, 1])
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, 6, mockLogger))
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([
      [items[0].id, items[1].id],
      [items[2].id, items[3].id],
      [items[4].id, items[5].id],
      [items[6].id, items[7].id],
    ])
  })

  it('does not mutate the original items array', () => {
    const items = createSimpleItems(3, [1, 1, 1])
    const originalItems = items.map((item) => ({ ...item })) // Deeper copy for safety
    renderHook(() => useItemChunks<MockGridItem>(items, 3, mockLogger))
    expect(items).toEqual(originalItems)
  })

  it('should correctly chunk items with various colSpans that perfectly fit into rows', () => {
    const itemsConfig = [
      { id: 'item1', colSpan: 2 },
      { id: 'item2', colSpan: 2 },
      { id: 'item3', colSpan: 3 },
      { id: 'item4', colSpan: 1 },
      { id: 'item5', colSpan: 1 },
      { id: 'item6', colSpan: 1 },
      { id: 'item7', colSpan: 1 },
      { id: 'item8', colSpan: 1 },
    ]
    const items = createItems(itemsConfig)

    const numColumns = 4
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, numColumns, mockLogger))

    // This assertion is based on the user's image and expectation for packing.
    // If the current hook logic produces something different, this test will fail,
    // highlighting the difference for review.
    expect(result.current.map((row) => row.map((item) => item.id))).toEqual([
      ['item1', 'item2'],
      ['item3', 'item4'],
      ['item5', 'item6', 'item7', 'item8'],
    ])
  })

  it('lookahead should fill a small gap at the end of a row if an exact match is found within LOOKAHEAD_LIMIT', () => {
    const itemsConfig = [
      { id: 's1', colSpan: 2 }, // simple-1 in original test
      { id: 's2', colSpan: 2 }, // simple-2
      { id: 's3', colSpan: 1 }, // simple-3
      { id: 's4', colSpan: 1 }, // simple-4
      { id: 's5', colSpan: 1 }, // simple-5
    ]
    const items = createItems(itemsConfig)
    const numColumns = 3
    const { result } = renderHook(() => useItemChunks<MockGridItem>(items, numColumns, mockLogger))

    // Original test expected [1,3] and [2,4,5] (using 1-based indexing for ids)
    // Which translates to items with ids ['s1', 's3'] and ['s2', 's4', 's5']
    // R1: s1(2) + s3(1) = 3.
    // R2: s2(2) + s4(1) = 3. (s5 is not used here by current logic as s4 filled the gap)
    // R3: s5(1)
    // Let's verify the current behavior.
    expect(result.current.length).toBe(3) // REVIEW: Check if this is the actual current behavior or desired.
    expect(result.current[0].map((item) => item.id)).toEqual(['s1', 's3'])
    expect(result.current[1].map((item) => item.id)).toEqual(['s2', 's4'])
    expect(result.current[2].map((item) => item.id)).toEqual(['s5'])
  })
})
