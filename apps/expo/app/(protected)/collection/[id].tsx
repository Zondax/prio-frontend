import { useCollectionById, useCollectionEvents, useEndpointStore } from '@prio-state'
import { useGrpcSetup } from '@zondax/auth-expo/hooks'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Collection } from '~/components/collection/collection'

/**
 * Collection Detail Screen - Displays details about a specific collection
 * using the Collection component
 */
export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  // Collection data
  const { collectionWithSummary, isCollectionLoading, isUpdatingCollection, setCollectionParams, updateExistingCollection } =
    useCollectionById(id)

  // Event data
  const { events, isEventLoading, updateEventStatus, setEventParams } = useCollectionEvents(id)

  const { selectedEndpoint } = useEndpointStore()

  // Setup gRPC connections for both stores
  useGrpcSetup(setCollectionParams, selectedEndpoint)
  useGrpcSetup(setEventParams, selectedEndpoint)

  // Handle back button press
  const handleBackPress = useCallback(() => {
    router.back()
  }, [router])

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Collection
        collectionWithSummary={collectionWithSummary}
        isCollectionLoading={isCollectionLoading}
        events={events}
        isEventsLoading={isEventLoading}
        updateEventStatus={updateEventStatus}
        updateCollection={updateExistingCollection}
        isUpdating={isUpdatingCollection}
        onBackPress={handleBackPress}
      />
    </View>
  )
}
