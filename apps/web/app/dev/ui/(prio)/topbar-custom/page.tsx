'use client'

import { topBarItems } from '@/app/(app)/config'
import { DebugScenarioWrapper } from '@/components/debug/debug-scenario-wrapper'
import { TopBar } from '@/components/topbar/topbar'

export default function TopbarCustomPage() {
  return (
    <DebugScenarioWrapper title={'tb'}>
      <TopBar menuItems={topBarItems}>
        <div>xxxxxxxxxxxxxxxxxxxxxxx</div>
      </TopBar>
    </DebugScenarioWrapper>
  )
}
