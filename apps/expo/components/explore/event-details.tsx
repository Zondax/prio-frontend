import { extractEventData } from '@mono-state/feature/events/utils'
import { createEventMapMarker } from '@mono-state/feature/map'
import type { Event, EventDetailState } from '@mono-state/stores/event'
import { formatText, getGoogleMapsLink } from '@mono-state/utils'
import { Image } from 'expo-image'
import { Calendar, Clock, ExternalLink, MapPin, Share2, X } from 'lucide-react-native'
import React, { useEffect } from 'react'
import { Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { EventDetailsMap } from './event-details-map'
import { PinButton } from './pin-button'

interface EventDetailsProps {
  eventDetailState: EventDetailState | null
  onClose: () => void
  isPinned?: boolean
  onPinToggle?: (event: Event) => void
}

export function EventDetails({ eventDetailState, onClose, isPinned = false, onPinToggle }: EventDetailsProps) {
  const insets = useSafeAreaInsets()
  const translateY = useSharedValue(1000)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  useEffect(() => {
    if (eventDetailState?.event || eventDetailState?.isLoading) {
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      })
    } else {
      translateY.value = withTiming(1000, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      })
    }
  }, [eventDetailState, translateY])

  if (!eventDetailState) return null

  const { event, isLoading } = eventDetailState

  // Show skeleton loader when event is loading
  if (isLoading) {
    return (
      <Modal visible={true} animationType="slide" transparent={true} onRequestClose={onClose}>
        <Animated.View className="flex-1 justify-end bg-black/50" style={animatedStyle}>
          <View className="h-full bg-background rounded-t-[20px]" style={{ paddingTop: insets.top }}>
            <View className="px-4 pt-4 pb-2">
              <View className="flex-row justify-between items-start">
                <Skeleton className="h-8 w-3/4 rounded-md" />
                <TouchableOpacity className="w-8 h-8 rounded-full justify-center items-center bg-muted" onPress={onClose}>
                  <X size={16} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
              <View className="relative items-center my-4">
                <Skeleton className="w-[280px] h-[280px] rounded-xl" />
              </View>

              <View className="flex-row items-center mb-2">
                <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-md" />
                <Text className="mx-2 text-muted-foreground font-body">•</Text>
                <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </View>

              <View className="flex-row items-center mb-2">
                <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                <Skeleton className="h-4 w-32 rounded-md" />
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Text className="mx-2 text-muted-foreground font-body">•</Text>
                  <Skeleton className="h-4 w-16 rounded-md" />
                </View>
              </View>

              <Separator className="my-4" />

              <View className="mb-6">
                <Skeleton className="h-5 w-32 mb-3 rounded-md" />
                <View className="gap-3">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                </View>
              </View>

              <View className="mb-6">
                <Skeleton className="h-5 w-24 mb-3 rounded-md" />
                <Skeleton className="h-[200px] w-full rounded-xl mb-2" />
                <Skeleton className="h-4 w-48 rounded-md" />
              </View>

              <View className="mb-6">
                <Skeleton className="h-5 w-48 mb-3 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md mb-2" />
                <Skeleton className="h-4 w-full rounded-md mb-2" />
                <Skeleton className="h-4 w-3/4 rounded-md mb-2" />
                <Skeleton className="h-4 w-40 rounded-md" />
              </View>
            </ScrollView>

            <View className="p-4 border-t border-border" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
              <Skeleton className="h-12 w-full rounded-md" />
            </View>
          </View>
        </Animated.View>
      </Modal>
    )
  }

  if (!event) return null

  // Use extractEventData to get all event data
  const { id, title, description, date, time, coordinates, location, imageUrl, sourceName, sourceUrl } = extractEventData(event)

  // Mock data until Event type is updated
  const attendees = 0
  const likes = 0
  const tags: string[] = []

  // Create map marker for the event
  const eventMarker = createEventMapMarker(event)
  const markers = eventMarker ? [eventMarker] : []
  const center = eventMarker
    ? ([eventMarker.getCoordinates()?.getLongitude() || 0, eventMarker.getCoordinates()?.getLatitude() || 0] as [number, number])
    : undefined

  const handleLocationPress = () => {
    if (location) {
      Linking.openURL(getGoogleMapsLink(location))
    }
  }

  const handleSourcePress = () => {
    if (sourceUrl) {
      Linking.openURL(sourceUrl)
    }
  }

  const handleSharePress = () => {
    // TODO: Implement share functionality
  }

  const handleWebsitePress = () => {
    if (sourceUrl) {
      Linking.openURL(sourceUrl)
    }
  }

  const handlePinToggle = () => {
    if (onPinToggle) {
      onPinToggle(event)
    }
  }

  return (
    <Modal visible={Boolean(event)} animationType="slide" transparent={true} onRequestClose={onClose}>
      <Animated.View className="flex-1 justify-end bg-black/50" style={animatedStyle}>
        <View className="h-full bg-background rounded-t-[20px]" style={{ paddingTop: insets.top }}>
          <View className="px-4 pt-4 pb-2">
            <View className="flex-row justify-between items-start">
              <Text className="text-2xl font-bold flex-1 mr-2 text-foreground font-heading" numberOfLines={2}>
                {title}
              </Text>
              <TouchableOpacity className="w-8 h-8 rounded-full justify-center items-center bg-muted" onPress={onClose}>
                <X size={16} className="text-muted-foreground" />
              </TouchableOpacity>
              {!imageUrl && onPinToggle && <PinButton isPinned={isPinned} eventId={id} onPinToggle={handlePinToggle} />}
            </View>
          </View>

          <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
            {imageUrl && (
              <View className="relative items-center my-4">
                <View className="w-[280px] h-[280px] rounded-xl overflow-hidden border border-border">
                  <Image source={{ uri: imageUrl }} alt={title} contentFit="cover" style={{ width: '100%', height: '100%' }} />
                  <PinButton isPinned={isPinned} eventId={id} onPinToggle={handlePinToggle} />
                </View>
              </View>
            )}

            {date && time && (
              <View className="flex-row items-center mb-2">
                <Calendar size={16} className="text-muted-foreground mr-2" />
                <Text className="text-muted-foreground text-sm">{date}</Text>
                <Text className="mx-2 text-muted-foreground">•</Text>
                <Clock size={16} className="text-muted-foreground mr-2" />
                <Text className="text-muted-foreground text-sm">{time}</Text>
              </View>
            )}

            {location && (
              <TouchableOpacity className="flex-row items-center mb-2" onPress={handleLocationPress}>
                <MapPin size={16} className="text-muted-foreground mr-2" />
                <Text className="text-primary text-sm font-body">View on Google Maps</Text>
              </TouchableOpacity>
            )}

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center flex-wrap">
                {/* <Users size={16} className="text-muted-foreground mr-2" />
                <Text className="text-muted-foreground text-sm">{attendees} attendees</Text>
                <Text className="mx-2 text-muted-foreground">•</Text> */}
                <TouchableOpacity className="flex-row items-center gap-1" onPress={handleSourcePress}>
                  <Text className="text-primary text-sm font-body">From {sourceName}</Text>
                  <ExternalLink size={12} className="text-primary" />
                </TouchableOpacity>
                <Text className="mx-2 text-muted-foreground font-body">•</Text>
                <TouchableOpacity className="flex-row items-center gap-1" onPress={handleSharePress}>
                  <Text className="text-primary text-sm font-body">Share</Text>
                  <Share2 size={12} className="text-primary" />
                </TouchableOpacity>
              </View>
              {/* <View className="flex-row items-center">
                <Heart size={16} color="#f43f5e" fill="#f43f5e" className="mr-2" />
                <Text className="text-rose-500 font-medium text-sm">{likes}</Text>
              </View> */}
            </View>

            <Separator className="my-4" />

            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3 text-foreground font-heading">About this event</Text>
              <View className="gap-3">
                {formatText(description).map((text, index) => (
                  <Text key={index} className="text-sm leading-5 text-foreground font-body">
                    {text}
                  </Text>
                ))}
              </View>
            </View>

            {location && (
              <View className="mb-6">
                <Text className="text-lg font-semibold mb-3 text-foreground font-heading">Location</Text>
                {coordinates && markers.length > 0 ? (
                  <View className="h-[200px] rounded-xl overflow-hidden border border-border mb-2">
                    <EventDetailsMap markers={markers} center={center} />
                  </View>
                ) : (
                  <View className="h-[200px] rounded-xl overflow-hidden border border-border mb-2">
                    <Image source={'https://placehold.co/600x400'} className="w-full h-full" contentFit="cover" />
                  </View>
                )}
              </View>
            )}

            {tags.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold mb-3 text-foreground font-heading">Tags</Text>
                <View className="flex-row flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className={cn('mr-2 mb-2', tag.startsWith('@') && 'bg-primary/10')}>
                      {tag.split('/')[1]}
                    </Badge>
                  ))}
                </View>
              </View>
            )}

            <View className="mb-6">
              <Text className="text-lg font-semibold mb-3 text-foreground font-heading">Additional Information</Text>
              <Text className="text-sm text-muted-foreground leading-5 mb-3 font-body">
                Join us for this exciting event! Don't forget to register early as spaces are limited. For any questions, please contact the
                event organizers.
              </Text>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  )
}
