import { vi } from 'vitest'

// Mock expo-router
vi.mock('expo-router', () => ({
  Href: String,
  useSegments: vi.fn(() => []),
  usePathname: vi.fn(() => ''),
  router: {
    replace: vi.fn(),
    push: vi.fn(),
  },
}))

// Mock React Native components
vi.mock('react-native', () => ({
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
  StyleSheet: {
    create: (styles: Record<string, any>) => styles,
  },
}))

// Mock lucide-react-native icons
vi.mock('lucide-react-native', () => ({
  Calendar: 'Calendar',
  CircleUserIcon: 'CircleUserIcon',
  Clock: 'Clock',
  Telescope: 'Telescope',
  LucideIcon: 'LucideIcon',
}))

// Mock react-native-safe-area-context
vi.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: vi.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
  SafeAreaProvider: 'SafeAreaProvider',
  SafeAreaView: 'SafeAreaView',
}))

// Mock the platform module
vi.mock('./platform', () => ({
  isMobile: false,
}))
