import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Mission } from './prio-mock-data'
import { MISSIONS } from './prio-mock-data'

interface MissionsState {
  missions: Record<string, Mission>
  getMission: (id: string) => Mission | undefined
  getActiveMissions: () => Mission[]
  getMissionsByType: (type: 'individual' | 'team') => Mission[]
  getMissionsByStatus: (status: 'active' | 'planning' | 'completed') => Mission[]
  addMission: (mission: Mission) => void
  updateMission: (id: string, updates: Partial<Mission>) => void
  removeMission: (id: string) => void
  updateMissionProgress: (id: string, progress: number) => void
}

export const useMissionsStore = create<MissionsState>()(
  devtools(
    (set, get) => ({
      missions: MISSIONS,

      getMission: (id) => get().missions[id],

      getActiveMissions: () => {
        const { missions } = get()
        return Object.values(missions).filter((mission) => mission.status === 'active')
      },

      getMissionsByType: (type) => {
        const { missions } = get()
        return Object.values(missions).filter((mission) => mission.type === type)
      },

      getMissionsByStatus: (status) => {
        const { missions } = get()
        return Object.values(missions).filter((mission) => mission.status === status)
      },

      addMission: (mission) =>
        set((state) => ({
          missions: {
            ...state.missions,
            [mission.id]: mission,
          },
        })),

      updateMission: (id, updates) =>
        set((state) => ({
          missions: {
            ...state.missions,
            [id]: {
              ...state.missions[id],
              ...updates,
            },
          },
        })),

      removeMission: (id) =>
        set((state) => {
          const { [id]: _removed, ...rest } = state.missions
          return { missions: rest }
        }),

      updateMissionProgress: (id, progress) =>
        set((state) => ({
          missions: {
            ...state.missions,
            [id]: {
              ...state.missions[id],
              progress,
            },
          },
        })),
    }),
    {
      name: 'missions-store',
    }
  )
)
