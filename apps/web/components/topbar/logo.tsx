'use client'

import Link from 'next/link'

interface LogoProps {
  redirectUrl?: string
}

export function Logo({ redirectUrl = '/' }: LogoProps) {
  return (
    <Link href={redirectUrl} className="flex items-center space-x-3" style={{ height: 'var(--topbar-interactive-element-size)' }}>
      <span className="text-xl font-bold text-foreground">Kickstarter</span>
    </Link>
  )
}
