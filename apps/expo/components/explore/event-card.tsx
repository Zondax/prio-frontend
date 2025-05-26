'use client'

import { extractEventData } from '@prio-state/feature/events/utils'
import type { Event } from '@prio-state/stores/event'
import { getGoogleMapsLink } from '@prio-state/utils'
import { Image } from 'expo-image'
import { Calendar, ExternalLink, MapPin, Tag } from 'lucide-react-native'
import React, { useMemo, useState } from 'react'
import { Linking, Text, TouchableOpacity, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { PinButton } from './pin-button'

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

interface EventCardProps {
  event: Event
  isPinned?: boolean
  onEventClick: (event: Event) => void
  onPinToggle?: (event: Event) => void
  isCompact?: boolean
  pinColor?: string
  showExternalLink?: boolean
  showPinIcon?: boolean
}

export function EventCard({
  event,
  isPinned = false,
  onEventClick,
  onPinToggle,
  isCompact = false,
  pinColor = 'yellow',
  showExternalLink = false,
  showPinIcon = true,
}: EventCardProps) {
  const [displayExternalLink, setDisplayExternalLink] = useState(showExternalLink)

  const { id, title, description, date, time, coordinates, location, imageUrl, sourceName, sourceUrl } = extractEventData(event)

  // Mock data until Event type is updated
  const attendees = 0
  const likes = 0
  const tags: string[] = []
  const category = 'hackathon'
  // Randomly assign either undefined, $0 or a price between $5-$50
  // TODO: Remove this once we have a real price
  const price = useMemo(() => {
    return Math.random() > 0.3 ? 0 : Math.random() > 0.5 ? Math.floor(Math.random() * 46) + 5 : undefined
  }, [id])

  const handlePress = () => {
    onEventClick(event)
  }

  const handlePinToggle = () => {
    if (onPinToggle) {
      onPinToggle(event)
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
    <Card className={cn('relative my-4', isPinned && 'border-2')} style={isPinned ? { borderColor: pinColor } : {}}>
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        {imageUrl && (
          <View className={cn('relative w-full', isCompact ? 'h-32' : 'h-48')}>
            <View className={cn('w-full overflow-hidden rounded-t-lg', isCompact ? 'h-32' : 'h-48')}>
              <Image
                source={imageUrl || 'https://placehold.co/600x400'}
                placeholder={blurhash}
                contentFit="cover"
                style={{
                  width: '100%',
                  height: '100%',
                }}
                transition={300}
              />
            </View>
            {showPinIcon && onPinToggle && <PinButton isPinned={isPinned} eventId={id} onPinToggle={handlePinToggle} />}
          </View>
        )}

        <CardHeader>
          <View className="flex-row items-start justify-between">
            <View className="flex-1">
              <CardTitle className={cn('line-clamp-2', 'font-heading', isCompact && 'text-sm')}>{title}</CardTitle>
            </View>
            {!imageUrl && showPinIcon && onPinToggle && <PinButton isPinned={isPinned} eventId={id} onPinToggle={handlePinToggle} />}
          </View>
        </CardHeader>

        <CardContent>
          <CardDescription className={cn('line-clamp-3 mb-4', isCompact && 'text-xs')}>{description}</CardDescription>

          <View className="space-y-2">
            {date && time && (
              <View className="flex-row items-center text-muted-foreground mb-2">
                <Calendar size={16} className="mr-2" />
                <Text className="text-muted-foreground text-sm">
                  {date} at {time}
                </Text>
              </View>
            )}

            {location && (
              <View className="flex-row items-center text-muted-foreground mb-2">
                <MapPin size={16} className="mr-2" />
                <TouchableOpacity onPress={handleLocationPress}>
                  <Text className="text-primary text-sm font-body">View on Google Maps</Text>
                </TouchableOpacity>
              </View>
            )}

            {sourceUrl && displayExternalLink && (
              <View className="flex-row items-center text-muted-foreground mb-2">
                <ExternalLink size={16} className="mr-2" />
                <TouchableOpacity onPress={handleSourcePress}>
                  <Text className="text-primary text-sm font-body">Visit {sourceName}</Text>
                </TouchableOpacity>
              </View>
            )}

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center text-muted-foreground">
                {/* <Users size={16} className="mr-2" /> */}
                <View className="flex-row items-center gap-2">
                  {/* <Text className="text-muted-foreground text-sm">{attendees} attendees</Text> */}
                  <View>
                    <Text className={cn('text-xs text-muted-foreground opacity-60 font-body', isCompact && 'hidden')}>
                      from{' '}
                      <Text className="text-primary font-body" onPress={handleSourcePress}>
                        {sourceName}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              {price !== undefined && (
                <Badge variant="secondary" className="flex-row items-center gap-1">
                  {price === 0 ? (
                    <Text className="text-xs font-body">Free</Text>
                  ) : (
                    <View className="flex-row items-center gap-1">
                      <Tag size={12} className="h-3 w-3" />
                      <Text className="text-xs font-body">${price}</Text>
                    </View>
                  )}
                </Badge>
              )}
              {/* <View className="flex-row items-center gap-2">
                <Badge variant="secondary">
                  <Text className="text-xs">{category}</Text>
              <View className="flex-row items-center gap-1 text-muted-foreground" accessibilityLabel="likes">
                  <Heart size={16} color="#FF0000" />
                  <Text className="text-muted-foreground text-sm">{likes}</Text>
                </View>
              </View> */}
            </View>

            {tags.filter((tag) => tag.startsWith('type/') || tag.startsWith('tech/')).length > 0 && (
              <View className="flex-row flex-wrap gap-1.5 mt-2">
                {tags
                  .filter((tag) => tag.startsWith('type/') || tag.startsWith('tech/'))
                  .slice(0, isCompact ? 1 : 2)
                  .map((tag) => (
                    <Badge key={tag} variant="outline" className={cn('text-xs', 'bg-muted/50')}>
                      <Text className="font-body">{tag.split('/')[1]}</Text>
                    </Badge>
                  ))}
              </View>
            )}
          </View>
        </CardContent>
      </TouchableOpacity>
    </Card>
  )
}
