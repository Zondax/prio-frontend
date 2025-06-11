import type { MapMarker } from '@mono-state'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { MobileMap } from '../map/map'

interface EventDetailsMapProps {
  markers?: MapMarker[]
  center?: [number, number]
  zoom?: number
  height?: number | string
  style?: object
  className?: string
  onMarkerClick?: (marker: MapMarker) => void
}

export function EventDetailsMap({ markers = [], center, zoom = 14, height = 200, style = {}, onMarkerClick }: EventDetailsMapProps) {
  return (
    <View style={[styles.container, { height }, style]}>
      <MobileMap
        markers={markers}
        center={center}
        zoom={zoom}
        style={{ flex: 1 }}
        allowDrag={true}
        allowZoom={false}
        allowRotate={false}
        showControls={false}
        showGeolocationControl={false}
        showZoomControls={false}
        onMarkerClick={onMarkerClick}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
})
