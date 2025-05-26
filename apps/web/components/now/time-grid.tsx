'use client'

import { useTimelineLayout } from './timeline-layout-context'

interface TimeGridProps {
  timeSlots: number[]
}

export function TimeGrid({ timeSlots }: TimeGridProps) {
  const { slotHeight, gridWidth, topOffset, headerHeight } = useTimelineLayout()

  return (
    <div className="absolute inset-0" style={{ top: `${topOffset + headerHeight}px` }}>
      {timeSlots.map((time) => (
        <div key={time} style={{ height: `${slotHeight}px`, width: gridWidth }} className="border-t border-muted" />
      ))}
    </div>
  )
}
