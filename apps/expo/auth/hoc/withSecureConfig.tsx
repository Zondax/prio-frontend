import type React from 'react'
import { ActivityIndicator, View } from 'react-native'

import { useSecureConfig } from '../hooks/secureConfig'

/**
 * HOC that ensures the wrapped component only renders when secure config is ready
 * @param Component The component to wrap
 */
export function withSecureConfig<P extends object>(Component: React.ComponentType<P>) {
  return function WithSecureConfig(props: P) {
    const { isReady, error } = useSecureConfig()

    if (!isReady) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#999999" />
        </View>
      )
    }

    if (error) {
      console.error('SecureConfig Error:', error)
      return null
    }

    return <Component {...props} />
  }
}
