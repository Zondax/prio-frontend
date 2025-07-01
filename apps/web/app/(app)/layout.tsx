'use client'

import { useUser } from '@zondax/auth-web'
import { LogoItem, ThemeToggleItem, TopBar, TriSection, useTopBarItem } from '@zondax/ui-common/client'
import { UserButtonItem } from '../../components/contextual/UserButtonItem'

function AppTopBarItems() {
  return (
    <>
      <LogoItem locationHook={useTopBarItem} text="Prio" section={TriSection.Left} priority={0} />
      <ThemeToggleItem locationHook={useTopBarItem} section={TriSection.Right} priority={10} />
      <UserButtonItem locationHook={useTopBarItem} section={TriSection.Right} priority={20} />
    </>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useUser()

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

  return (
    <div className="w-full">
      <AppTopBarItems />
      <TopBar />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
