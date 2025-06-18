'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useIsClientSide } from '@/hooks/use-is-client'
import { cn } from '@/lib/utils'
import type { TopBarItems } from '.'

interface NavDesktopProps {
  menuItems: TopBarItems
  isVisible?: boolean
  onOverflowChange?: (visible: boolean) => void
}

export function NavDesktop({ menuItems, isVisible = true, onOverflowChange }: NavDesktopProps) {
  const isClient = useIsClientSide()

  const pathname = usePathname()
  const router = useRouter()
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  const navElementRef = useRef<HTMLElement>(null) // Ref for the <nav> element
  const itemsContainerRef = useRef<HTMLDivElement>(null) // Ref for the <ToggleGroup>

  // Remove pulse when the route changes
  useEffect(() => {
    if (pendingHref && pathname === pendingHref) {
      setPendingHref(null)
    }
  }, [pathname, pendingHref])

  // Find the active nav item by checking if the current path includes the item's href
  const activeHref = useMemo(() => {
    // Sort items by href length in descending order to match the most specific route first
    const sortedItems = [...menuItems].sort((a, b) => b.href.length - a.href.length)
    const activeItem = sortedItems.find((item) => pathname.includes(item.href))
    return activeItem?.href || pathname
  }, [pathname, menuItems])

  const handlePush = (val: string | undefined) => {
    if (val && val !== pathname) {
      setPendingHref(val)
      router.push(val)
    }
  }

  const measureOverflow = useCallback(() => {
    const parent = navElementRef.current?.parentElement
    if (itemsContainerRef.current && parent) {
      const contentW = itemsContainerRef.current.scrollWidth
      const availW = parent.clientWidth
      const buffer = 1
      const visible = contentW <= availW - buffer
      onOverflowChange?.(visible)
    }
  }, [onOverflowChange])

  useEffect(() => {
    if (!isClient || menuItems.length === 0) {
      onOverflowChange?.(false)
      return
    }

    // Initial check now that refs should be available
    measureOverflow()

    const navNode = navElementRef.current
    if (!navNode) return

    const containerToObserve = navNode.parentElement // Observe direct parent of nav
    if (!containerToObserve) return

    const resizeObserver = new ResizeObserver(() => {
      measureOverflow()
    })
    resizeObserver.observe(containerToObserve)

    return () => {
      resizeObserver.unobserve(containerToObserve)
      resizeObserver.disconnect()
    }
  }, [isClient, menuItems.length, measureOverflow, onOverflowChange])

  if (!isClient || menuItems.length === 0) return null

  return (
    <nav
      ref={navElementRef}
      className="flex items-center"
      style={{
        visibility: isVisible ? 'visible' : 'hidden',
        height: isVisible ? 'auto' : '0px',
        overflow: 'hidden',
        // Using transition for smoother visibility changes
        transition: 'visibility 0.2s, height 0.2s',
      }}
    >
      <ToggleGroup
        ref={itemsContainerRef}
        type="single"
        value={activeHref}
        onValueChange={handlePush}
        className="flex w-auto pl-2 pr-2 rounded-full bg-muted px-4"
      >
        {menuItems.map((item, _index) => {
          const isActive = pathname.includes(item.href)
          const isPending = pendingHref === item.href && !isActive

          return (
            <ToggleGroupItem
              key={item.key}
              value={item.href}
              aria-label={item.name}
              className={cn(
                'font-normal data-[state=on]:font-bold data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground hover:text-foreground/60 mx-2 flex items-center justify-center'
              )}
              asChild
            >
              <Link href={item.href}>
                <span className={isPending ? 'animate-pulse' : ''}>{item.name}</span>
              </Link>
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
    </nav>
  )
}
