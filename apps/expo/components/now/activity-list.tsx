import type { Activity } from '@prio-state'
import { Image } from 'expo-image'
import { ChevronDown, ChevronUp } from 'lucide-react-native'
import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'

import { cn } from '@/lib/utils'

import { useTimelineLayout } from './timeline-layout-context'

interface ActivityListProps {
  activities?: Activity[]
  isLoading: boolean
  expandedActivityId: string | null
  toggleEventDetails: (eventId: string) => void
  renderActivityButton?: (activity: Activity, isExpanded: boolean, onClick: () => void) => React.ReactNode
  headerScrollRef?: React.RefObject<ScrollView>
}

export function ActivityList({
  activities = [],
  isLoading,
  expandedActivityId,
  toggleEventDetails,
  renderActivityButton,
  headerScrollRef,
}: ActivityListProps) {
  const { columnWidth, columnGap, headerHeight } = useTimelineLayout()

  if (isLoading) {
    return (
      <View style={[styles.headerContainer, { height: headerHeight }]} className="bg-background border-b border-border">
        <View
          key="activity-skeleton-0"
          style={[
            styles.skeletonHeaderItem,
            {
              width: columnWidth,
              marginLeft: 0, // First item has no left margin
            },
          ]}
          className="animate-pulse bg-muted"
        />
        <View
          key="activity-skeleton-1"
          style={[
            styles.skeletonHeaderItem,
            {
              width: columnWidth,
              marginLeft: columnGap, // Second item has left margin
            },
          ]}
          className="animate-pulse bg-muted"
        />
      </View>
    )
  }

  return (
    <ScrollView
      ref={headerScrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.headerContainer, { height: headerHeight }]}
      className="bg-background border-b border-border"
    >
      {activities.map((activity, index) => {
        const event = activity.getEvent()
        if (!event) return null

        const isExpanded = expandedActivityId === activity.getId()
        const title = event.getTitle()
        const imageUrl = event.getImage()

        const handlePress = () => toggleEventDetails(activity.getId())

        if (renderActivityButton) {
          return (
            <View
              key={activity.getId()}
              style={[
                styles.activityButtonContainer,
                {
                  width: columnWidth,
                  marginLeft: index > 0 ? columnGap : 0,
                },
              ]}
            >
              {renderActivityButton(activity, isExpanded, handlePress)}
            </View>
          )
        }

        return (
          <Button
            key={activity.getId()}
            variant="ghost"
            style={[
              styles.activityButton,
              {
                width: columnWidth,
                marginLeft: index > 0 ? columnGap : 0,
              },
            ]}
            className={cn('h-full px-2', isExpanded && 'bg-muted')}
            onPress={handlePress}
          >
            <View style={styles.activityButtonContent}>
              <View style={styles.activityImageAndTitle}>
                {imageUrl && (
                  <View style={styles.activityImageContainer} className="overflow-hidden rounded">
                    <Image source={{ uri: imageUrl }} style={styles.activityImage} contentFit="cover" />
                  </View>
                )}
                <Text className="text-sm font-medium text-foreground flex-shrink" numberOfLines={1}>
                  {title}
                </Text>
              </View>
              <View style={styles.chevronContainer}>
                {isExpanded ? (
                  <ChevronUp size={16} className="text-muted-foreground" />
                ) : (
                  <ChevronDown size={16} className="text-muted-foreground" />
                )}
              </View>
            </View>
          </Button>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  skeletonHeaderItem: {
    height: 36,
    borderRadius: 6,
    opacity: 0.7,
    marginBottom: 6,
  },
  activityButtonContainer: {
    height: '100%',
    flexShrink: 0,
  },
  activityButton: {
    height: '100%',
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  activityButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  activityImageAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  activityImageContainer: {
    height: 20,
    width: 20,
    borderRadius: 4,
    flexShrink: 0,
  },
  activityImage: {
    width: '100%',
    height: '100%',
  },
  chevronContainer: {
    flexShrink: 0,
  },
})
