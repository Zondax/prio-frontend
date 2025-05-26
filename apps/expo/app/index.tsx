import { useAuth } from '@zondax/auth-expo'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { RouteConfiguration } from '~/routeConfig'

// TODO: We should see the behavior of the auth and refactor it
export default function WelcomeScreen() {
  const router = useRouter()
  const { accessToken, isLoading } = useAuth()
  const [hasNavigated, setHasNavigated] = useState(false)

  React.useEffect(() => {
    // Only attempt navigation when auth is loaded and we haven't navigated yet
    if (!isLoading && !hasNavigated) {
      setHasNavigated(true)
      try {
        if (accessToken) {
          router.replace(RouteConfiguration.protected.explore)
        } else {
          router.replace(RouteConfiguration.auth.signin)
        }
      } catch (error) {
        console.error('Navigation error:', error)
        // If navigation fails, reset the flag to try again
        setHasNavigated(false)
      }
    }
  }, [accessToken, isLoading, hasNavigated, router])

  // Show loading indicator while redirecting
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  )
}
