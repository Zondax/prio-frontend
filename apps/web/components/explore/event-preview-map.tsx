'use client'

import type { MapMarker } from '@prio-state'

import { WebMap } from '../map/map'

interface EventDetailsMapProps {
  markers?: MapMarker[]
  center?: [number, number]
  zoom?: number
  height?: string
  width?: string
  className?: string
  style?: React.CSSProperties
  onMarkerClick?: (marker: MapMarker) => void
}

export function EventDetailsMap({
  markers = [],
  center,
  zoom = 12,
  height = '240px',
  width = '100%',
  className = '',
  style = {},
  onMarkerClick,
}: EventDetailsMapProps) {
  // Combine height, width with existing style prop
  const combinedStyle: React.CSSProperties = {
    ...style, // Spread existing styles first
    height,
    width,
  }

  return (
    <WebMap
      markers={markers}
      center={center}
      zoom={zoom}
      // height and width are now part of combinedStyle
      className={className}
      style={combinedStyle} // Pass the combined style object
      allowDrag={true}
      allowZoom={false}
      allowRotate={false}
      allowUserLocation={false}
      showControls={false}
      showFullscreenControl={false}
      showGeolocationControl={false}
      onMarkerClick={onMarkerClick}
    />
  )
}
