'use client'

import { type MapBounds, type MapMarker, type MapMoveEvent, calculateInitialBounds, useEndpointStore } from '@prio-state'
import { type Filter, addGeoBoundsFilter } from '@prio-state/feature/events'
import { type EventDetailState, useEventDetailStore } from '@prio-state/stores/event'
import { useEventMapMarkersStore } from '@prio-state/stores/map'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { Loader2 } from 'lucide-react'
import type { Map as MaplibreMap } from 'maplibre-gl'
import { useCallback, useEffect, useRef, useState } from 'react'

import { WebMap } from '../map/map'

/**
 * Default map settings for initial view
 */
const DEFAULT_ZOOM = 12
const DEFAULT_CENTER: [number, number] = [-0.118092, 51.509865] // London by default

interface MapViewProps {
  onEventClick: (eventDetailState: EventDetailState) => void
  searchQuery?: string
  isPinnedOnly?: boolean
  externalFilters?: Filter[]
}

/**
 * MapView component that displays a map with event markers and handles user interactions
 */
export function MapView({ onEventClick, searchQuery = '', isPinnedOnly = false, externalFilters = [] }: MapViewProps) {
  const { markers, isLoading: markersLoading, setParams: setMarkersParams, setInput } = useEventMapMarkersStore()
  const { selectedEndpoint } = useEndpointStore()
  const { eventDetailData, isLoading: isLoadingEventDetail, fetchById, setParams: setEventParams } = useEventDetailStore()

  const [initialBoundsSet, setInitialBoundsSet] = useState(false)
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mapRef = useRef<any>(null)
  const isLoading = markersLoading

  // State for managing filters
  const [currentFilters, setCurrentFilters] = useState<Filter[]>([])
  const [currentMapBounds, setCurrentMapBounds] = useState<MapBounds | undefined>(undefined)

  useGrpcSetup(setMarkersParams, selectedEndpoint)
  useGrpcSetup(setEventParams, selectedEndpoint)

  // This keeps the filters in sync with the current map view and search parameters
  useEffect(() => {
    if (currentMapBounds) {
      // Create the filters with updated geographic bounds
      const filtersWithGeo = addGeoBoundsFilter(currentMapBounds, externalFilters)
      setCurrentFilters(filtersWithGeo)
    }
  }, [currentMapBounds, externalFilters])

  // This sends the updated filters to the store to fetch new markers
  useEffect(() => {
    if (currentFilters.length > 0) {
      setInput({
        filters: currentFilters,
      })
    }
  }, [currentFilters, setInput])

  useEffect(() => {
    if (eventDetailData) {
      onEventClick({
        event: eventDetailData,
        isLoading: false,
      })
    }
  }, [eventDetailData, onEventClick])

  const handleMapLoad = useCallback(
    (map: MaplibreMap) => {
      if (!initialBoundsSet && map) {
        if (map.getCenter && map.getZoom) {
          const center = map.getCenter()
          const zoom = map.getZoom()
          // Calculate bounds based on center and zoom
          const viewportBounds = calculateInitialBounds({ longitude: center.lng, latitude: center.lat }, zoom)
          const filtersWithGeo = addGeoBoundsFilter(viewportBounds, externalFilters)

          setCurrentMapBounds(viewportBounds)
          setCurrentFilters(filtersWithGeo)
          setInitialBoundsSet(true)
        }
      }
    },
    [initialBoundsSet, externalFilters]
  )

  const handleMarkerClick = (marker: MapMarker) => {
    if (marker.hasEvent()) {
      const eventId = marker.getEvent()?.getId()
      if (eventId) {
        // First, show loading state
        onEventClick({
          event: null,
          isLoading: true,
        })

        // Then fetch the data
        fetchById(eventId)
      }
    }
  }

  const handleMapMove = useCallback((event: MapMoveEvent) => {
    // Clear existing timeout to debounce the events
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current)
    }

    // Only update the store with geo bounds when we have bounds from a moveEnd event
    if (event.bounds) {
      moveTimeoutRef.current = setTimeout(() => {
        setCurrentMapBounds(event.bounds)
      }, 300) // Debounce map movements to reduce API calls
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white p-2 rounded-full shadow-md">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
      <WebMap
        markers={markers}
        style={{ height: '100%', width: '100%' }}
        zoom={DEFAULT_ZOOM}
        onMarkerClick={handleMarkerClick}
        onMapMove={handleMapMove}
        onMapLoad={handleMapLoad}
        allowDrag={true}
        allowZoom={true}
        allowRotate={false}
        showControls={true}
        allowUserLocation={true}
        showFullscreenControl={true}
        showGeolocationControl={true}
      />
    </div>
  )
}
