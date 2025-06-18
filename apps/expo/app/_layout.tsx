import '~/global.css'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useRef, useState } from 'react'
import { Platform } from 'react-native'
import { AuthProvider } from '@/auth/providers/Auth'
import { SecureConfigProvider } from '@/auth/providers/SecureConfig'
import { RouteConfiguration } from '@/routeConfig'
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar'
import { NAV_THEME } from '~/lib/constants'
import { useColorScheme } from '~/lib/useColorScheme'

const LIGHT_THEME = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
}
const DARK_THEME = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
}

export default function RootLayout() {
  return (
    <SecureConfigProvider>
      <AuthProvider routes={RouteConfiguration}>
        <ThemedComponent />
      </AuthProvider>
      <PortalHost />
    </SecureConfigProvider>
  )
}

function ThemedComponent() {
  const hasMounted = useRef(false)
  const { colorScheme, isDarkColorScheme } = useColorScheme()
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return
    }

    if (Platform.OS === 'android') {
      setAndroidNavigationBar(colorScheme)
    }
    setIsColorSchemeLoaded(true)
    hasMounted.current = true
  }, [colorScheme])

  if (!isColorSchemeLoaded) {
    return null
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(protected)/(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </ThemeProvider>
  )
}

const useIsomorphicLayoutEffect = Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect
