import { create } from 'zustand'

interface EventSelectionState {
  // Store selected event IDs
  selectedEventIds: string[]
  // Flag to indicate if selection mode is active
  isSelectionModeActive: boolean

  // Actions
  toggleEventSelection: (eventId: string) => void
  selectEvents: (eventIds: string[]) => void
  deselectEvents: (eventIds: string[]) => void
  clearSelection: () => void
  toggleSelectionMode: () => void
  setSelectionMode: (active: boolean) => void
  isEventSelected: (eventId: string) => boolean
}

export const useEventSelectionStore = create<EventSelectionState>((set, get) => ({
  selectedEventIds: [],
  isSelectionModeActive: false,

  toggleEventSelection: (eventId: string) => {
    set((state) => {
      const isSelected = state.selectedEventIds.includes(eventId)

      if (isSelected) {
        // Deselect the event
        return {
          selectedEventIds: state.selectedEventIds.filter((id) => id !== eventId),
          // If we deselect all events, exit selection mode
          isSelectionModeActive: state.selectedEventIds.length > 1 ? state.isSelectionModeActive : false,
        }
      }
      // Select the event and activate selection mode if it's not already active
      return {
        selectedEventIds: [...state.selectedEventIds, eventId],
        isSelectionModeActive: true,
      }
    })
  },

  selectEvents: (eventIds: string[]) => {
    set((state) => {
      // Add events that aren't already selected
      const uniqueIds = Array.from(new Set([...state.selectedEventIds, ...eventIds]))
      return {
        selectedEventIds: uniqueIds,
        isSelectionModeActive: uniqueIds.length > 0,
      }
    })
  },

  deselectEvents: (eventIds: string[]) => {
    set((state) => {
      const newSelectedIds = state.selectedEventIds.filter((id) => !eventIds.includes(id))
      return {
        selectedEventIds: newSelectedIds,
        isSelectionModeActive: newSelectedIds.length > 0,
      }
    })
  },

  clearSelection: () => {
    set({
      selectedEventIds: [],
      isSelectionModeActive: false,
    })
  },

  toggleSelectionMode: () => {
    set((state) => ({
      isSelectionModeActive: !state.isSelectionModeActive,
      // Clear selection when exiting selection mode
      selectedEventIds: !state.isSelectionModeActive ? state.selectedEventIds : [],
    }))
  },

  setSelectionMode: (active: boolean) => {
    set({
      isSelectionModeActive: active,
      // Clear selection when exiting selection mode
      selectedEventIds: active ? get().selectedEventIds : [],
    })
  },

  isEventSelected: (eventId: string) => {
    return get().selectedEventIds.includes(eventId)
  },
}))
