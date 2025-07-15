'use client'

import Link from 'next/link'

interface DevLinkItemProps {
  href?: string
  children?: React.ReactNode
}

/**
 * Embedded wrapper for Dev link component
 */
export function DevLinkItem({ href = '/dev', children = 'Dev' }: DevLinkItemProps) {
  return (
    <Link href={href}>
      <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-primary/90 transition-colors">
        {children}
      </div>
    </Link>
  )
}
