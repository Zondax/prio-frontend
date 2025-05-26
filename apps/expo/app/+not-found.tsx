import { Link, Stack, useRouter } from 'expo-router'
import { ArrowLeft, Home, MapPin } from 'lucide-react-native'
import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '~/components/ui/button'
import { Text } from '~/components/ui/text'

export default function NotFoundScreen() {
  const insets = useSafeAreaInsets()
  const bounceAnim = React.useRef(new Animated.Value(0)).current
  const router = useRouter()

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [bounceAnim])

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  })

  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, { transform: [{ translateY }] }]}>
            <MapPin size={80} color="#ef4444" />
          </Animated.View>

          <Text className="text-3xl font-bold text-center mt-6 mb-2">Oops! Lost in space</Text>
          <Text className="text-base text-center text-muted-foreground mb-8 px-6">
            We couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </Text>

          <View className="w-full px-6 flex flex-row gap-4">
            <Link href="/" asChild style={styles.flex1}>
              <Button className="flex-row items-center justify-center" variant="default">
                <Home size={18} color="white" style={styles.buttonIcon} />
                <Text className="text-white font-medium">Home</Text>
              </Button>
            </Link>

            <Button
              onPress={() => {
                router.back()
              }}
              className="flex-row items-center justify-center"
              variant="outline"
              style={styles.flex1}
            >
              <ArrowLeft size={18} style={styles.buttonIcon} />
              <Text className="font-medium">Go Back</Text>
            </Button>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  flex1: {
    flex: 1,
  },
})
