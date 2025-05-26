export const MAP_DEFAULTS = {
  CENTER: [-0.118092, 51.509865] as [number, number], // London
  ZOOM: 12,
  INITIAL_BOUNDS_CONFIG: {
    LAT_OFFSET_MULTIPLIER: 0.15,
    LNG_OFFSET_MULTIPLIER: 0.2,
    ZOOM_FACTOR: 10,
  },
} as const
