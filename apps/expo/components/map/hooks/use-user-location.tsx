import type { Coordinate } from '@mono-state'
import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

export interface UseUserLocationResult {
  location: Coordinate
  loading: boolean
  error: string | null
  permissionGranted: boolean | null
  requestPermission: () => void
}

/**
 * Hook to get and manage user's current location
 *
 * @returns {Object} Object containing location data, loading state, error, and permission status
 */
export function useUserLocation(): UseUserLocationResult {
  const [location, setLocation] = useState<Coordinate>({
    latitude: 0,
    longitude: 0,
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)

  const requestPermission = useCallback(async () => {
    try {
      setLoading(true)

      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync()
      const isGranted = status === 'granted'
      setPermissionGranted(isGranted)

      if (!isGranted) {
        console.log('Location permission denied')
        setLoading(false)
        return
      }

      // Get current location
      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
      })

      setLocation({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      })
    } catch (err) {
      console.error('Error getting location:', err)
      setError('Failed to get location')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    requestPermission()
  }, [requestPermission])

  return {
    location,
    loading,
    error,
    permissionGranted,
    requestPermission,
  }
}
