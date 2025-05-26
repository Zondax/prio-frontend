import { formatTimeWithDayIndicator, getTimezoneDisplay } from '@prio-state/feature/activity'
import { formatTimeWithTimezone } from '@prio-state/utils'
import type React from 'react'
import { forwardRef } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { useTimelineLayout } from './timeline-layout-context'

interface TimeColumnProps {
  timeSlots: number[]
  formatTime: (minutes: number) => string
  localTimezone?: string
  scrollRef?: React.RefObject<ScrollView>
  showRawTimezone?: boolean
}

export const TimeColumn = forwardRef<ScrollView, TimeColumnProps>(
  ({ timeSlots, formatTime, localTimezone, scrollRef, showRawTimezone = false }, _ref) => {
    const { slotHeight, timeColumnWidth, gridHeight, headerHeight, topOffset } = useTimelineLayout()

    // Get timezone display - using either the method from context or directly from formatTimeWithTimezone
    let timezoneDisplay: string | undefined

    if (showRawTimezone && localTimezone) {
      timezoneDisplay = formatTimeWithTimezone(new Date(), localTimezone).split(' ').pop()?.slice(1, -1)
    } else {
      timezoneDisplay = getTimezoneDisplay(localTimezone)
    }

    return (
      <View style={[styles.container, { top: topOffset + headerHeight, width: timeColumnWidth }]} className="bg-background z-40">
        {/* Scrollable time indicators */}
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{ height: gridHeight }}
          className="flex-1"
        >
          {timeSlots.map((time) => {
            const { displayTime, isNextDay } = formatTimeWithDayIndicator(time, formatTime)

            const isHour = time % 60 === 0
            const textSize = isHour ? 'text-xs' : 'text-[10px]'
            const weight = isHour ? 'font-medium' : 'font-light'
            const textColor = isHour ? 'text-foreground' : 'text-muted-foreground'
            const paddingTop = isHour ? 'pt-1' : 'pt-0'
            const negativeTop = isHour ? -10 : -4

            return (
              <View key={time} style={{ height: slotHeight }} className={'relative flex-row items-center justify-end'}>
                <Text
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: negativeTop,
                  }}
                  className={`${textColor} ${isNextDay ? 'italic' : ''} px-2 ${textSize} ${weight} ${paddingTop}`}
                  numberOfLines={1}
                >
                  {displayTime}
                </Text>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }
)

TimeColumn.displayName = 'TimeColumn'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 40,
  },
})
