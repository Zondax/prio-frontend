import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useTimelineLayout } from './timeline-layout-context'

interface TimeGridProps {
  timeSlots: number[]
}

export function TimeGrid({ timeSlots }: TimeGridProps) {
  const { slotHeight, topOffset, headerHeight } = useTimelineLayout()

  return (
    <View style={[styles.container, { top: topOffset + headerHeight }]} className="absolute inset-0">
      {timeSlots.map((_, index) => (
        <View key={index} style={[styles.timeSlot, { top: index * slotHeight }]} className="border-t border-border" />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  timeSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
})
