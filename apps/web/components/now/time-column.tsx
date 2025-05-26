'use client'

import { formatTimeWithDayIndicator, getTimezoneDisplay } from '@prio-state/feature/activity'

import { useTimelineLayout } from './timeline-layout-context'

interface TimeColumnProps {
  timeSlots: number[]
  formatTime: (minutes: number) => string
  localTimezone?: string
}

export function TimeColumn({ timeSlots, formatTime, localTimezone }: TimeColumnProps) {
  const { slotHeight, timeColumnWidth: width, gridHeight, headerHeight, topOffset } = useTimelineLayout()

  // Get timezone display
  const timezoneDisplay = getTimezoneDisplay(localTimezone)

  return (
    <div
      className="shrink-0 sticky left-0 bg-background z-40 border-1 border-red-500"
      style={{ width: `${width}px`, height: `${gridHeight}px` }}
    >
      {/* Event list header with timezone */}
      <div className="sticky top-0 left-0 z-50 h-12 bg-background flex items-center justify-end border-1 border-blue-500">
        {timezoneDisplay && <span className="text-xs text-muted-foreground font-medium px-2">{timezoneDisplay}</span>}
      </div>

      <div style={{ height: `${topOffset}px` }} className="border-1 border-green-500" />

      {timeSlots.map((time) => {
        const { displayTime, isNextDay } = formatTimeWithDayIndicator(time, formatTime)

        const isHour = time % 60 === 0
        const textSize = isHour ? 'text-xs' : 'text-[10px]'
        const weight = isHour ? 'font-medium' : 'font-light'
        const textColor = isHour ? 'text-foreground' : 'text-muted-foreground'
        const borderStyle = isHour ? 'border-t border-muted' : ''
        const paddingTop = isHour ? 'pt-1' : 'pt-0'
        const negativeTop = isHour ? '-top-3' : '-top-2'

        return (
          <div key={time} style={{ height: `${slotHeight}px` }} className={`relative flex items-center justify-end ${borderStyle}`}>
            <span
              className={`absolute ${negativeTop} right-0 ${textColor} ${isNextDay ? 'italic' : ''} px-2 ${textSize} ${weight} ${paddingTop} bg-background`}
            >
              {displayTime}
            </span>
          </div>
        )
      })}
    </div>
  )
}
