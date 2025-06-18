'use client'

import { UserButton } from '@zondax/auth-web'
import { ThemeSelector } from '@zondax/ui-common'
import { useState } from 'react'
import { Logo } from './logo'
import { NavDesktop } from './nav-desktop'
import { NavMobile } from './nav-mobile'
import type { TopBarItems } from './types'

export interface TopBarProps {
  menuItems: TopBarItems
  children?: React.ReactNode
}

export function TopBar({ menuItems, children }: TopBarProps) {
  const [showDesktop, setShowDesktop] = useState(true)

  return (
    <header className="bg-background">
      <div className="flex items-center justify-between" style={{ height: 'var(--topbar-height)' }}>
        <div className="flex items-center flex-shrink-0">
          <NavMobile menuItems={menuItems} isVisible={!showDesktop} forceShowTrigger={menuItems.length > 0} />
          <div className="ml-2">
            <Logo />
          </div>
        </div>
        <div className="flex-1 flex justify-center min-w-1">
          <NavDesktop menuItems={menuItems} isVisible={showDesktop} onOverflowChange={setShowDesktop} />
        </div>
        <div className="flex mr-0 items-center space-x-4 flex-shrink-0">
          {children}
          <ThemeSelector />
          <UserButton />
        </div>
      </div>
    </header>
  )
}
