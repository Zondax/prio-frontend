'use client'

import { DebugScenarioWrapper, widthVariants } from '@/components/debug/debug-scenario-wrapper'
import { NavDesktop } from '@/components/topbar/nav-desktop'
import { topBarItems } from '@/app/(app)/config'

export default function NavigationPage() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((count: number) => (
        <div key={count} className="space-y-4 mb-8">
          <h3 className="text-lg font-medium">Navigation with {count} items</h3>
          {widthVariants.map((style) => (
            <div key={style.name} className={`p-2 ${style.className} bg-pink-900 @container`}>
              <NavDesktop menuItems={topBarItems.slice(0, count)} />
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
