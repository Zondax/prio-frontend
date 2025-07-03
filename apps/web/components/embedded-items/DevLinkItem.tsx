'use client'

import { TriSection } from '@zondax/ui-common/client'
import type { EmbeddedItemComponentProps } from '@zondax/ui-common/server'
import Link from 'next/link'
import { useMemo } from 'react'

interface DevLinkItemProps<TSection extends string = `${TriSection}`> extends EmbeddedItemComponentProps<TSection> {
  href?: string
  children?: React.ReactNode
}

/**
 * Embedded wrapper for Dev link component
 */
export function DevLinkItem<TSection extends string = `${TriSection}`>({
  locationHook: location,
  section = TriSection.Left as TSection,
  priority = 10,
  persistent = true,
  href = '/dev',
  children = 'Dev',
}: DevLinkItemProps<TSection>) {
  const devLinkComponent = useMemo(
    () => (
      <Link href={href}>
        <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors">
          {children}
        </div>
      </Link>
    ),
    [href, children]
  )

  location('dev-link', devLinkComponent, section, priority, persistent)

  return null
}
