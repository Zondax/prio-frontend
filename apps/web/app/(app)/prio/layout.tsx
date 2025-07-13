'use client'

import { UserButton } from '@zondax/auth-web'
import { Breadcrumb, SidebarList, SidebarTree, ThemeToggle, useAppShell, useLeftSidebarItem, useTopBarItem } from '@zondax/ui-common/client'
import { useEffect, useMemo } from 'react'
import { useBreadcrumbData } from './lib/use-breadcrumb-data'
import { NAVIGATION_NODES, RECENT_ACTIVITY_ITEMS } from './store/prio-mock-data'

// Breadcrumb component - now using the enhanced Breadcrumb with data source
function BreadcrumbNavigation() {
  return <Breadcrumb useDataSource={useBreadcrumbData} />
}

export default function PrioLayout({ children }: { children: React.ReactNode }) {
  const appShell = useAppShell()

  // Memoize sidebar content components
  const sidebarHeaderComponent = useMemo(
    () => (
      <div className="pb-2">
        <h2 className="text-lg pl-4 font-semibold">Prio</h2>
      </div>
    ),
    []
  )

  const sidebarContentComponent = useMemo(() => {
    // Create a Set with all node IDs to expand all nodes by default
    const allNodeIds = new Set<string>()
    NAVIGATION_NODES.forEach((node) => {
      allNodeIds.add(node.id)
      if (node.children) {
        node.children.forEach((child) => allNodeIds.add(child.id))
      }
    })

    return (
      <div className="space-y-2">
        {/* Navigation Tree - starts with all nodes expanded */}
        <SidebarTree nodes={NAVIGATION_NODES} persistState={false} expandedNodes={allNodeIds} />

        {/* Recent Activity List */}
        <SidebarList
          title="Recent Activity"
          items={RECENT_ACTIVITY_ITEMS}
          maxItems={4}
          viewAllHref="/activity"
          className="mt-4"
          variant="minimal"
        />
      </div>
    )
  }, [])

  // Use the embedded sidebar system to add content to existing sidebar
  // Now using semantic section locations: start=header, middle=content, end=footer
  useLeftSidebarItem('prio-header', sidebarHeaderComponent, 'start', 5)
  useLeftSidebarItem('prio-navigation', sidebarContentComponent, 'middle', 10)

  const breadcrumbComponent = useMemo(() => <BreadcrumbNavigation />, [])
  const themeToggleComponent = useMemo(() => <ThemeToggle />, [])
  const userButtonComponent = useMemo(() => <UserButton />, [])

  useTopBarItem('prio-breadcrumb', breadcrumbComponent, 'start', 5)
  useTopBarItem('theme-toggle', themeToggleComponent, 'end', 10)
  useTopBarItem('user-button', userButtonComponent, 'end', 20)

  // Setup AppShell to show both sidebars
  useEffect(() => {
    // Enable left sidebar
    appShell.setLeftSidebar({
      enabled: true,
      component: null, // Use embedded components instead
      collapsible: true,
      defaultOpen: true,
    })

    // Enable right sidebar (will be populated by child pages if needed)
    appShell.setRightSidebar({
      enabled: true,
      component: null, // Use embedded components instead
      collapsible: true,
      defaultOpen: false,
    })

    // Cleanup on unmount
    // return () => {}
    // The embedded items will be automatically cleaned up by useLeftSidebarItem
    // Only reset sidebar configuration if needed for this specific layout    }
  }, [appShell.setLeftSidebar, appShell.setRightSidebar])

  return <>{children}</>
}
