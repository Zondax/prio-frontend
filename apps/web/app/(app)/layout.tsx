'use client'

import DebugLayout from '@/components/debug/debug-layout'
import { useUser } from '@zondax/auth-web'

import '@/app/globals.css'

import { FloatingSettingsPanel } from '@/components/debug/floating-settings-panel'
import { Sticky } from '@/components/sticky/sticky'
import { StickyRenderer } from '@/components/sticky/sticky-renderer'
import { TopBar } from '@/components/topbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show content without TopBar
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto">
        <StickyRenderer>
          <DebugLayout index={1}>
            <div className="flex-1">{children}</div>
          </DebugLayout>
        </StickyRenderer>
        <FloatingSettingsPanel />
      </div>
    )
  }

  // If user is authenticated, show content with TopBar but no menu items
  return (
    <div className="max-w-7xl mx-auto">
      <StickyRenderer>
        <DebugLayout index={1}>
          <TopBar menuItems={[]} />
          <div className="flex-1">{children}</div>
        </DebugLayout>
      </StickyRenderer>
      <FloatingSettingsPanel />
    </div>
  )
}
