'use client'

import { useMemo } from 'react'
import { type ContextualItemComponentProps, TriSection } from '@zondax/ui-common'
import Link from 'next/link'

export interface DevLinkItemProps extends ContextualItemComponentProps<`${TriSection}`> {
  href?: string
  children?: React.ReactNode
}

/**
 * Contextual wrapper for Dev link component
 */
export function DevLinkItem({
  locationHook: location,
  section = TriSection.Left,
  priority = 10,
  persistent = true,
  href = '/dev',
  children = 'Dev',
}: DevLinkItemProps) {
  const devLinkComponent = useMemo(() => (
    <Link href={href}>
      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors">
        {children}
      </div>
    </Link>
  ), [href, children])

  location('dev-link', devLinkComponent, section, priority, persistent)

  return null
}
