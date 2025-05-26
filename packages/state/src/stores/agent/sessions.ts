import { create } from 'zustand'

import { defaultWelcomeMessage } from './consts'
import type { AgentMessage, ChatSession } from './types'

// Helper function to generate message IDs
const generateMessageId = () => Math.random().toString(36).substring(2, 9)

// Define internal state
interface SessionInternalState {
  sessions: ChatSession[]
  currentSessionId: string | null
}

// Define session actions
interface SessionActions {
  // Session actions
  createNewSession: () => string // Returns the new session ID
  selectSession: (id: string) => void
  renameSession: (id: string, name: string) => void
  deleteSession: (id: string) => void
  ensureDefaultSession: () => string // Returns the current session ID

  // Message management within sessions
  addMessageToSession: (sessionId: string | null, message: AgentMessage) => void
  getSessionMessages: (sessionId: string | null) => AgentMessage[]
}

// Combine internal state and actions for the complete store type
export type SessionState = SessionInternalState & SessionActions

// Create the sessions store
export const useSessionsStore = create<SessionState>((set, get) => ({
  // Internal state with initial values
  sessions: [],
  currentSessionId: null,

  // Actions implementation
  ensureDefaultSession: () => {
    const { sessions, currentSessionId } = get()

    // If we already have a valid session selected, return it
    if (sessions.length > 0 && currentSessionId) {
      return currentSessionId
    }

    // Create a default session if none exist
    const defaultSession: ChatSession = {
      id: generateMessageId(),
      name: 'New Conversation',
      date: new Date().toISOString(),
      selected: true,
      messages: [defaultWelcomeMessage],
    }

    set({
      sessions: [defaultSession],
      currentSessionId: defaultSession.id,
    })

    return defaultSession.id
  },

  getSessionMessages: (sessionId) => {
    if (!sessionId) return [defaultWelcomeMessage]

    const session = get().sessions.find((s) => s.id === sessionId)
    return session?.messages || [defaultWelcomeMessage]
  },

  addMessageToSession: (sessionId, message) => {
    if (!sessionId) return

    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...(session.messages || []), message],
            }
          : session
      ),
    }))
  },

  createNewSession: () => {
    const newSession: ChatSession = {
      id: generateMessageId(),
      name: 'New Conversation',
      date: new Date().toISOString(),
      selected: true,
      messages: [defaultWelcomeMessage],
    }

    set((state) => {
      // Create a new array with all existing sessions (marked as not selected)
      // plus the new session (marked as selected)
      const updatedSessions = [...state.sessions.map((s) => ({ ...s, selected: false })), newSession]

      return {
        sessions: updatedSessions,
        currentSessionId: newSession.id,
      }
    })

    return newSession.id
  },

  selectSession: (id) => {
    const { sessions } = get()
    const session = sessions.find((s) => s.id === id)

    if (!session) return

    set((state) => ({
      sessions: state.sessions.map((s) => ({
        ...s,
        selected: s.id === id,
      })),
      currentSessionId: id,
    }))
  },

  renameSession: (id, name) => {
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? { ...s, name } : s)),
    }))
  },

  deleteSession: (id) => {
    const { sessions, currentSessionId } = get()

    // Don't delete the last session
    if (sessions.length <= 1) {
      // Instead of deleting, just clear messages and rename to default
      const resetSession = {
        ...sessions[0],
        name: 'New Conversation',
        messages: [defaultWelcomeMessage],
      }

      set({
        sessions: [resetSession],
        currentSessionId: resetSession.id,
      })
      return
    }

    const updatedSessions = sessions.filter((s) => s.id !== id)

    // If we're deleting the current session, select another one
    let newCurrentId = currentSessionId
    if (currentSessionId === id) {
      newCurrentId = updatedSessions[0].id
      updatedSessions[0].selected = true
    }

    set({
      sessions: updatedSessions,
      currentSessionId: newCurrentId,
    })
  },
}))

// Selector to expose only the internal state for consumers
export const useSessionsState = () => {
  return useSessionsStore((state) => ({
    sessions: state.sessions,
    currentSessionId: state.currentSessionId,
  }))
}

// Re-export for convenience
export type { ChatSession }
