'use client'

import { useEffect, useState } from 'react'

export interface UseMaplibreLoaderResult {
  maplibre: typeof import('maplibre-gl') | null
  isLoading: boolean
  loadError: string | null
}

export function useMaplibreLoader(): UseMaplibreLoaderResult {
  const [maplibre, setMaplibre] = useState<typeof import('maplibre-gl') | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    import('maplibre-gl')
      .then((m) => {
        // expose to global so RMap can find maplibre
        ;(window as any).maplibregl = m
        setMaplibre(m)
      })
      .catch((err) => {
        console.error('Failed to load maplibre-gl:', err)
        setLoadError('Failed to load map library.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  return { maplibre, isLoading, loadError }
}
