'use client'

import { createContext, useContext, useState } from 'react'

export type ViewType = 'timeline' | 'list'

export const TIMELINE_VIEW: ViewType = 'timeline'
export const LIST_VIEW: ViewType = 'list'

interface ViewTypeContextType {
  viewType: ViewType
  toggleViewType: () => void
}

const ViewTypeContext = createContext<ViewTypeContextType | undefined>(undefined)

export function ViewTypeProvider({ children }: { children: React.ReactNode }) {
  const [viewType, setViewType] = useState<ViewType>(TIMELINE_VIEW)

  const toggleViewType = () => {
    setViewType((prev) => (prev === TIMELINE_VIEW ? LIST_VIEW : TIMELINE_VIEW))
  }

  return <ViewTypeContext.Provider value={{ viewType, toggleViewType }}>{children}</ViewTypeContext.Provider>
}

export function useViewType() {
  const context = useContext(ViewTypeContext)
  if (context === undefined) {
    throw new Error('useViewType must be used within a ViewTypeProvider')
  }
  return context
}
