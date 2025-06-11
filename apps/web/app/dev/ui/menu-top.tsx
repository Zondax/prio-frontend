'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDownIcon } from 'lucide-react'
import Link from 'next/link'

// Define new types for grouped links
export type MockLink = {
  name: string
  href: string
  children?: undefined // Explicitly undefined for simple links
}

export type MenuGroup = {
  name: string
  href?: undefined // Groups don't have a direct href
  children: MockLink[]
  key?: string // Add optional key property
}

export type NavItem = MockLink | MenuGroup

// Restructure mockDevLinks
export const mockDevLinks: NavItem[] = [
  {
    name: 'Prio Components',
    children: [
      { name: 'Empty', href: '/dev/ui/empty' },
      { name: 'Logos', href: '/dev/ui/logos' },
      { name: 'Topbar', href: '/dev/ui/topbar' },
      { name: 'Topbar Custom', href: '/dev/ui/topbar-custom' },
      { name: 'Navigation', href: '/dev/ui/navigation' },
      { name: 'Theme Toggle', href: '/dev/ui/theme-toggle' },
      { name: 'Card Promo', href: '/dev/ui/promo-card' },
      { name: 'Event Card', href: '/dev/ui/event-card' },
      { name: 'Share Dialog', href: '/dev/ui/share' },
      { name: 'Sort Selector', href: '/dev/ui/sort-selector' },
      { name: 'Tag Selector', href: '/dev/ui/tag-selector' },
      { name: 'Multiselection', href: '/dev/ui/multiselection-bar' },
    ],
  },
  {
    name: 'View & Layout',
    children: [
      { name: 'View Grid 1', href: '/dev/ui/view-grid' },
      { name: 'View Grid 2', href: '/dev/ui/view-grid-2' },
      { name: 'Explore - View Grid', href: '/dev/ui/explore-view-grid' },
      { name: 'Explore - View Map', href: '/dev/ui/explore-view-map' },
      { name: 'Explore - Map Web', href: '/dev/ui/explore-map-web' },
      { name: 'Map - Marker', href: '/dev/ui/map-marker' },
    ],
  },
  {
    name: 'Filters',
    children: [
      { name: 'Filterbar', href: '/dev/ui/filterbar' },
      { name: 'Filter Tags Utilities', href: '/dev/ui/filter-tags' },
    ],
  },
  {
    name: 'Shadcn UI',
    children: [
      { name: 'Buttons', href: '/dev/ui/buttons' },
      { name: 'Forms & Inputs', href: '/dev/ui/forms-inputs' },
      { name: 'Displays', href: '/dev/ui/displays' },
    ],
  },
]

export function DevTopMenu() {
  // TODO: Replace with usePathname() from 'next/navigation' for dynamic active state
  const pathname = ''

  return (
    <div className="border-b p-2 bg-muted overflow-x-auto">
      <div className="flex space-x-2 min-w-max">
        {mockDevLinks.map((item, _index) => {
          // Use a more explicit type guard
          if ('href' in item && item.href !== undefined) {
            // It's a MockLink
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1 rounded-md text-sm ${
                  pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted-foreground/10'
                }`}
              >
                {item.name}
              </Link>
            )
          }
          // It's a MenuGroup (or theoretically null if types were different)
          if ('children' in item && item.children !== undefined) {
            return (
              <DropdownMenu key={item.key || item.name}>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-md text-sm flex items-center space-x-1 hover:bg-muted-foreground/10 ${
                      item.children.some((child) => pathname === child.href) ? 'bg-primary text-primary-foreground' : ''
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {item.children.map((childLink) => (
                    <DropdownMenuItem key={childLink.href} asChild>
                      <Link href={childLink.href} className={`w-full ${pathname === childLink.href ? 'bg-accent' : ''}`}>
                        {childLink.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }
          return null // Add a fallback return for exhaustive checks
        })}
      </div>
    </div>
  )
}
