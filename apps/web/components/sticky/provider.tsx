'use client'

import type { ReactNode } from 'react'
import * as React from 'react'
import { StickyTopContext } from './context'

interface StickyTopProviderProps {
  children: ReactNode
}

export function StickyTopProvider({ children }: StickyTopProviderProps) {
  const [stickyElement, setStickyElementState] = React.useState<ReactNode | null>(null)
  const [stickyHeight, setStickyHeightState] = React.useState<string | number>('0px')

  const setStickyElement = React.useCallback((element: ReactNode, height: string | number) => {
    setStickyElementState(element)
    setStickyHeightState(height)
  }, [])

  const clearStickyElement = React.useCallback(() => {
    setStickyElementState(null)
    setStickyHeightState('0px')
  }, [])

  const contextValue = React.useMemo(
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
