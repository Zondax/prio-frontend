'use client'

import { TriSection, withContextualItem } from '@zondax/ui-common/client'
import Link from 'next/link'

interface DevLinkProps {
  href?: string
  children?: React.ReactNode
}

function DevLink({ href = '/dev', children = 'Dev' }: DevLinkProps) {
  return (
    <Link href={href}>
      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors">
        {children}
      </div>
    </Link>
  )
}

/**
 * Contextual wrapper for Dev link component
 */
export const DevLinkItem = withContextualItem<typeof DevLink, `${TriSection}`>(DevLink, {
  id: 'dev-link',
  defaultSection: TriSection.Left,
  defaultPriority: 10,
  defaultPersistent: true,
})
