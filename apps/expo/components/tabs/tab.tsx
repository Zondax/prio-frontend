import type { LucideIcon } from 'lucide-react-native'
import React from 'react'
import { Pressable, type StyleProp, Text, View, type ViewStyle } from 'react-native'

import { cn } from '@/lib/utils'

interface TabProps {
  style?: StyleProp<ViewStyle> // Custom styles to apply to the tab component
  className?: string // Tailwind CSS class names
  focused?: boolean // Whether the tab is currently active/selected
  color?: string // Color for the tab icon and text
  icon?: LucideIcon // Icon component from lucide-react-native
  title: string // Text label for the tab
  disabled?: boolean // Whether the tab is disabled/non-interactive
  onPress?: () => void // Function to call when tab is pressed
  testID?: string // ID for testing purposes
}

export const Tab = ({ style, focused, color, title, disabled, icon, onPress, testID, className }: TabProps) => {
  const content = (
    <>
      {icon && React.createElement(icon, { size: 24, color: disabled ? '#999' : color })}
      <Text className={`text-[10px] mt-0.5 ${focused && !disabled ? 'font-medium' : ''}`} style={{ color: disabled ? '#999' : color }}>
        {title}
      </Text>
    </>
  )

  if (disabled) {
    return (
      <View style={style} className={cn('flex-1 items-center justify-center opacity-50', className)} testID={testID}>
        {content}
      </View>
    )
  }

  return (
    <Pressable
      style={style}
      className={cn('flex-1 items-center justify-center active:opacity-70', className)}
      onPress={onPress}
      testID={testID}
    >
      {content}
    </Pressable>
  )
}
