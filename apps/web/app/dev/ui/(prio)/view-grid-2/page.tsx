'use client'

import { useCallback, useEffect, useState } from 'react'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import VirtualizedGrid from '@/components/virtualized-grid/index'
import type { GridRenderItem } from '@/components/virtualized-grid/types'

import { withGridRender } from '@/components/virtualized-grid/types'
import { VirtualDebugPanel } from './page-debug'

import { Badge } from '@/components/ui/badge'

import './virtual-grid.css'

// Mock item interface
interface MockItem {
  id: number
  title: string
  description: string
  tags: string[]
  color: string
  colSpan: 1 | 2 | 3 // Number of columns the item should span
}

// Generate a random pastel color
const getRandomPastelColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 80%)`
}

function generateMockItems(start: number, count: number): MockItem[] {
  console.log(`Generating ${count} mock items starting from ${start}`)
  return Array.from({ length: count }, (_, i) => {
    // Randomly determine column span - biased toward 1 column
    const colSpanOptions = [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3] // 70% chance of 1, 20% chance of 2, 10% chance of 3
    const colSpan = colSpanOptions[Math.floor(Math.random() * colSpanOptions.length)] as 1 | 2 | 3

    return {
      id: start + i,
      title: `Item ${start + i}${colSpan > 1 ? ` (${colSpan} cols)` : ''}`,
      description: `This is a description for item ${start + i}. It's a mock item used to demonstrate the virtualized grid component.`,
      tags: [`tag-${(start + i) % 5}`, `category-${(start + i) % 3}`],
      color: getRandomPastelColor(),
      colSpan,
    }
  })
}

export default function VirtualGridExample() {
  const [items, setItems] = useState<MockItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [gridSize, setGridSize] = useState<string>('4')
  const [overscan, setOverscan] = useState(5)
  const [loadMoreThreshold, setLoadMoreThreshold] = useState(0.3) // 30% from bottom
  const [showBorders, setShowBorders] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [gridSpacing, setGridSpacing] = useState(16) // Default grid spacing
  const [spacing, setSpacing] = useState({ x: 16, y: 16 })
  const [rowHeight, setRowHeight] = useState(280)
  const [debug, setDebug] = useState(false)

  // Load initial items
  useEffect(() => {
    const mockItems = generateMockItems(1, 20)
    setItems(mockItems)
  }, [])

  // Update spacing when gridSpacing changes
  useEffect(() => {
    setSpacing({ x: gridSpacing, y: gridSpacing })
  }, [gridSpacing])

  // Mock function to load more items
  const loadMore = () => {
    setIsLoading(true)
    console.log(`Loading more items. from ${items.length}`)
    const newItems = generateMockItems(items.length + 1, 10)
    setItems([...items, ...newItems])
    setIsLoading(false)
  }

  // Render a mock item card or simple item based on showBorders flag
  const renderItem = withGridRender<MockItem>((item: MockItem, index: number) => {
    // Check for 6-column layout to make more compact cards
    const isCompact = gridSize === '6'

    // Return simplified item for debugging if showBorders is enabled
    if (showBorders) {
      return (
        <div
          key={item.id}
          className={`h-full ${isCompact ? 'p-2' : 'p-4'} border-2 border-red-500 col-span-${item.colSpan}`}
          style={{ backgroundColor: item.color }}
        >
          <div className={`${isCompact ? 'text-sm' : 'font-medium'}`}>{item.title}</div>
          <div className="text-xs mt-2">ID: {item.id}</div>
          <div className="text-xs">
            Span: {item.colSpan} column{item.colSpan > 1 ? 's' : ''}
          </div>
        </div>
      )
    }

    // Return normal card item
    return (
      <div key={item.id} className={`h-full w-full overflow-hidden col-span-${item.colSpan}`}>
        <Card className="h-full flex flex-col">
          <CardHeader className={`${isCompact ? 'p-3 pb-1' : 'pb-2'}`}>
            <div className={`w-full rounded-md mb-1 ${isCompact ? 'h-16' : 'h-24'}`} style={{ backgroundColor: item.color }} />
            <CardTitle className={`truncate ${isCompact ? 'text-sm' : 'text-base'}`}>{item.title}</CardTitle>
          </CardHeader>
          <CardContent className={`${isCompact ? 'p-3 py-1' : 'py-2'} grow overflow-hidden`}>
            <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
          </CardContent>
          <CardFooter className={`${isCompact ? 'p-3 pt-1' : 'pt-2'} flex gap-2 flex-wrap`}>
            {item.tags.slice(0, isCompact ? 1 : 2).map((tag) => (
              <Badge key={`${item.id}-${tag}`} variant="outline" className="truncate max-w-[100px]">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        </Card>
      </div>
    )
  })

  // Render a skeleton loader
  const renderSkeleton = (index: number) => {
    const isCompact = gridSize === '6'
    // Generate random column span for skeleton items (mostly 1-column)
    const randomColSpan = Math.random() > 0.7 ? (Math.random() > 0.5 ? 3 : 2) : 1

    return (
      <div key={`skeleton-${index}`} className={`h-full w-full overflow-hidden col-span-${randomColSpan}`}>
        <Card className="h-full flex flex-col overflow-hidden">
          <CardHeader className={`${isCompact ? 'p-3 pb-1' : 'pb-2'} overflow-hidden`}>
            <Skeleton className={`w-full ${isCompact ? 'h-16' : 'h-24'} rounded-md mb-2`} />
            <Skeleton className={`${isCompact ? 'h-4 w-2/3' : 'h-6 w-3/4'}`} />
          </CardHeader>
          <CardContent className={`${isCompact ? 'p-3 py-1' : 'py-2'} grow overflow-hidden`}>
            <Skeleton className="h-4 w-full mb-2" />
            {!isCompact && <Skeleton className="h-4 w-5/6 mb-2" />}
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
          <CardFooter className={`${isCompact ? 'p-3 pt-1' : 'pt-2'} flex gap-2 overflow-hidden`}>
            <Skeleton className="h-5 w-16" />
            {!isCompact && <Skeleton className="h-5 w-16" />}
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Convert MockItem[] to GenericItem[] for VirtualizedGrid
  const genericItems: (GridRenderItem & MockItem)[] = items.map((item) => ({
    ...item,
    colSpan: item.colSpan,
    gridRender: renderItem,
  }))

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header for the page - doesn't scroll with content */}
      <div className="sticky top-0 z-10 bg-background shadow-xs">
        {/* Title */}
        <div className="py-1 px-4 border-b">
          <h1 className="text-xl font-bold">Virtual Grid Example</h1>
        </div>

        {/* Debug Panel */}
        <div className="border-b py-0.5">
          <VirtualDebugPanel
            itemCount={items.length}
            gridSize={gridSize}
            setGridSize={setGridSize}
            isLoading={isLoading}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            showBorders={showBorders}
            setShowBorders={setShowBorders}
            overscan={overscan}
            setOverscan={setOverscan}
            rowHeight={rowHeight}
            setRowHeight={setRowHeight}
            gridSpacing={gridSpacing}
            setGridSpacing={setGridSpacing}
            debug={debug}
            setDebug={setDebug}
          />
        </div>
      </div>

      {/* Content that scrolls */}
      <div className="overflow-auto flex-1">
        <VirtualizedGrid
          items={genericItems}
          renderSkeleton={renderSkeleton}
          isLoading={isLoading}
          loadMore={loadMore}
          hasMore={true}
          layoutConfig={{
            itemMinWidth: Math.floor(300 / Number.parseInt(gridSize)),
            rowHeight: rowHeight,
            spacing: spacing,
          }}
          overscanRows={overscan}
          loadMoreThreshold={loadMoreThreshold}
          debugConfig={{
            showGridVisualization: showGrid,
            enabled: debug,
          }}
        />
      </div>
    </div>
  )
}
