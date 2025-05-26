import { type Href, router, usePathname, useSegments } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { isTabActive } from '@/lib/tabs/active-tab'
import { tabs } from '@/lib/tabs/tab-config'
import { useColorScheme } from '@/lib/useColorScheme'

import { Tab } from './tab'

export function CustomTabBar() {
  const { isDarkColorScheme } = useColorScheme()
  const pathname = usePathname()
  const insets = useSafeAreaInsets()
  const segments = useSegments()

  const getActiveColor = () => (isDarkColorScheme ? '#fff' : '#000')
  const getInactiveColor = () => (isDarkColorScheme ? '#888' : '#888')

  const navigateToTab = (tabPath: Href) => {
    router.replace(tabPath)
  }

  return (
    <View
      className="flex-row border-t border-border"
      style={{
        backgroundColor: isDarkColorScheme ? '#000' : '#fff',
        paddingTop: 10,
        paddingBottom: insets.bottom,
      }}
    >
      {tabs.map((tab) => {
        const isFocused = isTabActive(tab.pathname.toString(), segments)
        const color = isFocused ? getActiveColor() : getInactiveColor()

        return (
          <Tab
            key={tab.pathname.toString()}
            title={tab.title}
            icon={tab.icon}
            focused={isFocused}
            color={color}
            disabled={tab.disabled}
            onPress={() => !tab.disabled && navigateToTab(tab.pathname)}
            testID={tab.testID}
          />
        )
      })}
    </View>
  )
}
