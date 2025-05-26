// Import from the correct module
import type { Activity, Event } from '@prio-state'
import type React from 'react'
import { Dimensions, StyleSheet, Text, View, type ViewStyle } from 'react-native'

import { useTimelineLayout } from './timeline-layout-context'

interface ActivityDetailsProps {
  selectedActivity: Activity | null
  renderActivityDetails?: (event: Event) => React.ReactNode
  onClose: () => void
}

export function ActivityDetails({ selectedActivity, renderActivityDetails, onClose }: ActivityDetailsProps) {
  const { timeColumnWidth } = useTimelineLayout()

  if (!selectedActivity) return null

  const event = selectedActivity.getEvent()
  if (!event) return null

  const title = event.getTitle()
  const description = event.getDescription()

  // Calculate position based on screen width
  const screenWidth = Dimensions.get('window').width
  const containerWidth = Math.min(352, screenWidth - 32) // Max width of 352px (22rem) with 16px padding on each side
  const leftPosition = Math.max(timeColumnWidth + 16, (screenWidth - containerWidth) / 2)

  const containerStyle: ViewStyle = {
    left: leftPosition,
    width: containerWidth,
  }

  return (
    <>
      {/* Add overlay */}
      <View style={styles.overlay} className="bg-background/80" onTouchStart={onClose} />

      {/* Prevent panel clicks from bubbling to overlay */}
      <View style={[styles.container, containerStyle]} onTouchStart={(e) => e.stopPropagation()}>
        {renderActivityDetails ? (
          renderActivityDetails(event)
        ) : (
          <>
            <Text className="font-medium mb-1 text-foreground">{title}</Text>
            {description && <Text className="text-sm text-muted-foreground">{description}</Text>}
          </>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 51, // Higher than overlay
    maxWidth: 300, // ~22rem
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
})
