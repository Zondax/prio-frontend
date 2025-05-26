'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

interface StickyTopState {
  stickyElement: ReactNode | null
  stickyHeight: string | number
  setStickyElement: (element: ReactNode, height: string | number) => void
  clearStickyElement: () => void
}

const StickyTopContext = createContext<StickyTopState | undefined>(undefined)

export const useStickyTop = () => {
  const context = useContext(StickyTopContext)
  if (context === undefined) {
    throw new Error('useStickyTop must be used within a StickyTopProvider')
  }
  return context
}

export { StickyTopContext } // Exporting context directly if needed for Provider
