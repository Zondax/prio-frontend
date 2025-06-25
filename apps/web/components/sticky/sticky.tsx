'use client'

import * as React from 'react'
import { useStickyTop } from './context'

interface StickyProps {
  children: React.ReactNode
  stickyHeight: string | number // e.g., '3rem', 50 (for px)
}

export function Sticky({ children, stickyHeight }: StickyProps) {
  const { setStickyElement, clearStickyElement } = useStickyTop()

  React.useEffect(() => {
    // Use the passed children and stickyHeight to set the sticky element
    setStickyElement(children, stickyHeight)

    // Cleanup function to clear the sticky element when this component unmounts
    // or when children/stickyHeight change causing the effect to re-run.
    return () => {
      clearStickyElement()
    }
  }, [children, stickyHeight, setStickyElement, clearStickyElement])

  // This component now only registers its children to be sticky;
  // it doesn't render anything itself in the document flow.
  return null
}
