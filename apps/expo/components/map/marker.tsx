import { type MapMarker, MapMarkerKind } from '@mono-state'
import React, { memo, useCallback } from 'react'
import { Pressable, Text, TouchableOpacity, View } from 'react-native'
import { Avatar, AvatarImage } from '~/components/ui/avatar'

// ==========================================
// MARKER INTERFACES
// ==========================================

interface MarkerProps {
  mapMarker: MapMarker
  onMarkerClick?: (marker: MapMarker) => void
  simplified?: boolean
  isSelected?: boolean
}

interface MarkerContentProps {
  mapMarker: MapMarker
  onClick: () => void
  simplified?: boolean
  isSelected?: boolean
}

// ==========================================
// MAIN MARKER COMPONENT
// ==========================================

/**
 * Main marker component (memoized for performance)
 * Renders either a detailed or simplified marker based on the simplified prop
 *
 * NOTE: This component is designed to be used inside a MarkerView from MapLibre
 * and avoids using Modal or other components that cause recycling issues
 */
export const Marker = memo(function Marker({ mapMarker, onMarkerClick, simplified = false, isSelected = false }: MarkerProps) {
  const handleMarkerClick = useCallback(() => {
    if (onMarkerClick) {
      onMarkerClick(mapMarker)
    }
  }, [mapMarker, onMarkerClick])

  const isGrouped = mapMarker.getKind() === MapMarkerKind.MAP_MARKER_KIND_EVENT_GROUPED

  return isGrouped ? (
    <GroupedMarker mapMarker={mapMarker} onClick={handleMarkerClick} simplified={simplified} isSelected={isSelected} />
  ) : (
    <SingleMarker mapMarker={mapMarker} onClick={handleMarkerClick} simplified={simplified} isSelected={isSelected} />
  )
})

// ==========================================
// SINGLE MARKER COMPONENT
// ==========================================

/**
 * Single marker component
 * Renders either a detailed marker with image and text or a simple dot
 */
const SingleMarker = memo(function SingleMarker({ mapMarker, onClick, simplified = false, isSelected = false }: MarkerContentProps) {
  // Simplified version - just a dot
  if (simplified) {
    return (
      <Pressable
        className={`w-4 h-4 rounded-full bg-primary border ${isSelected ? 'border-2 border-secondary' : 'border-white'}`}
        onPress={onClick}
      />
    )
  }

  const imageUrl = mapMarker.hasEvent() ? mapMarker.getEvent()?.getImage() || '' : ''
  const title = mapMarker.hasEvent() ? mapMarker.getEvent()?.getTitle() || '' : ''

  // Detailed version with image and text
  return (
    <TouchableOpacity
      className={`bg-white rounded-full h-10 w-10 shadow overflow-hidden ${isSelected ? 'shadow-lg' : ''}`}
      onPress={onClick}
      activeOpacity={0.8}
    >
      <Avatar className={`w-10 h-10 ${isSelected ? 'border-3 border-secondary' : 'border-2 border-white'}`} alt={title}>
        {imageUrl ? (
          <AvatarImage source={{ uri: imageUrl }} className="w-full h-full" />
        ) : (
          <View className={`w-full h-full ${isSelected ? 'bg-secondary' : 'bg-primary'} items-center justify-center`}>
            <Text className="text-white font-bold text-lg">{title.charAt(0)}</Text>
          </View>
        )}
      </Avatar>
    </TouchableOpacity>
  )
})

// ==========================================
// GROUPED MARKER COMPONENT
// ==========================================

/**
 * Grouped marker component
 * Renders either a detailed counter or a simple larger dot
 *
 * IMPORTANT: This implementation does NOT use Modal directly in the marker
 * Instead, it simply notifies the parent via onClick, which should handle
 * showing event details in a separate component
 */
const GroupedMarker = memo(function GroupedMarker({ mapMarker, onClick, simplified = false, isSelected = false }: MarkerContentProps) {
  const [isPressed, setIsPressed] = React.useState(false)
  const count = mapMarker.getEventGroup()?.getEventCount() || 0

  const handlePress = useCallback(() => {
    onClick()
  }, [onClick])

  const handlePressIn = useCallback(() => {
    setIsPressed(true)
  }, [])

  const handlePressOut = useCallback(() => {
    setIsPressed(false)
  }, [])

  // Simplified version - just a larger dot with different color
  if (simplified) {
    return <Pressable className="w-6 h-6 rounded-full bg-primary border-2 border-white" onPress={handlePress} />
  }

  // Regular grouped marker (just shows the count)
  return (
    <Pressable
      className={'w-10 h-10 rounded-full items-center justify-center shadow'}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={isPressed ? { transform: [{ scale: 1.1 }] } : undefined}
    >
      <View
        className={`w-full h-full rounded-full items-center justify-center border-2 border-white ${
          isPressed ? 'bg-secondary' : 'bg-secondary/90'
        }`}
      >
        <Text className="text-white font-bold text-sm">{count}</Text>
      </View>
    </Pressable>
  )
})
