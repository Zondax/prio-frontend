'use client'

import { useUser } from '@zondax/auth-web'
import Link from 'next/link'
import EndpointSelector from '@/components/endpoint-selector'
import { TopBar } from '@/components/topbar'

function CustomNavigation() {
  const { user, isLoaded } = useUser()

  if (!isLoaded || !user) {
    return null
  }

  return <EndpointSelector />
}

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto">
      <TopBar menuItems={[]}>
        <Link href="/dev">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors">
            Dev
          </div>
        </Link>
        <CustomNavigation />
      </TopBar>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
