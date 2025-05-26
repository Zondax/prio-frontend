'use client'

import type { ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { StickyTopContext } from './sticky-top-context'

interface StickyTopProviderProps {
  children: ReactNode
}

export function StickyTopProvider({ children }: StickyTopProviderProps) {
  const [stickyElement, setStickyElementState] = useState<ReactNode | null>(null)
  const [stickyHeight, setStickyHeightState] = useState<string | number>('0px')

  const setStickyElement = useCallback((element: ReactNode, height: string | number) => {
    setStickyElementState(element)
    setStickyHeightState(height)
  }, [])

  const clearStickyElement = useCallback(() => {
    setStickyElementState(null)
    setStickyHeightState('0px')
  }, [])

  const contextValue = useMemo(
    () => ({
      stickyElement,
      stickyHeight,
      setStickyElement,
      clearStickyElement,
    }),
    [stickyElement, stickyHeight, setStickyElement, clearStickyElement]
  )

  return <StickyTopContext.Provider value={contextValue}>{children}</StickyTopContext.Provider>
}
