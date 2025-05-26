import type { MapBounds } from '@prio-state'

// Helper functions
export const convertToMapBounds = (bounds: GeoJSON.Position[]): MapBounds | undefined => {
  if (!bounds || bounds.length < 2) return undefined

  const northEast = bounds[0]
  const southWest = bounds[1]

  return {
    topLeft: { latitude: northEast[1], longitude: southWest[0] },
    bottomRight: { latitude: southWest[1], longitude: northEast[0] },
  }
}
