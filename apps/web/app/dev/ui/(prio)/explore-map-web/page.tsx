'use client'

import DebugLayout from '@/components/debug/debug-layout'
import { DebugScenarioWrapper } from '@/components/debug/debug-scenario-wrapper'
import { WebMap } from '@/components/map/map'

export default function ExploreMapWebPage() {
  return (
    <DebugLayout index={2}>
      <h1 className="text-2xl font-bold mb-6">Map Web</h1>
      <DebugScenarioWrapper>
        <WebMap className="h-[400px]" />
      </DebugScenarioWrapper>
    </DebugLayout>
  )
}
