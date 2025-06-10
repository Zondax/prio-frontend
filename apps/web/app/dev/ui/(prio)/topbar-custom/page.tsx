'use client'

import { DebugScenarioWrapper } from '@/components/debug/debug-scenario-wrapper'
import { TopBar } from '@/components/topbar/topbar'
import { topBarItems } from '@/app/(app)/config'

export default function TopbarCustomPage() {
  return (
    <DebugScenarioWrapper title={'tb'}>
      <TopBar menuItems={topBarItems}>
        <div>xxxxxxxxxxxxxxxxxxxxxxx</div>
      </TopBar>
    </DebugScenarioWrapper>
  )
}
