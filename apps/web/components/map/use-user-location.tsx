import type { Coordinate } from '@prio-state'
import type { Map as MaplibreMapType } from 'maplibre-gl'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseMapUserLocationProps {
  allowUserLocation: boolean
  mapRef: React.RefObject<MaplibreMapType | any>
  defaultCenter: [number, number]
  defaultZoom: number
}

export interface UseMapUserLocationResult {
  mapCenter: [number, number]
  userLocation: Coordinate
  permissionGranted: boolean | null
  locationError: string | null
  showPermissionDialog: boolean
  setShowPermissionDialog: (open: boolean) => void
  handleLocationClick: () => void
  handleRequestPermission: () => void
}

export function useUserLocation({
  allowUserLocation,
  mapRef,
  defaultCenter,
  defaultZoom,
}: UseMapUserLocationProps): UseMapUserLocationResult {
  // Geolocation state
  const [location, setLocation] = useState<Coordinate>({ latitude: 0, longitude: 0 })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setPermissionGranted(false)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setPermissionGranted(true)
        setLoading(false)
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('User denied the request for geolocation')
            setPermissionGranted(false)
            break
          case err.POSITION_UNAVAILABLE:
            setError('Location information is unavailable')
            break
          case err.TIMEOUT:
            setError('The request to get user location timed out')
            break
          default:
            setError('An unknown error occurred')
        }
        setLoading(false)
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
    )
  }, [])

  useEffect(() => {
    if (allowUserLocation) getUserLocation()
  }, [allowUserLocation, getUserLocation])

  // Map-specific state
  const hasSetUserLocation = useRef(false)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)

  useEffect(() => {
    if (allowUserLocation && !hasSetUserLocation.current && location.latitude && location.longitude) {
      hasSetUserLocation.current = true
    }
  }, [allowUserLocation, location])

  useEffect(() => {
    if (allowUserLocation && permissionGranted === false && error) {
      setShowPermissionDialog(true)
    }
  }, [allowUserLocation, permissionGranted, error])

  const handleLocationClick = useCallback(() => {
    if (allowUserLocation && mapRef.current && location.latitude && location.longitude) {
      mapRef.current.flyTo({ center: [location.longitude, location.latitude], zoom: defaultZoom, essential: true })
    } else if (allowUserLocation && permissionGranted === false) {
      setShowPermissionDialog(true)
    }
  }, [allowUserLocation, mapRef, location, permissionGranted, defaultZoom])

  const handleRequestPermission = useCallback(() => {
    setShowPermissionDialog(false)
    getUserLocation()
  }, [getUserLocation])

  const mapCenter: [number, number] =
    allowUserLocation && location.latitude && location.longitude ? [location.longitude, location.latitude] : defaultCenter

  return {
    mapCenter,
    userLocation: location,
    permissionGranted,
    locationError: error,
    showPermissionDialog,
    setShowPermissionDialog,
    handleLocationClick,
    handleRequestPermission,
  }
}
