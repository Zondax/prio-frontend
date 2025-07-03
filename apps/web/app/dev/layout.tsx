'use client'

import { LogoItem, ThemeToggleItem, TopBar, TriSection, useTopBarItem } from '@zondax/ui-common/client'
import { DevLinkItem } from '@/components/embedded-items/DevLinkItem'
import { EndpointSelectorItem } from '@/components/embedded-items/EndpointSelectorItem'
import { UserButtonItem } from '@/components/embedded-items/UserButtonItem'

function DevTopBarItems() {
  return (
    <>
      <LogoItem locationHook={useTopBarItem} text="Prio" section={TriSection.Left} priority={0} />
      <DevLinkItem locationHook={useTopBarItem} section={TriSection.Left} priority={10} />
      <EndpointSelectorItem locationHook={useTopBarItem} section={TriSection.Right} priority={5} showWhenAuthenticated={true} />
      <ThemeToggleItem locationHook={useTopBarItem} section={TriSection.Right} priority={10} />
      <UserButtonItem locationHook={useTopBarItem} section={TriSection.Right} priority={20} />
    </>
  )
}

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full w-full">
      <DevTopBarItems />
      <TopBar />
      <div className="px-4 sm:px-6 lg:px-8 xl:px-12">
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
