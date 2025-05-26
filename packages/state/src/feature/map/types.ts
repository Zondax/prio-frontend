/**
 * Represents a map move event
 */
export type MapMoveEvent = {
  center: Coordinate
  zoom: number
  bounds?: MapBounds
}

/**
 * Represents a geographic coordinate
 */
export type Coordinate = {
  latitude: number
  longitude: number
}

/**
 * Geographic bounds of the visible map area
 */
export type MapBounds = {
  topLeft: Coordinate
  bottomRight: Coordinate
}
