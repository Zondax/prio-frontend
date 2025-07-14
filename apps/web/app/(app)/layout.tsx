'use client'

import { UserButton } from '@zondax/auth-web'
import { AppShell, BarLayoutPosition, type ChromeConfig, SidebarVariant, ThemeToggle, useTopBarItem } from '@zondax/ui-common/client'
import { useMemo } from 'react'

// Inline AppTopBarItems component
function AppTopBarItems() {
  const themeToggleComponent = useMemo(() => <ThemeToggle />, [])
  const userButtonComponent = useMemo(() => <UserButton />, [])
  useTopBarItem('theme-toggle', themeToggleComponent, 'end', 10)
  useTopBarItem('user-button', userButtonComponent, 'end', 20)

  return null
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // const { isLoaded, isSignedIn } = useUser() // Temporarily disabled for development

  // Show loading state while checking authentication (temporarily disabled for development)
  // if (!isLoaded) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <p className="text-lg text-muted-foreground">Loading authentication...</p>
  //         <p className="text-sm text-muted-foreground mt-2">If this persists, check your auth configuration</p>
  //       </div>
  //     </div>
  //   )
  // }

  // Redirect to home if user is loaded but not signed in (temporarily disabled for development)
  // if (isLoaded && !isSignedIn) {
  //   redirect('/')
  //   return null
  // }

  // Configure the chrome for the app
  const chromeConfig: ChromeConfig = {
    topBar: {
      sticky: true,
      layout: BarLayoutPosition.Content,
    },
    leftSidebar: {
      enabled: true,
      collapsible: true,
      defaultOpen: true,
      variant: SidebarVariant.Sidebar,
      side: 'left',
    },
    rightSidebar: {
      enabled: false,
      collapsible: true,
      defaultOpen: true,
      variant: SidebarVariant.Sidebar,
      side: 'right',
    },
    statusBar: {
      layout: BarLayoutPosition.Wide,
    },
    commandPalette: {
      enabled: false,
    },
  }

  return (
    <AppShell
      chrome={chromeConfig}
      responsive={{
        mobile: 'simplified',
        containerQueries: true,
      }}
    >
      <AppTopBarItems />
      {children}
    </AppShell>
  )
}
