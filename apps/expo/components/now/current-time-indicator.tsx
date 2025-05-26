import { differenceInMinutes, format, startOfDay } from 'date-fns'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { cn } from '@/lib/utils'

import { useTimelineLayout } from './timeline-layout-context'

// Debug mode - set to true to use a fixed time
const DEBUG_MODE = false
const DEBUG_TIME = new Date('2023-10-15T14:30:00') // Set your desired debug time here

interface CurrentTimeIndicatorProps {
  slotHeight: number
  slotDurationMinutes: number
}

export const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ slotHeight, slotDurationMinutes }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const indicatorRef = useRef<View>(null)
  const animationFrameRef = useRef<number | null>(null)
  const { timeColumnWidth, headerHeight, topOffset } = useTimelineLayout()

  const updateIndicatorPosition = () => {
    if (!indicatorRef.current) return

    const now = DEBUG_MODE ? DEBUG_TIME : currentTime
    const startOfCurrentDay = startOfDay(now)
    const minutesSinceMidnight = differenceInMinutes(now, startOfCurrentDay)
    const position = (minutesSinceMidnight / slotDurationMinutes) * slotHeight

    indicatorRef.current.setNativeProps({
      style: {
        top: headerHeight + topOffset + position,
      },
    })
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
  const formatTime = (date: Date) => format(date, 'h:mm a')

  return (
    <View
      ref={indicatorRef}
      style={[
        styles.container,
        {
          top: headerHeight + topOffset,
          left: 0,
        },
      ]}
      className={cn('w-full h-0.5 flex-row items-center z-30', DEBUG_MODE ? 'bg-blue-500' : 'bg-destructive')}
    >
      <View
        style={{ marginTop: -10 }}
        className={cn('absolute left-0 px-1 py-0.5 rounded shadow-sm z-30', DEBUG_MODE ? 'bg-blue-700' : 'bg-destructive/80')}
      >
        <Text className="text-white text-xs">{formatTime(DEBUG_MODE ? DEBUG_TIME : currentTime)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
