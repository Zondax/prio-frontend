'use client'

import { useUser } from '@zondax/auth-web'

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
      // TODO: Enhance layout styles
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <StickyRenderer>
          <div className="flex-1">{children}</div>
        </StickyRenderer>
      </div>
    )
  }

  // If user is authenticated, show content with TopBar but no menu items
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
      <StickyRenderer>
        <TopBar menuItems={[]} />
        <div className="flex-1">{children}</div>
      </StickyRenderer>
    </div>
  )
}
