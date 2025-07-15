import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Participant } from './prio-mock-data'
import { PARTICIPANTS } from './prio-mock-data'

interface ParticipantsState {
  participants: Record<string, Participant>
  getParticipant: (id: string) => Participant | undefined
  getParticipantsByIds: (ids: string[]) => Participant[]
  addParticipant: (participant: Participant) => void
  updateParticipant: (id: string, updates: Partial<Participant>) => void
  removeParticipant: (id: string) => void
}

export const useParticipantsStore = create<ParticipantsState>()(
  devtools(
    (set, get) => ({
      participants: PARTICIPANTS,

      getParticipant: (id) => get().participants[id],

      getParticipantsByIds: (ids) => {
        const { participants } = get()
        return ids.map((id) => participants[id]).filter(Boolean)
      },

      addParticipant: (participant) =>
        set((state) => ({
          participants: {
            ...state.participants,
            [participant.id]: participant,
          },
        })),

      updateParticipant: (id, updates) =>
        set((state) => ({
          participants: {
            ...state.participants,
            [id]: {
              ...state.participants[id],
              ...updates,
            },
          },
        })),

      removeParticipant: (id) =>
        set((state) => {
          const { [id]: _removed, ...rest } = state.participants
          return { participants: rest }
        }),
    }),
    {
      name: 'participants-store',
    }
  )
)
