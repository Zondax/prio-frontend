'use client'

import { THEME_MODES, getMapStyle } from '@prio-state/feature/map'
import { useTheme } from 'next-themes'
import { useMemo } from 'react'

/**
 * Returns the MapLibre style URL based on the current theme.
 */
export function useMapStyle(): string {
  const { resolvedTheme } = useTheme()
  return useMemo(() => {
    const themeMode = resolvedTheme === THEME_MODES.dark ? THEME_MODES.dark : THEME_MODES.streets
    return getMapStyle(themeMode)
  }, [resolvedTheme])
}
