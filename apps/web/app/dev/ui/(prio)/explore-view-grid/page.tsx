'use client'

import { mockEvent } from '@/app/dev/ui/mocks/event'
import DebugLayout from '@/components/debug/debug-layout'
import { DebugScenarioWrapper } from '@/components/debug/debug-scenario-wrapper'
import { MultiViewBlock, ViewMode } from '@/components/multi-view/multi-view'
import type { GridRenderItem } from '@/components/virtualized-grid/types'

interface MyMockItem extends GridRenderItem {
  id: string
  title: string
  description: string
  dummy: string
}

function renderItem(item: MyMockItem) {
  return (
    <div
      key={item.id}
      className="w-32 h-32 bg-primary/10 rounded-lg flex items-center justify-center text-center cursor-pointer hover:bg-primary/20 transition-colors"
    >
      <span className="text-sm font-medium line-clamp-3">
        {item.title} {item.description}
      </span>
    </div>
  )
}

const mockEvents: MyMockItem[] = Array(30)
  .fill(null)
  .map((_, i) => ({
    ...mockEvent,
    id: `mock-event-${i + 1}`,
    title: `Awesome Tech Meetup ${i + 1}`,
    description: `Join us for an exciting meetup about ${['web development', 'AI', 'cloud computing', 'cybersecurity', 'data science'][i % 5]}!`,
    gridRender: renderItem,
    colspan: 1,
    dummy: `dummy-event-${i + 1}`,
  }))

export default function ExploreViewsGridPage() {
  const renderSkeleton = () => <></>

  return (
    <DebugLayout index={2}>
      <h1 className="text-2xl font-bold mb-6">Grid View</h1>

      <DebugScenarioWrapper>
        <MultiViewBlock
          viewMode={ViewMode.GRID}
          className="h-[400px]"
          gridItems={mockEvents}
          renderSkeleton={renderSkeleton}
          isLoading={false}
          loadMore={() => {}}
          gridSize="4"
          rowHeight={150}
          onEventDetailStateUpdate={() => {}}
          filters={[]}
        />
      </DebugScenarioWrapper>
    </DebugLayout>
  )
}
