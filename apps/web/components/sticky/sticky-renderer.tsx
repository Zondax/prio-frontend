'use client'

import type { ReactNode } from 'react'
import { useStickyTop } from './sticky-top-context'

interface StickyRendererProps {
  children: ReactNode
}

export function StickyRenderer({ children }: StickyRendererProps) {
  const { stickyElement, stickyHeight } = useStickyTop()

  return (
    <div className="relative">
      {stickyElement && (
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
          }}
        >
          {stickyElement}
        </div>
      )}
      <div style={{ paddingTop: stickyElement ? stickyHeight : 0 }}>{children}</div>
    </div>
  )
}
