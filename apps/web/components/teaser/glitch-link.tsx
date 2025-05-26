'use client'

import Link from 'next/link'

import styles from './glitch-text.module.css'

interface GlitchLinkProps {
  href: string
  children: React.ReactNode
}

export function GlitchLink({ href, children }: GlitchLinkProps) {
  return (
    <Link href={href} className={styles.glitchContainer}>
      <h2 className={styles.glitchText}>
        {children}
        <span aria-hidden="true">{children}</span>
        <span aria-hidden="true">{children}</span>
      </h2>
    </Link>
  )
}
