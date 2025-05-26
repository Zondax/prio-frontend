'use client'

import { differenceInMinutes, format, getSeconds, startOfDay } from 'date-fns'
import { secondsInMinute } from 'date-fns/constants'
import { useEffect, useRef, useState } from 'react'

import { useTimelineLayout } from './timeline-layout-context'

// Debug mode - set to true to use a fixed time
const DEBUG_MODE = false
const DEBUG_TIME = new Date('2023-10-15T14:30:00') // Set your desired debug time here

interface CurrentTimeIndicatorProps {
  slotHeight: number
  slotDurationMinutes: number
}

export function CurrentTimeIndicator({ slotHeight, slotDurationMinutes }: CurrentTimeIndicatorProps) {
  const [currentTime, setCurrentTime] = useState(DEBUG_MODE ? DEBUG_TIME : new Date())
  const indicatorRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const { headerHeight, topOffset } = useTimelineLayout()

  // Update the time indicator position
  const updateIndicatorPosition = () => {
    if (!indicatorRef.current) return

    const now = DEBUG_MODE ? DEBUG_TIME : new Date()
    const dayStart = startOfDay(now)
    const minutesSinceStartOfDay = differenceInMinutes(now, dayStart)
    const secondsSinceStartOfMinute = getSeconds(now) / secondsInMinute // Convert seconds to fraction of a minute using date-fns constant

    // Calculate position based on slot duration
    const slotIndex = Math.floor(minutesSinceStartOfDay / slotDurationMinutes)
    const minutesIntoCurrentSlot = (minutesSinceStartOfDay % slotDurationMinutes) + secondsSinceStartOfMinute
    const percentIntoCurrentSlot = minutesIntoCurrentSlot / slotDurationMinutes

    // Calculate the top position with padding adjustment
    const topPosition = (slotIndex + percentIntoCurrentSlot) * slotHeight + headerHeight + topOffset

    indicatorRef.current.style.top = `${topPosition}px`
  }

  useEffect(() => {
    if (DEBUG_MODE) {
      // In debug mode, just position the indicator once
      updateIndicatorPosition()
      return
    }

    // Function to update the clock using requestAnimationFrame
    const updateClock = () => {
      setCurrentTime(new Date())
      updateIndicatorPosition()

      // Schedule the next update
      animationFrameRef.current = requestAnimationFrame(updateClock)
    }

    // Start the animation
    animationFrameRef.current = requestAnimationFrame(updateClock)

    // Cleanup function
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [slotHeight, slotDurationMinutes])

  // Format time for display using date-fns
  const formatTime = (date: Date) => format(date, 'HH:mm')

  return (
    <div
      ref={indicatorRef}
      className={`absolute left-0 w-full ${DEBUG_MODE ? 'bg-blue-500' : 'bg-red-500'} flex items-center z-30`}
      style={{ top: `${headerHeight + topOffset}px`, height: '2px' }}
    >
      <div
        className={
          'inline-flex items-center rounded-full border border-red-200 bg-red-100 text-red-700 dark:bg-red-950 dark:border-red-800 dark:text-red-300 px-1.5 py-0.5 text-[10px] font-medium shadow-sm absolute z-30'
        }
        style={{ left: '0px' }}
      >
        {formatTime(DEBUG_MODE ? DEBUG_TIME : currentTime)}
      </div>
    </div>
  )
}
