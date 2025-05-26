'use client'

import DebugLayout from '@/components/debug/debug-layout'
import { DebugScenarioWrapper } from '@/components/debug/debug-scenario-wrapper'
import { MultiViewBlock, ViewMode } from '@/components/multi-view/multi-view'

export default function ExploreViewsMapPage() {
  return (
    <DebugLayout index={2}>
      <h1 className="text-2xl font-bold mb-6">Map Web</h1>

      <DebugScenarioWrapper>
        <MultiViewBlock
          className="h-full"
          viewMode={ViewMode.MAP}
          gridItems={[]}
          renderSkeleton={() => <></>}
          isLoading={false}
          loadMore={() => {}}
          gridSize="4"
          spacing={{ x: 0, y: 0 }}
          rowHeight={0}
          overscanRows={0}
          onEventDetailStateUpdate={() => {}}
          filters={[]}
        />
      </DebugScenarioWrapper>
    </DebugLayout>
  )
}
