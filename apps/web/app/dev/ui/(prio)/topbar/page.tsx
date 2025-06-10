'use client'

import { DebugScenarioWrapper, widthVariants } from '@/components/debug/debug-scenario-wrapper'
import { TopBar } from '@/components/topbar/topbar'
import { topBarItems } from '@/app/(app)/config'

export default function TopbarPage() {
  return (
    <DebugScenarioWrapper>
      <TopBar menuItems={topBarItems} />
    </DebugScenarioWrapper>
  )
}
