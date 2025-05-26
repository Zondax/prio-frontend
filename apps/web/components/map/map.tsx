'use client'

import type { MapMarker, MapMoveEvent } from '@prio-state'
import { AlertTriangle, Loader2 } from 'lucide-react'

import 'maplibre-gl/dist/maplibre-gl.css'

import { RMap, RMarker } from 'maplibre-react-components'

import { cn } from '@/lib/utils'

import { MapControls } from './controls'
import { MapLoader } from './map-loader'
import { Marker } from './marker'
import { MapPermissionDialog } from './permission-dialog'
import { useMapStyle } from './use-map-style'
import { useUserLocation } from './use-user-location'

import { debounce } from 'es-toolkit'
import { useCallback, useMemo, useRef } from 'react'

const DEFAULT_ZOOM = 12
const DEFAULT_CENTER: [number, number] = [-0.118092, 51.509865] // London by default

interface MapProps {
  markers?: MapMarker[]
  center?: [number, number]
  zoom?: number
  className?: string
  style?: React.CSSProperties

  // Selected event
  selectedEventId?: number | null

  // Feature flags
  allowZoom?: boolean
  allowDrag?: boolean
  allowRotate?: boolean
  showControls?: boolean
  showFullscreenControl?: boolean
  showGeolocationControl?: boolean
  allowUserLocation?: boolean
  // Event handlers
  onMarkerClick?: (marker: MapMarker) => void
  onMapClick?: (lngLat: { lng: number; lat: number }) => void
  onMapMove?: (event: MapMoveEvent) => void
  onMapLoad?: (map: any) => void
}

export function WebMap({
  markers = [],
  selectedEventId = null,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = '',
  style = {},
  allowZoom = true,
  allowDrag = true,
  allowRotate = false,
  showControls = true,
  showFullscreenControl = true,
  showGeolocationControl = true,
  allowUserLocation = false,
  onMarkerClick,
  onMapClick,
  onMapMove,
  onMapLoad,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  const {
    mapCenter,
    userLocation,
    permissionGranted,
    locationError,
    showPermissionDialog,
    setShowPermissionDialog,
    handleLocationClick,
    handleRequestPermission,
  } = useUserLocation({ allowUserLocation, mapRef, defaultCenter: center, defaultZoom: zoom })
  const mapStyle = useMapStyle()

  const handleFullscreen = useCallback(() => {
    if (!mapContainer.current) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      mapContainer.current.requestFullscreen()
    }
  }, [])

  const handleMapLoad = (event: any) => {
    const mapInstance = event.target
    mapRef.current = mapInstance

    if (onMapLoad) onMapLoad(mapInstance)
  }

  const handleMapClick = (e: any) => {
    if (onMapClick) {
      const { lng, lat } = e.lngLat
      onMapClick({ lng, lat })
    }
  }

  // Debounce map move events using es-toolkit
  const handleMapMove = useMemo(
    () =>
      debounce((e: any) => {
        if (onMapMove) {
          const map = e.target
          const center = map.getCenter()
          const zoomVal = map.getZoom()
          const bounds = map.getBounds()
          const ne = bounds.getNorthEast()
          const sw = bounds.getSouthWest()

          onMapMove({
            center,
            zoom: zoomVal,
            bounds: {
              topLeft: { latitude: ne.lat, longitude: sw.lng },
              bottomRight: { latitude: sw.lat, longitude: ne.lng },
            },
          })
        }
      }, 300),
    [onMapMove]
  )

  // Memoize marker components
  const markerElements = useMemo(
    () =>
      markers.map((mapMarker, index) => {
        const event = mapMarker.getEvent()
        const isSelected = selectedEventId != null && event?.getId() === selectedEventId
        const markerKey = event ? event.getId() : index
        return <Marker key={markerKey} mapMarker={mapMarker} index={index} onMarkerClick={onMarkerClick} isSelected={isSelected} />
      }),
    [markers, selectedEventId, onMarkerClick]
  )

  // Create a user location marker if location is available and allowed
  const userLocationMarker =
    allowUserLocation && userLocation.latitude && userLocation.longitude ? (
      <RMarker longitude={userLocation.longitude} latitude={userLocation.latitude} offset={[0, 0]}>
        <div className="h-6 w-6 rounded-full bg-blue-500 ring-4 ring-white flex items-center justify-center animate-pulse">
          <div className="h-3 w-3 rounded-full bg-white" />
        </div>
      </RMarker>
    ) : null

  return (
    <MapLoader className={className} style={style}>
      <div ref={mapContainer} className={cn('relative h-full w-full', className)} style={style}>
        {mapStyle && (
          <RMap
            mapStyle={mapStyle}
            initialAttributionControl={false}
            initialCenter={mapCenter}
            initialZoom={zoom}
            dragRotate={allowRotate}
            dragPan={allowDrag}
            scrollZoom={allowZoom}
            touchZoomRotate={allowZoom}
            doubleClickZoom={allowZoom}
            onClick={handleMapClick}
            onMove={handleMapMove}
            onLoad={handleMapLoad}
            className="h-full w-full rounded-md overflow-hidden"
          >
            {markerElements}
            {userLocationMarker}
          </RMap>
        )}

        {showControls && (
          <MapControls
            showFullscreenControl={showFullscreenControl}
            showGeolocationControl={showGeolocationControl}
            allowUserLocation={allowUserLocation}
            locationError={locationError}
            permissionGranted={permissionGranted}
            onFullscreen={handleFullscreen}
            onLocationClick={handleLocationClick}
            onShowPermissionDialog={() => setShowPermissionDialog(true)}
          />
        )}

        <MapPermissionDialog
          open={showPermissionDialog}
          onOpenChange={setShowPermissionDialog}
          onRequestPermission={handleRequestPermission}
        />
      </div>
    </MapLoader>
  )
}
