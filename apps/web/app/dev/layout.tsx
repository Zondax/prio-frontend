'use client'

import { useUser } from '@zondax/auth-web'
import { TopBar, useTopBarItem } from '@zondax/ui-common'
import Link from 'next/link'
import EndpointSelector from '@/components/endpoint-selector'

function DevNavigation() {
  const { user, isLoaded } = useUser()

  // Add Dev link to TopBar
  useTopBarItem(
    'dev-link',
    <Link href="/dev">
      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors">
        Dev
      </div>
    </Link>,
    'left',
    1
  )

  // Add EndpointSelector (conditionally rendered)
  useTopBarItem('endpoint-selector', isLoaded && user ? <EndpointSelector /> : null, 'right', 1)

  return null
}

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full w-full px-4 sm:px-6 lg:px-8 xl:px-12">
      <DevNavigation />
      <TopBar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
