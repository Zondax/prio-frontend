import { MAP_DEFAULTS, type MapMarker, type MapMoveEvent, useEndpointStore } from '@mono-state'
import { addGeoBoundsFilter, type Filter } from '@mono-state/feature/events'
import { useDebounce } from '@mono-state/hooks'
import { type EventDetailState, useEventDetailStore } from '@mono-state/stores/event'
import { useEventMapMarkersStore } from '@mono-state/stores/map'
import { useGrpcSetup } from '@zondax/auth-expo/hooks'
import { debounce } from 'lodash'
import { AlertTriangle, MapPin, RefreshCcw, X } from 'lucide-react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Linking, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useUserLocation } from '../map/hooks/use-user-location'
import { MobileMap } from '../map/map'

interface MapViewProps {
  onEventClick: (eventDetailState: EventDetailState) => void
  searchQuery?: string
  isPinnedOnly?: boolean
  externalFilters?: Filter[]
}

export function MapView({ onEventClick, searchQuery = '', isPinnedOnly = false, externalFilters = [] }: MapViewProps) {
  const { markers, isLoading: markersLoading, error, setParams: setMarkersParams, setInput } = useEventMapMarkersStore()
  const { selectedEndpoint } = useEndpointStore()
  const {
    eventDetailData,
    isLoading: isLoadingEventDetail,
    error: eventError,
    fetchById,
    setParams: setEventParams,
  } = useEventDetailStore()

  const { location: userLocation, loading: locationLoading, error: locationError, requestPermission } = useUserLocation()

  // Debounce search query to avoid excessive requests
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // State for managing filters
  const [currentFilters, setCurrentFilters] = useState<Filter[]>([])
  const [currentMapBounds, setCurrentMapBounds] = useState<{
    topLeft: { latitude: number; longitude: number }
    bottomRight: { latitude: number; longitude: number }
  } | null>(null)

  // State for location permission modal
  const [locationModalVisible, setLocationModalVisible] = useState<boolean>(false)
  const [locationWarningVisible, setLocationWarningVisible] = useState<boolean>(false)

  // Show location modal when there's a location error
  useEffect(() => {
    if (locationError) {
      setLocationModalVisible(true)
    }
  }, [locationError])

  // Determine map center - prioritize user location if available
  const getUserCenter = useCallback((): [number, number] => {
    if (userLocation.latitude && userLocation.longitude) {
      return [userLocation.longitude, userLocation.latitude] as [number, number]
    }
    return MAP_DEFAULTS.CENTER
  }, [userLocation.latitude, userLocation.longitude])

  const mapCenter = getUserCenter()
  const mapZoom = MAP_DEFAULTS.ZOOM

  const isLoading = markersLoading || locationLoading

  useGrpcSetup(setMarkersParams, selectedEndpoint)
  useGrpcSetup(setEventParams, selectedEndpoint)

  // Update geographic filter when map bounds change
  useEffect(() => {
    if (currentMapBounds) {
      // Add geographic bounds filter to external filters
      const filtersWithGeo = addGeoBoundsFilter(currentMapBounds, externalFilters)

      // Update the filters state
      setCurrentFilters(filtersWithGeo)
    }
  }, [currentMapBounds, externalFilters])

  // Apply filters when they change
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

  // Handle map movement with debounce
  const debouncedMapMove = useCallback(
    debounce((event: MapMoveEvent) => {
      if (event.bounds) {
        setCurrentMapBounds(event.bounds)
      }
    }, 500),
    []
  )

  const handleMapMove = useCallback(
    (event: MapMoveEvent) => {
      debouncedMapMove(event)
    },
    [debouncedMapMove]
  )

  // Handle location permission request
  const handleRequestLocation = useCallback(async () => {
    try {
      await requestPermission()
      setLocationModalVisible(false)
      setLocationWarningVisible(false)
    } catch (error) {
      console.error('Failed to request location permission:', error)
      // Keep modal open if permission request fails
    }
  }, [requestPermission])

  // Open device settings to change location permissions
  const openSettings = useCallback(() => {
    setLocationModalVisible(false)
    setLocationWarningVisible(true)
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:')
    } else {
      Linking.openSettings()
    }
  }, [])

  return (
    <View style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Loading indicator */}
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: [{ translateX: -20 }],
            zIndex: 10,
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <ActivityIndicator size="small" className="text-primary" />
        </View>
      )}

      {/* Error display */}
      {error && !isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 16,
            left: '50%',
            transform: [{ translateX: -100 }],
            zIndex: 10,
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: 200,
          }}
        >
          <Text style={{ color: 'red', flex: 1, marginRight: 8 }}>Failed to load map data</Text>
          <TouchableOpacity style={{ padding: 4 }}>
            <RefreshCcw size={16} className="text-primary" />
          </TouchableOpacity>
        </View>
      )}

      {/* Location warning icon - shown when permission was denied but modal is closed */}
      {userLocation.latitude === 0 && userLocation.longitude === 0 && (
        <TouchableOpacity style={styles.locationWarningButton} onPress={() => setLocationModalVisible(true)}>
          <AlertTriangle size={24} color="#FF9800" />
        </TouchableOpacity>
      )}

      {/* Location request button - always visible in top right */}
      <TouchableOpacity style={styles.locationButton} onPress={handleRequestLocation}>
        <MapPin size={24} color="#4285F4" />
      </TouchableOpacity>

      {/* Location Permission Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={locationModalVisible}
        onRequestClose={() => {
          setLocationModalVisible(false)
          setLocationWarningVisible(true)
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Location Access Required</Text>
              <TouchableOpacity
                onPress={() => {
                  setLocationModalVisible(false)
                  setLocationWarningVisible(true)
                }}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalText}>
              To show your location on the map and provide better recommendations, we need access to your device's location.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={() => {
                  setLocationModalVisible(false)
                  setLocationWarningVisible(true)
                }}
              >
                <Text style={styles.secondaryButtonText}>Not Now</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.primaryButton]} onPress={openSettings}>
                <Text style={styles.primaryButtonText}>Open Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.modalButton, styles.primaryButton]} onPress={handleRequestLocation}>
                <Text style={styles.primaryButtonText}>Allow Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Map component */}
      <MobileMap
        markers={markers}
        currentLocation={userLocation}
        center={mapCenter}
        zoom={mapZoom}
        onMarkerClick={handleMarkerClick}
        onMapMove={handleMapMove}
        allowDrag={true}
        allowZoom={true}
        allowRotate={false}
        showControls={true}
        showGeolocationControl={true}
        isLoading={isLoading}
      />
    </View>
  )
}

// Styles for the location permission UI
const styles = StyleSheet.create({
  locationButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  locationWarningButton: {
    position: 'absolute',
    top: 16,
    right: 70,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'column',
    gap: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4285F4',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#f1f1f1',
  },
  secondaryButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
})
