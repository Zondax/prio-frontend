import type { MapMarker, MarkerEvent } from '@mono-state'
import React, { useCallback, useMemo } from 'react'
import { FlatList, type ListRenderItemInfo, Modal, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { Avatar, AvatarImage } from '~/components/ui/avatar'

interface EventDetailsModalProps {
  visible: boolean
  mapMarker: MapMarker | null
  onClose: () => void
  onEventSelect: (event: MarkerEvent) => void
}

/**
 * Event item component for rendering individual events in the events list
 */
function EventItem({ item, onPress }: { item: MarkerEvent; onPress: () => void }) {
  const title = item.getTitle() || 'Unnamed Event'
  const imageUrl = item.getImage() || ''
  const startDate = item.getStartDate()
  let time = ''

  if (startDate) {
    const date = new Date(startDate)
    if (!Number.isNaN(date.getTime())) {
      time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 border-b border-border active:bg-accent/50"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Avatar className="w-11 h-11 mr-3" alt={title}>
        {imageUrl ? (
          <AvatarImage source={{ uri: imageUrl }} className="w-full h-full" />
        ) : (
          <View className="w-full h-full bg-primary items-center justify-center">
            <Text className="text-primary-foreground font-semibold text-base">{title.charAt(0)}</Text>
          </View>
        )}
      </Avatar>
      <View className="flex-1 justify-center">
        <Text className="font-medium text-base text-foreground" numberOfLines={1}>
          {title}
        </Text>
        {time ? <Text className="text-sm text-muted-foreground">{time}</Text> : null}
      </View>
    </TouchableOpacity>
  )
}

/**
 * Modal component for displaying event details
 * This is separated from the marker to avoid recycling issues
 */
export function EventDetailsModal({ visible, mapMarker, onClose, onEventSelect }: EventDetailsModalProps) {
  const { height: windowHeight } = useWindowDimensions()
  const maxHeight = useMemo(() => Math.min(windowHeight * 0.7, 600), [windowHeight])

  const events = useMemo(() => {
    if (!visible || !mapMarker) return []
    return mapMarker.getEventGroup?.()?.getEventsIncludedList() || []
  }, [visible, mapMarker])

  const count = useMemo(() => {
    return mapMarker?.getEventGroup?.()?.getEventCount() || 0
  }, [mapMarker])

  const keyExtractor = useCallback((item: MarkerEvent, index: number) => {
    const id = item.getId?.()
    return id ? `grouped-event-${id}` : `grouped-event-index-${index}`
  }, [])

  const handleEventPress = useCallback(
    (event: MarkerEvent) => {
      onEventSelect(event)
      onClose()
    },
    [onEventSelect, onClose]
  )

  const renderEventItem = useCallback(
    ({ item }: ListRenderItemInfo<MarkerEvent>) => {
      return <EventItem item={item} onPress={() => handleEventPress(item)} />
    },
    [handleEventPress]
  )

  if (!visible) return null

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose} hardwareAccelerated={true}>
      <View className="flex-1 justify-end bg-black/60">
        <TouchableOpacity className="absolute inset-0" activeOpacity={1} onPress={onClose} />
        <View className="bg-card rounded-t-2xl">
          <View className="items-center pt-2 pb-3 border-b border-border">
            <View className="w-8 h-1 rounded-full bg-muted mb-3" />
            <Text className="text-lg font-semibold text-card-foreground">
              {count} {count === 1 ? 'Event' : 'Events'} Nearby
            </Text>
          </View>
          <FlatList
            data={events as MarkerEvent[]}
            renderItem={renderEventItem}
            keyExtractor={keyExtractor}
            style={{ maxHeight }}
            removeClippedSubviews={false}
            windowSize={21}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
            updateCellsBatchingPeriod={50}
            showsVerticalScrollIndicator={true}
            bounces={false}
            contentContainerStyle={{ flexGrow: 0 }}
          />
        </View>
      </View>
    </Modal>
  )
}
