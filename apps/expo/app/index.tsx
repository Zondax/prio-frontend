import React from 'react'
import { Pressable, Text, View } from 'react-native'

export default function LandingPage() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-gray-900 mb-8">Hello Kickstarter</Text>

      {/* Example button with safe touch handling and proper shadow */}
      <Pressable className="bg-blue-500 px-6 py-3 rounded-lg shadow-md active:shadow-lg">
        <Text className="text-white font-semibold">Click me</Text>
      </Pressable>

      {/* Card with proper shadow styling */}
      <View className="mt-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <Text className="text-lg font-semibold text-gray-800 mb-2">Sample Card</Text>
        <Text className="text-gray-600">This card uses the updated shadow utilities that are compatible with React Native.</Text>
      </View>
    </View>
  )
}
