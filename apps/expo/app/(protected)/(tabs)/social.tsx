'use client'

import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SocialScreen() {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: 80,
        paddingHorizontal: 16,
      }}
    >
      <View className="mt-6 mb-4">
        <Text className="text-3xl font-bold text-foreground">Social</Text>
      </View>

      <View className="p-4 mb-4 bg-card rounded-lg">
        <Text className="text-lg font-medium text-foreground mb-2">Coming Soon</Text>
        <Text className="text-muted-foreground">
          This is a temporary placeholder for the social feature. The social functionality will be fully implemented in a future update.
        </Text>
      </View>

      <View className="p-4 bg-card rounded-lg">
        <Text className="text-lg font-medium text-foreground mb-2">What to Expect</Text>
        <Text className="text-muted-foreground mb-3">The social feature will allow you to:</Text>
        <View className="ml-4 mb-2">
          <Text className="text-muted-foreground mb-1">• Connect with other users</Text>
          <Text className="text-muted-foreground mb-1">• Share your activities</Text>
          <Text className="text-muted-foreground mb-1">• Create and join groups</Text>
          <Text className="text-muted-foreground mb-1">• Send private messages</Text>
          <Text className="text-muted-foreground">• Discover trending events</Text>
        </View>
      </View>
    </ScrollView>
  )
}
