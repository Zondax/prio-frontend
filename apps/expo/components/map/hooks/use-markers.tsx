import { MarkerView } from '@maplibre/maplibre-react-native'
import { createSingleEventMarker, type MapMarker, MapMarkerKind, type MarkerEvent } from '@mono-state'
import type React from 'react'
import { useCallback, useState } from 'react'

import { EventDetailsModal } from '../event-details-modal'
import { Marker } from '../marker'

interface UseMarkersReturn {
  renderMarkers: () => React.ReactNode | null
  renderEventDetailsModal: () => React.ReactNode
}

interface UseMarkersParams {
  markers?: MapMarker[]
  cameraRef?: React.RefObject<any>
  mapCenter?: [number, number]
  zoom?: number
  onMarkerClick?: (marker: MapMarker) => void
  selectedEventId?: number | null
}

/**
 * Custom hook to manage map markers and event details
 * @param params Object containing markers and related parameters
 * @returns Object with renderMarkers and renderEventDetailsModal functions
 */
export function useMarkers({
  markers = [],
  cameraRef,
  mapCenter,
  zoom,
  onMarkerClick,
  selectedEventId = null,
}: UseMarkersParams): UseMarkersReturn {
  const [selectedGroupedMarker, setSelectedGroupedMarker] = useState<MapMarker | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const handleMarkerClick = useCallback(
    (marker: MapMarker) => {
      if (marker.getKind() === MapMarkerKind.MAP_MARKER_KIND_EVENT_GROUPED) {
        setSelectedGroupedMarker(marker)
        setModalVisible(true)
      }

      if (onMarkerClick) {
        onMarkerClick(marker)
      }
    },
    [onMarkerClick]
  )

  const handleCloseModal = useCallback(() => {
    setModalVisible(false)
  }, [])

  const handleEventSelect = useCallback(
    (event: MarkerEvent) => {
      const eventId = event.getId?.()
      if (!eventId || !onMarkerClick) return

      const mapMarker = createSingleEventMarker(event)
      if (onMarkerClick) {
        onMarkerClick(mapMarker)
      }
    },
    [onMarkerClick]
  )

  const renderMarkers = useCallback(() => {
    if (!markers || markers.length === 0) {
      return null
    }

    return markers
      .map((marker, index) => {
        if (!marker) {
          return null
        }

        const coordinates = marker.getCoordinates()
        if (!coordinates) {
          return null
        }

        const lat = coordinates.getLatitude()
        const lng = coordinates.getLongitude()

        if (typeof lat !== 'number' || typeof lng !== 'number') {
          return null
        }

        const eventId = marker.getEvent()?.getId?.()
        const id = eventId || ''
        const key = `marker-${id || `${lat}-${lng}`}-${index}`
        const isSelected = selectedEventId !== null && eventId === selectedEventId

        return (
          <MarkerView key={key} coordinate={[lng, lat]} anchor={{ x: 0.5, y: 0.5 }}>
            <Marker mapMarker={marker} onMarkerClick={handleMarkerClick} isSelected={isSelected} />
          </MarkerView>
        )
      })
      .filter(Boolean)
  }, [handleMarkerClick, markers, selectedEventId])

  const renderEventDetailsModal = useCallback(() => {
    return (
      <EventDetailsModal
        visible={modalVisible}
        mapMarker={selectedGroupedMarker}
        onClose={handleCloseModal}
        onEventSelect={handleEventSelect}
      />
    )
  }, [modalVisible, selectedGroupedMarker, handleCloseModal, handleEventSelect])

  return { renderMarkers, renderEventDetailsModal }
}
