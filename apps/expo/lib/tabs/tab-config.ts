import type { Href } from 'expo-router'
import { Bookmark, Calendar, CircleUserIcon, Clock, type LucideIcon, Telescope } from 'lucide-react-native'
import { RouteConfiguration } from '@/routeConfig'

export interface TabConfig {
  pathname: Href
  title: string
  icon: LucideIcon
  testID: string
  active?: boolean
  disabled?: boolean
}

export const tabs: TabConfig[] = [
  {
    pathname: RouteConfiguration.protected.agenda,
    title: 'Agenda',
    icon: Calendar,
    testID: 'agenda-tab',
    disabled: true,
  },
  {
    pathname: RouteConfiguration.protected.explore,
    title: 'Explore',
    icon: Telescope,
    testID: 'explore-tab',
  },
  {
    pathname: RouteConfiguration.protected.now,
    title: 'Now',
    icon: Clock,
    testID: 'now-tab',
  },
  {
    pathname: RouteConfiguration.protected.collections,
    title: 'Collections',
    icon: Bookmark,
    testID: 'collections-tab',
  },
  // {
  //   pathname: RouteConfiguration.protected.social,
  //   title: 'Social',
  //   icon: Users,
  //   testID: 'social-tab',
  //   disabled: true,
  // },
  {
    pathname: RouteConfiguration.protected.profile,
    title: 'Profile',
    icon: CircleUserIcon,
    testID: 'profile-tab',
  },
]
