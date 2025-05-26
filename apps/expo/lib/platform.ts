import { Platform } from 'react-native'

export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android'
export const isWebOnly = (): boolean => !isMobile

export const PlatformOS = {
  ios: Platform.OS === 'ios',
  android: Platform.OS === 'android',
  web: Platform.OS === 'web',
  windows: Platform.OS === 'windows',
  macos: Platform.OS === 'macos',
  current: Platform.OS,
}
