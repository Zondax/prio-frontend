import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Activity } from './prio-mock-data'
import { ACTIVITIES } from './prio-mock-data'

interface ActivitiesState {
  activities: Record<string, Activity>
  getActivity: (id: string) => Activity | undefined
  getRecentActivities: (limit?: number) => Activity[]
  getActivitiesByType: (type: Activity['type']) => Activity[]
  getActivitiesByEntity: (entityType: Activity['entityType'], entityId: string) => Activity[]
  getActivitiesByUser: (userId: string) => Activity[]
  addActivity: (activity: Activity) => void
  removeActivity: (id: string) => void
  clearOldActivities: (daysToKeep: number) => void
}

export const useActivitiesStore = create<ActivitiesState>()(
  devtools(
    (set, get) => ({
      activities: ACTIVITIES,

      getActivity: (id) => get().activities[id],

      getRecentActivities: (limit = 10) => {
        const { activities } = get()
        return Object.values(activities)
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit)
      },

      getActivitiesByType: (type) => {
        const { activities } = get()
        return Object.values(activities).filter((activity) => activity.type === type)
      },

      getActivitiesByEntity: (entityType, entityId) => {
        const { activities } = get()
        return Object.values(activities).filter((activity) => activity.entityType === entityType && activity.entityId === entityId)
      },

      getActivitiesByUser: (userId) => {
        const { activities } = get()
        return Object.values(activities).filter((activity) => activity.userId === userId)
      },

      addActivity: (activity) =>
        set((state) => ({
          activities: {
            ...state.activities,
            [activity.id]: activity,
          },
        })),

      removeActivity: (id) =>
        set((state) => {
          const { [id]: _removed, ...rest } = state.activities
          return { activities: rest }
        }),

      clearOldActivities: (daysToKeep) =>
        set((state) => {
          const cutoffDate = new Date()
          cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

          const filteredActivities = Object.entries(state.activities).reduce(
            (acc, [id, activity]) => {
              if (activity.timestamp >= cutoffDate) {
                acc[id] = activity
              }
              return acc
            },
            {} as Record<string, Activity>
          )

          return { activities: filteredActivities }
        }),
    }),
    {
      name: 'activities-store',
    }
  )
)
