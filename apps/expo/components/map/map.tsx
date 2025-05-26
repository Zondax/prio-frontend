import type MapLibreGL from '@maplibre/maplibre-react-native'
import { Camera, MapView as MapLibreView, type RegionPayload } from '@maplibre/maplibre-react-native'
import type { Coordinate, MapMarker, MapMoveEvent } from '@prio-state'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { MAP_DEFAULTS } from '../../../../packages/state/src/feature/map/constants'
import { useMapStyle } from './hooks/use-map-style'
import { useMarkers } from './hooks/use-markers'
import { MapError } from './map-error'
import { UserLocationMarker } from './user-location-marker'
import { convertToMapBounds } from './utils'

// Types
export interface MapProps {
  // Core data
  markers?: MapMarker[]
  currentLocation?: Coordinate
  center?: [number, number]
  zoom?: number
  style?: object
  darkMode?: boolean
  selectedEventId?: number | null

  // Interactive features
  allowZoom?: boolean
  allowDrag?: boolean
  allowRotate?: boolean
  showControls?: boolean
  showGeolocationControl?: boolean
  showZoomControls?: boolean
  isLoading: boolean
  // Event handlers
  onMarkerClick?: (marker: MapMarker) => void
  onMapClick?: (lngLat: Coordinate) => void
  onMapMove?: (event: MapMoveEvent) => void
  onMapLoaded?: () => void
}

// TODO: We can improve the whole behaviour of the component. We had to apply some patches, but maplibre library has some issues.
// If you want to do a change and is very complicated, evaluate to migrate to another library. It shouldn't be, but just in case.

/**
 * Map component for displaying interactive maps with markers
 */
export function MobileMap({
  markers = [],
  currentLocation = {
    latitude: 0,
    longitude: 0,
  },
  center = MAP_DEFAULTS.CENTER,
  zoom = MAP_DEFAULTS.ZOOM,
  style = {},
  darkMode,
  selectedEventId = null,
  allowZoom = true,
  allowDrag = true,
  allowRotate = false,
  showControls = true,
  showGeolocationControl = true,
  showZoomControls = false,
  isLoading = false,
  onMarkerClick,
  onMapClick,
  onMapMove,
}: MapProps) {
  // Refs
  const mapRef = useRef<any>(null)
  const cameraRef = useRef<MapLibreGL.CameraRef>(null)
  const initialMoveTriggeredRef = useRef<boolean>(false)

  // State
  const [error, setError] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState<boolean>(false)

  // Map center calculation - defined early to use in other hooks
  const getMapCenter = useCallback((): [number, number] => {
    if (center) return center

    if (currentLocation.latitude && currentLocation.longitude) {
      return [currentLocation.longitude, currentLocation.latitude] as [number, number]
    }

    return MAP_DEFAULTS.CENTER
  }, [center, currentLocation.latitude, currentLocation.longitude])

  // Calculated map center - calculated immediately so it's available for hooks
  const mapCenter = getMapCenter()

  // Custom hooks
  const styleUrl = useMapStyle(darkMode)
  const { renderMarkers, renderEventDetailsModal } = useMarkers({
    markers,
    cameraRef,
    mapCenter,
    zoom,
    onMarkerClick,
    selectedEventId,
  })

  // Effect to trigger initial map move when the map is fully ready
  useEffect(() => {
    if (onMapMove && !initialMoveTriggeredRef.current && !isLoading && mapReady) {
      const lng = currentLocation.longitude || mapCenter[0]
      const lat = currentLocation.latitude || mapCenter[1]

      onMapMove({
        center: { longitude: lng, latitude: lat },
        zoom,
        bounds: {
          topLeft: {
            latitude: lat + 0.1,
            longitude: lng - 0.1,
          },
          bottomRight: {
            latitude: lat - 0.1,
            longitude: lng + 0.1,
          },
        },
      })

      initialMoveTriggeredRef.current = true
    }
  }, [isLoading, mapReady, onMapMove, currentLocation, mapCenter, zoom])

  const handleMapLoaded = useCallback(() => {
    setMapReady(true)
  }, [])

  const handleMapClick = useCallback(
    (feature: GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties>) => {
      if (!onMapClick) return

      const coordinates = feature?.geometry?.coordinates
      if (!coordinates || !Array.isArray(coordinates) || coordinates.length < 2) return

      const [lng, lat] = coordinates
      onMapClick({ longitude: lng, latitude: lat })
    },
    [onMapClick]
  )

  const handleRegionDidChange = useCallback(
    (location: GeoJSON.Feature<GeoJSON.Point, RegionPayload>) => {
      if (!onMapMove) return

      const moveEvent: MapMoveEvent = {
        center: { longitude: center[0], latitude: center[1] },
        zoom,
      }

      // Add bounds if available
      if (location?.properties?.visibleBounds) {
        const bounds = convertToMapBounds(location.properties.visibleBounds)
        if (bounds) moveEvent.bounds = bounds
      }

      onMapMove(moveEvent)
    },
    [center, zoom, onMapMove]
  )

  const handleMapFailLoad = useCallback(() => {
    setError('Failed to load map style')
  }, [])

  // Render user location marker
  const renderUserLocationMarker = useCallback(() => {
    if (!currentLocation.latitude || !currentLocation.longitude) return null

    return <UserLocationMarker longitude={currentLocation.longitude} latitude={currentLocation.latitude} />
  }, [currentLocation.latitude, currentLocation.longitude])

  // Calculate the user location marker
  const userLocationMarker = renderUserLocationMarker()

  // Handle error state
  if (error) {
    return <MapError error={error} style={style} />
  }

  // Main render
  return (
    <View style={[styles.container, style]}>
      <MapLibreView
        ref={mapRef}
        style={styles.map}
        mapStyle={styleUrl}
        zoomEnabled={allowZoom}
        scrollEnabled={allowDrag}
        rotateEnabled={allowRotate}
        pitchEnabled={allowRotate}
        compassEnabled={showControls}
        logoEnabled={false}
        attributionEnabled={false}
        onPress={handleMapClick}
        onRegionDidChange={handleRegionDidChange}
        onDidFailLoadingMap={handleMapFailLoad}
        onDidFinishLoadingStyle={handleMapLoaded}
      >
        <Camera ref={cameraRef} zoomLevel={zoom} centerCoordinate={mapCenter} />
        {renderMarkers()}
        {userLocationMarker}
      </MapLibreView>

      {/* Render event details modal outside the map */}
      {renderEventDetailsModal()}
    </View>
  )
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    right: 10,
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 5,
  },
  controlButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  userLocationMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
})
