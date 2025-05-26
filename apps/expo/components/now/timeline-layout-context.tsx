import type React from 'react'
import { createContext, useContext } from 'react'

interface TimelineLayoutContextValue {
  slotHeight: number
  slotDurationMinutes: number
  eventWidth: number
  columnWidth: number
  gridWidth: number | string
  gridHeight: number
  topOffset: number
  headerHeight: number
  headerBottomSpacing: number
  timeColumnWidth: number
  eventSpacing: number
  showSlotTime: boolean
  columnGap: number
}

const TimelineLayoutContext = createContext<TimelineLayoutContextValue>({
  slotHeight: 40,
  slotDurationMinutes: 60,
  eventWidth: 100,
  columnWidth: 100,
  gridWidth: '100%',
  gridHeight: 0,
  topOffset: 16,
  headerHeight: 40,
  headerBottomSpacing: 4,
  timeColumnWidth: 45,
  eventSpacing: 8,
  showSlotTime: false,
  columnGap: 12,
})

export const useTimelineLayout = () => useContext(TimelineLayoutContext)

interface TimelineLayoutProviderProps {
  value: TimelineLayoutContextValue
  children: React.ReactNode
}

export const TimelineLayoutProvider: React.FC<TimelineLayoutProviderProps> = ({ value, children }) => {
  return <TimelineLayoutContext.Provider value={value}>{children}</TimelineLayoutContext.Provider>
}
