'use client'

import { ThemeProvider, TopBarProvider } from '@zondax/ui-common/client'
import type { ReactNode } from 'react'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <TopBarProvider>{children}</TopBarProvider>
    </ThemeProvider>
  )
}
