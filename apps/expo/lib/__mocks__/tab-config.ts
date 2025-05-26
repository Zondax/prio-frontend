import type { Href } from 'expo-router'

export interface TabConfig {
  pathname: Href
  title: string
  icon: any
  testID: string
  active?: boolean
  disabled?: boolean
}

// Import the real function from the original file
// This is automatically handled by vitest when using vi.mock()
// We don't need to implement it here

// Mock the tabs array
export const tabs: TabConfig[] = [
  {
    pathname: '/(protected)/(tabs)/now',
    title: 'Now',
    icon: 'Clock',
    testID: 'now-tab',
  },
  {
    pathname: '/(protected)/(tabs)/agenda',
    title: 'Agenda',
    icon: 'Calendar',
    testID: 'agenda-tab',
    disabled: false,
  },
  {
    pathname: '/(protected)/(tabs)',
    title: 'Explore',
    icon: 'Telescope',
    testID: 'explore-tab',
  },
  {
    pathname: '/(protected)/(tabs)/profile',
    title: 'Profile',
    icon: 'CircleUserIcon',
    testID: 'profile-tab',
  },
]
