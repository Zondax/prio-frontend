'use client'

import { useAuth } from '@zondax/auth-expo'
import { useRouter } from 'expo-router'
import { Bell, ChevronRight, HelpCircle, Key, Moon, Shield, Sun, User } from 'lucide-react-native'
import React from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Text } from '~/components/ui/text'
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar'
import { useColorScheme } from '~/lib/useColorScheme'

export default function ProfileScreen() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const insets = useSafeAreaInsets()
  const { isDarkColorScheme, setColorScheme } = useColorScheme()
  const togglePosition = useSharedValue(isDarkColorScheme ? 1 : 0)

  const handleLogout = () => {
    signOut()
  }

  const handleBackToBeginning = () => {
    router.replace('/')
  }

  const toggleTheme = () => {
    const newTheme = isDarkColorScheme ? 'light' : 'dark'
    setColorScheme(newTheme)
    setAndroidNavigationBar(newTheme)
    togglePosition.value = withTiming(newTheme === 'dark' ? 1 : 0, { duration: 250 })
  }

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: togglePosition.value * 24 }],
    }
  })

  const menuItems = [
    { icon: Shield, label: 'Privacy & Security' },
    { icon: Bell, label: 'Notifications' },
    { icon: Key, label: 'Account Settings' },
    { icon: HelpCircle, label: 'Help & Support' },
  ]

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="p-6">
        {/* Profile header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center mb-4">
            <User size={40} className="text-foreground" />
          </View>
          <Text className="text-2xl font-bold text-foreground">{`${user?.given_name || ''} ${user?.family_name || ''}`}</Text>
          <Text className="text-muted-foreground mb-4">Email: {user?.email}</Text>

          <Button variant="outline" size="sm" onPress={handleBackToBeginning}>
            <Text className="text-foreground">Back to Beginning</Text>
          </Button>
        </View>

        <Separator className="my-6" />

        {/* Theme toggle */}
        <Card className="mb-6 overflow-hidden">
          <TouchableOpacity
            className="flex-row items-center justify-between p-4 active:bg-muted/50"
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              {isDarkColorScheme ? <Moon size={20} className="mr-3 text-foreground" /> : <Sun size={20} className="mr-3 text-foreground" />}
              <Text className="font-medium text-foreground">{isDarkColorScheme ? 'Dark Mode' : 'Light Mode'}</Text>
            </View>
            <View className="w-14 h-7 rounded-full px-1.5 flex-row items-center bg-muted">
              <Animated.View className="w-5 h-5 rounded-full bg-primary shadow-sm" style={animatedThumbStyle} />
            </View>
          </TouchableOpacity>
        </Card>

        {/* Menu items */}
        <Text className="text-lg font-semibold mb-4 text-foreground">Settings</Text>
        <Card className="overflow-hidden">
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              {index > 0 && <Separator />}
              <TouchableOpacity activeOpacity={0.7} className="active:bg-muted/50">
                <View className="flex-row items-center p-4">
                  <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-3">
                    <item.icon size={16} className="text-foreground" />
                  </View>
                  <Text className="flex-1 font-medium text-foreground">{item.label}</Text>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </View>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </Card>

        <Button className="w-full mt-8" variant="destructive" onPress={handleLogout}>
          <Text className="text-destructive-foreground">Sign Out</Text>
        </Button>
      </View>
    </ScrollView>
  )
}
