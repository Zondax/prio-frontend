'use client'

import { useAuth } from '@zondax/auth-expo'
import { useRouter } from 'expo-router'
import { LogIn } from 'lucide-react-native'
import React from 'react'
import { View } from 'react-native'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Text } from '~/components/ui/text'
import { RouteConfiguration } from '~/routeConfig'

import { replace } from '@/lib/navigation'

export default function LoginScreen() {
  const router = useRouter()
  const { signIn, isLoading } = useAuth()

  const { accessToken } = useAuth()

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (accessToken) {
      replace(router, RouteConfiguration.protected.explore)
    }
  }, [accessToken, router])

  const handleLogin = async () => {
    try {
      await signIn()
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <View className="flex-1 justify-center items-center p-6 bg-background">
      <Card className="w-full max-w-sm p-6">
        <View className="items-center mb-6">
          <View className="w-16 h-16 bg-primary rounded-full items-center justify-center mb-4">
            <LogIn size={28} color="white" />
          </View>
          <Text className="text-2xl font-bold text-foreground text-center">Sign in to Prio</Text>
          <Text className="text-muted-foreground text-center mt-2">Sign in to access your account</Text>
        </View>

        <Button className="w-full mt-4" onPress={handleLogin} disabled={isLoading}>
          <Text className="text-primary-foreground font-medium">{isLoading ? 'Signing in...' : 'Sign in'}</Text>
        </Button>

        <Text className="text-xs text-muted-foreground text-center mt-6">
          This is a demo login. Email authentication with Zitadel will be implemented later.
        </Text>
      </Card>
    </View>
  )
}
