'use client'

import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface LogoProps {
  redirectUrl?: string
}

const lightLogo = '/prio-logo-light.svg'
const darkLogo = '/prio-logo-dark.svg'

export function Logo({ redirectUrl = '/' }: LogoProps) {
  const { resolvedTheme } = useTheme()

  const [logoSrc, setLogoSrc] = useState(lightLogo)
  useEffect(() => {
    setLogoSrc(resolvedTheme === 'dark' ? darkLogo : lightLogo)
  }, [resolvedTheme])

  return (
    // Link styling:
    // - className for flex layout
    // - inline style for height using logoHeight (24px)
    <Link href={redirectUrl} className="flex items-center space-x-3" style={{ height: 'var(--topbar-interactive-element-size)' }}>
      <Image
        src={logoSrc}
        alt="PRIO Logo"
        height={0}
        width={0}
        className="w-auto h-[var(--topbar-interactive-element-size)]"
        style={{ height: 'var(--topbar-interactive-element-size)', width: 'auto' }}
        priority
      />
    </Link>
  )
}
