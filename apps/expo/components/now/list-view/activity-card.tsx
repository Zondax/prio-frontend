'use client'

import { isActivityHappeningSoon } from '@prio-state/feature/activity'
import type { Event } from '@prio-state/stores/event'
import { getGoogleMapsLink } from '@prio-state/utils'
import { formatTimeWithTimezone } from '@prio-state/utils/time'
import { formatDistanceToNow } from 'date-fns'
import { Image } from 'expo-image'
import { Calendar, Clock, ExternalLink, MapPin } from 'lucide-react-native'
import React from 'react'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

interface ActivityCardProps {
  event: Event
  onEventClick: (event: Event) => void
  onEventMouseEnter?: (event: Event) => void
  onEventMouseLeave?: () => void
  isHovered?: boolean
}

export function ActivityCard({ event, onEventClick, onEventMouseEnter, onEventMouseLeave, isHovered = false }: ActivityCardProps) {
  const title = event.getTitle()
  const description = event.getDescription()
  const eventDate = event.getDate()?.getStart()?.toDate()
  const eventEndDate = event.getDate()?.getEnd()?.toDate()
  const localTimeZone = event.getDate()?.getLocalTimezone()
  const startTime = formatTimeWithTimezone(eventDate || new Date(), localTimeZone)
  const endTime = eventEndDate ? formatTimeWithTimezone(eventEndDate, localTimeZone) : ''
  const location = event.getLocation()?.getCoordinates()?.toString() || ''
  const imageUrl = event.getImage()
  const eventSource = event.getSource()
  const sourceName = eventSource?.getName() || ''
  const sourceUrl = eventSource?.getUrl() || ''

  // Calculate how soon the event is (e.g., "in 30 minutes", "in 2 hours")
  const timeFromNow = eventDate ? formatDistanceToNow(eventDate, { addSuffix: true }) : ''

  // Determine if event is happening soon (within 1 hour)
  const isHappeningSoon = isActivityHappeningSoon(eventDate)

  const handlePress = () => {
    onEventClick(event)
  }

  const handlePressIn = () => {
    if (onEventMouseEnter) {
      onEventMouseEnter(event)
    }
  }

  const handlePressOut = () => {
    if (onEventMouseLeave) {
      onEventMouseLeave()
    }
  }

  const handleSourcePress = () => {
    if (sourceUrl) {
      Linking.openURL(sourceUrl)
    }
  }

  const handleLocationPress = () => {
    if (location) {
      Linking.openURL(getGoogleMapsLink(location))
    }
  }

  return (
    <Card className={cn('my-2 overflow-hidden', isHappeningSoon && 'border-2 border-primary', isHovered && 'border-2 border-primary')}>
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={styles.container}>
          {/* Left side: Image with time information */}
          <View style={styles.leftContainer}>
            {/* Start time displayed above the image */}
            <View style={styles.startTimeContainer}>
              <Text className="text-[10px] font-medium text-foreground">{startTime}</Text>
            </View>

            {imageUrl ? (
              <View style={styles.imageContainer}>
                <Image source={imageUrl} contentFit="cover" style={styles.image} transition={200} />
                {isHappeningSoon && (
                  <View className="absolute top-0 right-0 bg-primary px-1.5 py-0.5 rounded-bl-md">
                    <Text className="text-[9px] font-bold text-primary-foreground">Soon</Text>
                  </View>
                )}
              </View>
            ) : (
              <View className="w-[70px] h-[70px] rounded-lg overflow-hidden relative bg-muted items-center justify-center">
                <Calendar size={24} className="text-muted-foreground" />
                {isHappeningSoon && (
                  <View className="absolute top-0 right-0 bg-primary px-1.5 py-0.5 rounded-bl-md">
                    <Text className="text-[9px] font-bold text-primary-foreground">Soon</Text>
                  </View>
                )}
              </View>
            )}

            {/* End time displayed below the image */}
            {endTime && (
              <View style={styles.endTimeContainer}>
                <Text className="text-[10px] font-medium text-foreground">{endTime}</Text>
              </View>
            )}
          </View>

          {/* Right side: Content */}
          <View style={styles.contentContainer}>
            <View>
              <Text className="text-base font-semibold text-foreground mb-0.5" numberOfLines={1}>
                {title}
              </Text>
              <View style={styles.timeContainer}>
                <Clock size={14} className="text-muted-foreground mr-1" />
                <Text className="text-xs font-medium text-primary">{timeFromNow}</Text>
              </View>
              <Text className="text-sm text-muted-foreground mb-2 leading-[18px]" numberOfLines={2}>
                {description}
              </Text>
            </View>

            <View style={styles.detailsContainer}>
              {/* Location row */}
              {location && (
                <TouchableOpacity onPress={handleLocationPress} style={styles.locationRow}>
                  <MapPin size={14} className="text-muted-foreground" />
                  <Text className="text-xs text-primary ml-1" numberOfLines={1}>
                    View location
                  </Text>
                </TouchableOpacity>
              )}

              {/* Source & Category row */}
              <View style={styles.bottomRow}>
                {sourceUrl && (
                  <TouchableOpacity onPress={handleSourcePress} style={styles.sourceRow}>
                    <ExternalLink size={14} className="text-muted-foreground" />
                    <Text className="text-xs text-primary ml-1">{sourceName}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
  },
  leftContainer: {
    width: 70,
    marginRight: 12,
  },
  startTimeContainer: {
    marginBottom: 4,
    alignItems: 'center',
  },
  endTimeContainer: {
    marginTop: 4,
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  detailsContainer: {
    justifyContent: 'space-between',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
