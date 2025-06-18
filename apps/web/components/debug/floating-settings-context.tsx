'use client'

import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react'

interface SettingsContextType {
  /**
   * Register settings controls for the current page
   */
  registerSettings: (settings: ReactNode) => void

  /**
   * Clear settings when page changes
   */
  clearSettings: () => void

  /**
   * Get the current settings controls
   */
  getSettings: () => ReactNode | null

  /**
   * Check if settings are available
   */
  hasSettings: boolean
}

const SettingsContext = createContext<SettingsContextType | null>(null)

export function useFloatingSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useFloatingSettings must be used within a FloatingSettingsProvider')
  }
  return context
}

interface FloatingSettingsProviderProps {
  children: ReactNode
}

export function FloatingSettingsProvider({ children }: FloatingSettingsProviderProps) {
  const [settings, setSettings] = useState<ReactNode | null>(null)

  // Use useCallback to memoize the functions to prevent unnecessary re-renders
  const registerSettings = useCallback((settingsContent: ReactNode) => {
    setSettings(settingsContent)
  }, [])

  const clearSettings = useCallback(() => {
    setSettings(null)
  }, [])

  const getSettings = useCallback(() => {
    return settings
  }, [settings])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      registerSettings,
      clearSettings,
      getSettings,
      hasSettings: settings !== null,
    }),
    [registerSettings, clearSettings, getSettings, settings]
  )

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>
}
