'use client'

import { Slot } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { CustomTabBar } from '~/components/tabs/tab-bar'

export default function ProtectedLayout() {
  return (
    <View style={{ flex: 1 }} className="bg-background">
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <CustomTabBar />
    </View>
  )
}
