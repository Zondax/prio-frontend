import { Event } from '@prio-grpc'
import { Coordinates, Location } from '@prio-grpc/entities/proto/api/v1/common_pb'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { THEME_MODES, calculateInitialBounds, createEventMapMarker, createSingleEventMarker, getLocationIQKey, getMapStyle } from './map'

// Mock process.env
const originalEnv = { ...process.env }

describe('Map Utilities', () => {
  beforeEach(() => {
    // Reset process.env before each test
    process.env = { ...originalEnv }

    // Clear all mocks
    vi.resetAllMocks()
  })

  describe('calculateInitialBounds', () => {
    it('should calculate bounds based on center and zoom level', () => {
      const center = { latitude: 40.7128, longitude: -74.006 } // New York
      const zoom = 12

      const bounds = calculateInitialBounds(center, zoom)

      // Verify bounds are calculated correctly
      expect(bounds.topLeft).toBeDefined()
      expect(bounds.bottomRight).toBeDefined()

      // At zoom level 12, we expect a certain offset
      expect(bounds.topLeft.latitude).toBeGreaterThan(center.latitude)
      expect(bounds.topLeft.longitude).toBeLessThan(center.longitude)
      expect(bounds.bottomRight.latitude).toBeLessThan(center.latitude)
      expect(bounds.bottomRight.longitude).toBeGreaterThan(center.longitude)
    })

    it('should adjust bounds based on zoom level', () => {
      const center = { latitude: 40.7128, longitude: -74.006 } // New York

      // Calculate bounds at different zoom levels
      const boundsZoom10 = calculateInitialBounds(center, 10)
      const boundsZoom15 = calculateInitialBounds(center, 15)

      // Higher zoom (15) should have smaller bounds than lower zoom (10)
      const latOffsetZoom10 = boundsZoom10.topLeft.latitude - boundsZoom10.bottomRight.latitude
      const latOffsetZoom15 = boundsZoom15.topLeft.latitude - boundsZoom15.bottomRight.latitude

      expect(latOffsetZoom15).toBeLessThan(latOffsetZoom10)
    })
  })

  describe('getLocationIQKey', () => {
    it('should prioritize EXPO_PUBLIC_LOCATIONIQ_TOKEN', () => {
      process.env.EXPO_PUBLIC_LOCATIONIQ_TOKEN = 'expo-token'
      process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN = 'next-token'

      const token = getLocationIQKey()

      expect(token).toBe('expo-token')
    })

    it('should fall back to NEXT_PUBLIC_LOCATIONIQ_TOKEN if expo token is missing', () => {
      process.env.EXPO_PUBLIC_LOCATIONIQ_TOKEN = undefined
      process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN = 'next-token'

      const token = getLocationIQKey()

      expect(token).toBe('next-token')
    })

    it('should return placeholder if no tokens exist', () => {
      process.env.EXPO_PUBLIC_LOCATIONIQ_TOKEN = undefined
      process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN = undefined

      const token = getLocationIQKey()

      expect(token).toBe('pk.placeholder')
    })
  })

  describe('getMapStyle', () => {
    it('should return the correct URL for each theme mode', () => {
      process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN = 'test-token'

      // Test each theme mode
      for (const mode of Object.values(THEME_MODES)) {
        const styleUrl = getMapStyle(mode)
        expect(styleUrl).toBe(`https://tiles.locationiq.com/v3/${mode}/vector.json?key=test-token`)
      }
    })
  })

  describe('createEventMapMarker', () => {
    it('should return null for events without coordinates', () => {
      // Create a mock event without coordinates
      const mockEvent = new Event.Event()
      mockEvent.setId(1)
      mockEvent.setTitle('Test Event')

      // The event has no location/coordinates set

      const marker = createEventMapMarker(mockEvent)

      expect(marker).toBeNull()
    })

    it('should create a marker with the correct kind and coordinates', () => {
      // Create a mock event with coordinates
      const mockEvent = new Event.Event()
      mockEvent.setId(2)
      mockEvent.setTitle('Test Event with Location')

      // Create and attach a location with coordinates
      const mockLocation = new Location()
      const mockCoordinates = new Coordinates()
      mockCoordinates.setLatitude(51.5074)
      mockCoordinates.setLongitude(-0.1278)
      mockLocation.setCoordinates(mockCoordinates)
      mockEvent.setLocation(mockLocation)

      const marker = createEventMapMarker(mockEvent)

      // Verify the marker is created with correct properties
      expect(marker).not.toBeNull()
      if (marker) {
        expect(marker.getKind()).toBe(Event.MapMarkerKind.MAP_MARKER_KIND_EVENT_ITEM)
        expect(marker.getCoordinates()).toBe(mockCoordinates)

        // Verify event data was transferred to marker event
        const markerEvent = marker.getEvent()
        expect(markerEvent).not.toBeNull()
        if (markerEvent) {
          expect(markerEvent.getId()).toBe(2)
          expect(markerEvent.getTitle()).toBe('Test Event with Location')
        }
      }
    })
  })
})
