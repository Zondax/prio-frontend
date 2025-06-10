import DebugLayout from '@/components/debug/debug-layout'

import '@/app/globals.css'

import { FloatingSettingsPanel } from '@/components/debug/floating-settings-panel'
import { Sticky } from '@/components/sticky/sticky'
import { StickyRenderer } from '@/components/sticky/sticky-renderer'
import { TopBar } from '@/components/topbar'
import { topBarItems } from './config'

export const metadata = {
  title: 'App - Kickstarter',
  description: 'Kickstarter Application',
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto">
      <StickyRenderer>
        <DebugLayout index={1}>
          <TopBar menuItems={topBarItems} />
          <div className="flex-1">{children}</div>
        </DebugLayout>
      </StickyRenderer>
      <FloatingSettingsPanel />
    </div>
  )
}
