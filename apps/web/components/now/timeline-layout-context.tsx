'use client'

import { type ReactNode, createContext, useContext } from 'react'

interface TimelineLayoutContextType {
  // Layout dimensions
  slotHeight: number
  slotDurationMinutes: number
  eventWidth: number
  columnWidth: number | string
  gridWidth: string
  gridHeight: number
  topOffset: number
  // Configuration constants
  headerHeight: number // Renamed from EVENT_LIST_HEIGHT
  timeColumnWidth: number // Renamed from TIME_COLUMN_WIDTH
  eventSpacing: number // Renamed from EVENT_SPACING

  // Display options
  showSlotTime: boolean
  columnGap: number
}

// Create context with default values (these will be overridden by the provider)
const TimelineLayoutContext = createContext<TimelineLayoutContextType>({
  slotHeight: 48,
  slotDurationMinutes: 60,
  eventWidth: 120,
  columnWidth: 130, // Default assumption: eventWidth + eventSpacing
  gridWidth: '100%',
  gridHeight: 0,
  headerHeight: 48,
  topOffset: 0,
  timeColumnWidth: 48,
  eventSpacing: 10,
  showSlotTime: false,
  columnGap: 16,
})

interface TimelineLayoutProviderProps {
  children: ReactNode
  value: TimelineLayoutContextType
}

export function TimelineLayoutProvider({ children, value }: TimelineLayoutProviderProps) {
  return <TimelineLayoutContext.Provider value={value}>{children}</TimelineLayoutContext.Provider>
}

// Custom hook to use the layout context
export function useTimelineLayout() {
  const context = useContext(TimelineLayoutContext)

  if (context === undefined) {
    throw new Error('useTimelineLayout must be used within a TimelineLayoutProvider')
  }

  return context
}
