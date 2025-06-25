'use client'

import type * as React from 'react'
import { useStickyTop } from './context'

interface StickyRendererProps {
  children: React.ReactNode
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
