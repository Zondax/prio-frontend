'use client'

import { LayoutGrid, List } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from '@/components/ui/button'

import { useViewType } from './view-type-context'

export function ViewToggleButton() {
  const { viewType, toggleViewType } = useViewType()
  const insets = useSafeAreaInsets()

  // Animation for button press
  const scale = useSharedValue(1)

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 150 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 })
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 16) }]}>
      <Animated.View style={[styles.buttonShadow, animatedStyle]}>
        <Button
          className="rounded-full w-14 h-14 flex items-center justify-center"
          variant="default"
          onPress={toggleViewType}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {viewType === 'timeline' ? <List size={20} className="text-primary" /> : <LayoutGrid size={20} className="text-primary" />}
        </Button>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 50,
    alignItems: 'center',
  },
  buttonShadow: {
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  labelContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
})
