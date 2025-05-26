import { THEME_MODES, getMapStyle } from '@prio-state/feature/map'
import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'

// Map style constants
const MAP_STYLE_URL = getMapStyle(THEME_MODES.streets)
const MAP_STYLE_DARK = getMapStyle(THEME_MODES.dark)

/**
 * Custom hook to manage map style based on theme
 * @param darkMode Optional override for dark mode
 * @returns The map style URL to use
 */
export function useMapStyle(darkMode?: boolean): string {
  const [styleUrl, setStyleUrl] = useState('')
  const colorScheme = useColorScheme()

  useEffect(() => {
    const isDarkMode = darkMode ?? colorScheme === THEME_MODES.dark
    const mapStyle = isDarkMode ? MAP_STYLE_DARK : MAP_STYLE_URL
    setStyleUrl(mapStyle)
  }, [darkMode, colorScheme])

  return styleUrl
}
