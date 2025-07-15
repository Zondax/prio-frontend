import type { TreeNode } from '@zondax/ui-common'
import { Bot, CheckCircle, Clock, MessageSquare, Sparkles, Target, Users } from 'lucide-react'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { useActivitiesStore } from './activities-store'
import { useChatChannelsStore } from './chat-channels-store'
import { useComposedStore } from './composed-stores'
import { useMissionsStore } from './missions-store'

interface NavigationState {
  getNavigationNodes: () => TreeNode[]
  getActivityFeed: (limit?: number) => Array<{
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    description: string
    time: string
  }>
  getRecentActivityItems: () => Array<{
    id: string
    icon: any
    iconColor: string
    title: string
    description: string
    time: string
  }>
}

export const useNavigationStore = create<NavigationState>()(
  devtools(
    () => ({
      getNavigationNodes: (): TreeNode[] => {
        const chatChannels = useChatChannelsStore.getState().getActiveChatChannels()
        const activeMissions = useMissionsStore.getState().getActiveMissions()

        return [
          {
            id: 'chats',
            label: 'Chats',
            icon: MessageSquare,
            href: '/prio/chats',
            children: chatChannels.map((chat) => ({
              id: `chat-${chat.id}`,
              label: chat.name,
              icon: chat.type === 'ai' ? Bot : chat.type === 'mixed' ? Sparkles : Users,
              href: `/prio/chats/${chat.id}`,
              badge: chat.type === 'team' ? '●' : undefined,
            })),
          },
          {
            id: 'missions',
            label: 'Missions',
            icon: Target,
            href: '/prio/missions',
            children: activeMissions.map((mission) => ({
              id: `mission-${mission.id}`,
              label: mission.name,
              icon: Target,
              href: `/prio/missions/${mission.id}`,
              badge: mission.status === 'active' ? '●' : undefined,
            })),
          },
          {
            id: 'objectives',
            label: 'Objectives',
            icon: Target,
            href: '/prio/objectives',
          },
        ]
      },

      getActivityFeed: (limit = 10) => {
        const activities = useActivitiesStore.getState().getRecentActivities(limit)
        const formatTime = useComposedStore.getState().formatRelativeTime

        return activities.map((activity) => ({
          id: activity.id,
          type: activity.type,
          title: activity.title,
          description: activity.description,
          time: formatTime(activity.timestamp),
        }))
      },

      getRecentActivityItems: () => {
        const activityFeed = useNavigationStore.getState().getActivityFeed(4)

        return activityFeed.map((activity) => ({
          id: activity.id,
          icon: activity.type === 'success' ? CheckCircle : activity.type === 'warning' ? Clock : MessageSquare,
          iconColor:
            activity.type === 'success'
              ? 'text-green-600'
              : activity.type === 'warning'
                ? 'text-yellow-600'
                : activity.type === 'error'
                  ? 'text-red-600'
                  : 'text-blue-600',
          title: activity.title,
          description: activity.description,
          time: activity.time,
        }))
      },
    }),
    {
      name: 'navigation-store',
    }
  )
)
