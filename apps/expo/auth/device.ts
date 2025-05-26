import * as Application from 'expo-application'
import { Platform } from 'react-native'

export const getAppId = () => {
  return Platform.OS === 'ios' ? process.env.EXPO_PUBLIC_APPLE_BUNDLE_ID! : process.env.EXPO_PUBLIC_ANDROID_PACKAGE_NAME!
}

export const getPlatform = () => {
  return Platform.OS === 'ios' ? 'ios' : 'android'
}

// FIXME: returning unknown is not ideal
export async function getDeviceId(): Promise<string> {
  try {
    if (Platform.OS === PlatformOS.ANDROID) {
      return Application.getAndroidId() ?? 'unknown'
    }

    if (Platform.OS === PlatformOS.IOS) {
      const iosId = await Application.getIosIdForVendorAsync()
      return iosId ?? 'unknown'
    }

    return 'unknown'
  } catch (error) {
    console.warn('Error getting device ID:', error)
    return 'unknown'
  }
}

export function getDevicePlatform(): PlatformOS {
  return PlatformOS[Platform.OS.toUpperCase() as keyof typeof PlatformOS] ?? PlatformOS.UNKNOWN
}

export enum PlatformOS {
  IOS = 'ios',
  ANDROID = 'android',
  WINDOWS = 'windows',
  MACOS = 'macos',
  WEB = 'web',
  UNKNOWN = 'unknown',
}
