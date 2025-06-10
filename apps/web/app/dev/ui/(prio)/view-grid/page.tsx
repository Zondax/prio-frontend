'use client'

import DebugLayout from '@/components/debug/debug-layout'
import { DebugScenarioWrapper } from '@/components/debug/debug-scenario-wrapper'
import VirtualizedGrid from '@/components/virtualized-grid'
import type { GridRenderItem } from '@/components/virtualized-grid/types'

interface MyMockItem extends GridRenderItem {
  id: string
  title: string
  description: string
}

function renderItem(item: GridRenderItem, index: number) {
  const mockItem = item as MyMockItem
  return (
    <div
      key={mockItem.id}
      data-testid={`grid-item-${mockItem.id}`}
      className="w-32 h-32 bg-primary/10 rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-primary/20 transition-colors"
    >
      <span className="text-sm font-medium line-clamp-4">
        {mockItem.title} {mockItem.description}
      </span>
    </div>
  )
}

const mockEvent = {
  id: 'mock-event-1',
  title: 'Awesome Tech Meetup',
  description: 'Join us for an exciting meetup about the latest in web development, AI, and more!',
}

const mockEvents: MyMockItem[] = Array(30)
  .fill(null)
  .map((_, i) => ({
    ...mockEvent,
    id: `mock-event-${i + 1}`,
    title: `Awesome Tech Meetup ${i + 1}`,
    description: 'Join us for an exciting meetup',
    gridRender: renderItem,
    colspan: 1,
  }))

export default function ViewsGridPage() {
  const renderSkeleton = () => <></>

  return (
    <DebugLayout index={2}>
      <h1 className="text-2xl font-bold mb-6">Grid View</h1>

      <DebugScenarioWrapper>
        <VirtualizedGrid
          className="h-[400px]"
          items={mockEvents}
          renderSkeleton={renderSkeleton}
          isLoading={false}
          loadMore={() => {}}
          layoutConfig={{
            rowHeight: 150,
            itemMinWidth: 150,
          }}
        />
      </DebugScenarioWrapper>
    </DebugLayout>
  )
}
