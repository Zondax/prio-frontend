'use client'

import { UserButton } from '@zondax/auth-web'
import { ThemeToggle, useTopBarItem, WebShell } from '@zondax/ui-common/client'
import { useMemo } from 'react'
import { LogoItem } from '../../components/LogoItem'

function SiteTopBarItems() {
  const logoComponent = useMemo(() => <LogoItem />, [])
  const themeToggleComponent = useMemo(() => <ThemeToggle />, [])
  const userButtonComponent = useMemo(() => <UserButton />, [])

  useTopBarItem('logo', logoComponent, 'start', 0)
  useTopBarItem('theme-toggle', themeToggleComponent, 'end', 10)
  useTopBarItem('user-button', userButtonComponent, 'end', 20)

  return null
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <WebShell topBar={{ sticky: true }}>
      <SiteTopBarItems />
      {children}
    </WebShell>
  )
}
