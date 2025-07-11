'use client'

import { type ActivityItem, cn } from '@zondax/ui-common/client'
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { ACTIVITY_FEED } from './store/prio-mock-data'

function PrioPageContent({ className }: { className?: string }) {
  const router = useRouter()

  // Transform PrioActivity to ActivityItem format
  const activities = useMemo<ActivityItem[]>(() => {
    const iconMap = {
      success: { icon: CheckCircle, color: 'text-green-500' },
      info: { icon: Info, color: 'text-blue-500' },
      warning: { icon: AlertTriangle, color: 'text-yellow-500' },
      error: { icon: XCircle, color: 'text-red-500' },
    }

    return ACTIVITY_FEED.map((activity) => ({
      id: activity.id,
      icon: iconMap[activity.type].icon,
      iconColor: iconMap[activity.type].color,
      title: activity.title,
      description: activity.description,
      time: activity.time,
    }))
  }, [])

  // Keep track of original activity types for the dot indicators
  const activityTypes = useMemo(() => {
    return ACTIVITY_FEED.reduce(
      (acc, activity) => {
        acc[activity.id] = activity.type
        return acc
      },
      {} as Record<string, 'success' | 'info' | 'warning' | 'error'>
    )
  }, [])

  return (
    <div className={cn('h-full p-6', className)}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Priority Dashboard</h1>
          <p className="text-muted-foreground">Manage your personal workspace and collaborative goals</p>
        </div>

        {/* Main Content Area */}
        <div className="grid gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Active Chats</h3>
              <p className="text-2xl font-bold mt-1">12</p>
              <p className="text-xs text-muted-foreground mt-1">3 new today</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Total Missions</h3>
              <p className="text-2xl font-bold mt-1">8</p>
              <p className="text-xs text-muted-foreground mt-1">2 active</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground">Pending Actions</h3>
              <p className="text-2xl font-bold mt-1">5</p>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity Overview</h2>
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => {
                const activityType = activityTypes[activity.id]
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                        activityType === 'success' && 'bg-green-500',
                        activityType === 'warning' && 'bg-yellow-500',
                        activityType === 'error' && 'bg-red-500',
                        activityType === 'info' && 'bg-blue-500'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      {activity.description && <p className="text-sm text-muted-foreground mt-0.5">{activity.description}</p>}
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                type="button"
                className="p-3 text-sm border rounded-md hover:bg-muted/50 transition-colors"
                onClick={() => {
                  router.push('/prio/chat')
                }}
              >
                New Chat
              </button>
              <button
                type="button"
                className="p-3 text-sm border rounded-md hover:bg-muted/50 transition-colors"
                onClick={() => {
                  router.push('/prio/mission')
                }}
              >
                Create Mission
              </button>
              <button type="button" className="p-3 text-sm border rounded-md hover:bg-muted/50 transition-colors">
                View Reports
              </button>
              <button type="button" className="p-3 text-sm border rounded-md hover:bg-muted/50 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PrioPage() {
  return <PrioPageContent />
}
