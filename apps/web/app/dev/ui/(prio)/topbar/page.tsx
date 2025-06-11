'use client'

import { topBarItems } from '@/app/(app)/config'
import { DebugScenarioWrapper, widthVariants } from '@/components/debug/debug-scenario-wrapper'
import { TopBar } from '@/components/topbar/topbar'

export default function TopbarPage() {
  return (
    <DebugScenarioWrapper>
      <TopBar menuItems={topBarItems} />
    </DebugScenarioWrapper>
  )
}
