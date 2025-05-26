import { useRouter } from 'expo-router'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Collections } from '~/components/collection/collections'

/**
 * Collections Screen - Displays a list of user's collections
 */
export default function CollectionsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  // Handle collection selection
  const handleCollectionSelect = useCallback(
    (collectionId: string) => {
      // Navigate to collection details
      router.push(`/(protected)/collection/${collectionId}`)
    },
    [router]
  )

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Collections onCollectionSelect={handleCollectionSelect} />
    </View>
  )
}
