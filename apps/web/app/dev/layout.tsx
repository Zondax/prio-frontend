'use client'

import { CustomUserButton } from '@zondax/auth-web'
import { AppShell, BarLayoutPosition, type ChromeConfig, ThemeToggle, useTopBarItem } from '@zondax/ui-web/client'
import Link from 'next/link'
import { useMemo } from 'react'
import { DevLinkItem } from '@/components/DevLinkItem'
import EndpointSelectorItem from '@/components/EndpointSelectorItem'

function DevTopBarItems() {
  const logoComponent = useMemo(
    () => (
      <Link href="/" className="flex items-center">
        <span className="text-xl font-bold">Prio</span>
      </Link>
    ),
    []
  )
  const devLinkComponent = useMemo(() => <DevLinkItem />, [])
  const endpointComponent = useMemo(() => <EndpointSelectorItem showWhenAuthenticated={true} />, [])
  const themeToggleComponent = useMemo(() => <ThemeToggle />, [])
  const userButtonComponent = useMemo(() => <CustomUserButton />, [])

  useTopBarItem('logo', logoComponent, 'start', 0)
  useTopBarItem('dev-link', devLinkComponent, 'start', 10)
  useTopBarItem('endpoint-selector', endpointComponent, 'end', 5)
  useTopBarItem('theme-toggle', themeToggleComponent, 'end', 10)
  useTopBarItem('user-button', userButtonComponent, 'end', 20)

  return null
}

export default function DevLayout({ children }: { children: React.ReactNode }) {
  const chromeConfig: ChromeConfig = {
    topBar: {
      enabled: true,
      sticky: false,
      layout: BarLayoutPosition.Content,
    },
    leftSidebar: {
      enabled: false,
    },
    rightSidebar: {
      enabled: false,
    },
    statusBar: {
      enabled: false,
    },
    commandPalette: {
      enabled: true,
    },
  }

  return (
    <AppShell chrome={chromeConfig} responsive={{ mobile: 'simplified', containerQueries: true }}>
      <DevTopBarItems />
      {children}
    </AppShell>
  )
}
