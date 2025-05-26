import type { GrpcConfig } from '@prio-grpc'
import { create } from 'zustand'

import { useApiClientStore } from './api'
import { defaultWelcomeMessage } from './consts'
import { useSessionsStore } from './sessions'
import type { AgentInput, AgentMessage, AgentResponse } from './types'

// Helper function to generate message IDs
const generateMessageId = () => Math.random().toString(36).substring(2, 9)

// Define internal state
interface AgentInternalState {
  // Proxied from sessions store
  sessions: ReturnType<typeof useSessionsStore.getState>['sessions']
  currentSessionId: ReturnType<typeof useSessionsStore.getState>['currentSessionId']

  // Agent-specific state
  messages: AgentMessage[]
  isProcessing: boolean

  // Proxied from API client store (for backward compatibility)
  apiClient: ReturnType<typeof useApiClientStore.getState>['client']
  apiConfig: ReturnType<typeof useApiClientStore.getState>['config']
}

// Define agent actions
interface AgentActions {
  // API client initialization (for backward compatibility)
  initApiClient: () => void

  // Chat actions
  addMessage: (message: Omit<AgentMessage, 'id' | 'timestamp'>) => void
  addUserMessage: (content: string) => void
  addAssistantMessage: (content: string, type?: 'text' | 'markdown' | 'code') => void
  clearMessages: () => void

  // Session management (delegates to sessions store)
  ensureDefaultSession: () => void
  createNewSession: () => void
  selectSession: (id: string) => void
  renameSession: (id: string, name: string) => void
  deleteSession: (id: string) => void
  setParams: (params: GrpcConfig) => void
}

// Combine internal state and actions for the complete store type
export type AgentStore = AgentInternalState & AgentActions

// Create the agent store
export const useAgentStore = create<AgentStore>((set, get) => {
  // Get the initial values from the underlying stores
  const sessionsStoreInitial = useSessionsStore.getState()
  const apiClientStoreInitial = useApiClientStore.getState()

  // Subscribe to sessions store changes to keep our proxied state in sync
  useSessionsStore.subscribe((state) => {
    set({
      sessions: state.sessions,
      currentSessionId: state.currentSessionId,
      messages: state.getSessionMessages(state.currentSessionId),
    })
  })

  // Subscribe to API client store changes to keep our proxied state in sync
  useApiClientStore.subscribe((state) => {
    set({
      apiClient: state.client,
      apiConfig: state.config,
    })
  })

  return {
    // Internal state with initial values
    sessions: sessionsStoreInitial.sessions,
    currentSessionId: sessionsStoreInitial.currentSessionId,
    messages: sessionsStoreInitial.getSessionMessages(sessionsStoreInitial.currentSessionId),
    isProcessing: false,
    apiClient: apiClientStoreInitial.client,
    apiConfig: apiClientStoreInitial.config,

    // Actions implementation
    initApiClient: () => {
      // Delegate to API client store
      useApiClientStore.getState().initialize()
    },

    setParams: (params: GrpcConfig) => {
      // Update API client configuration
      useApiClientStore.getState().updateConfig(params)
    },

    ensureDefaultSession: () => {
      const sessionsStore = useSessionsStore.getState()
      const sessionId = sessionsStore.ensureDefaultSession()

      // Update messages to match the current session
      const sessionMessages = sessionsStore.getSessionMessages(sessionId)
      set({ messages: sessionMessages })
    },

    addMessage: (messageData) => {
      const message: AgentMessage = {
        ...messageData,
        id: generateMessageId(),
        timestamp: new Date(),
      }

      set((state) => ({
        messages: [...state.messages, message],
      }))

      // Also store message in the session for persistence
      const sessionsStore = useSessionsStore.getState()
      sessionsStore.addMessageToSession(sessionsStore.currentSessionId, message)
    },

    addUserMessage: (content) => {
      // Ensure we have a session to add messages to
      get().ensureDefaultSession()

      // Ensure API client is initialized
      get().initApiClient()

      get().addMessage({
        role: 'user',
        content,
        type: 'text',
      })

      // Set processing state
      set({ isProcessing: true })

      // Get the current session ID
      const sessionId = useSessionsStore.getState().currentSessionId

      const messageInput: AgentInput = {
        message: content,
        sessionId: sessionId || undefined,
      }

      // Send message using the API client store
      useApiClientStore
        .getState()
        .sendMessage(messageInput)
        .then((response: AgentResponse) => {
          get().addAssistantMessage(response.result)
        })
        .catch((error) => {
          // Check if the error is from axios
          const errorMessage = error.isAxiosError
            ? '🌐 Sorry, there was a network error. \n Please check your connection and try again.'
            : 'Sorry, there was an error processing your request.'

          // Add an error message if the API call fails
          get().addAssistantMessage(errorMessage, 'text')
        })
        .finally(() => {
          set({ isProcessing: false })
        })
    },

    addAssistantMessage: (content, type = 'text') => {
      get().addMessage({
        role: 'assistant',
        content,
        type,
      })
    },

    clearMessages: () => set({ messages: [] }),

    createNewSession: () => {
      const sessionsStore = useSessionsStore.getState()
      const newSessionId = sessionsStore.createNewSession()

      // Update messages to match the new session
      set({ messages: [defaultWelcomeMessage] })
    },

    selectSession: (id) => {
      const sessionsStore = useSessionsStore.getState()
      sessionsStore.selectSession(id)

      // Update messages to match the selected session
      const sessionMessages = sessionsStore.getSessionMessages(id)
      set({ messages: sessionMessages })
    },

    renameSession: (id, name) => {
      useSessionsStore.getState().renameSession(id, name)
    },

    deleteSession: (id) => {
      const sessionsStore = useSessionsStore.getState()
      const currentSessionId = sessionsStore.currentSessionId

      sessionsStore.deleteSession(id)

      // If we deleted the current session, update messages
      if (id === currentSessionId) {
        const newCurrentId = sessionsStore.currentSessionId
        const sessionMessages = sessionsStore.getSessionMessages(newCurrentId)
        set({ messages: sessionMessages })
      }
    },
  }
})

// Create selectors for different parts of the store
export const useAgentState = () => {
  return useAgentStore((state) => ({
    sessions: state.sessions,
    currentSessionId: state.currentSessionId,
    messages: state.messages,
    isProcessing: state.isProcessing,
  }))
}

export const useAgentActions = () => {
  return useAgentStore((state) => ({
    addUserMessage: state.addUserMessage,
    addAssistantMessage: state.addAssistantMessage,
    clearMessages: state.clearMessages,
    createNewSession: state.createNewSession,
    selectSession: state.selectSession,
    renameSession: state.renameSession,
    deleteSession: state.deleteSession,
  }))
}

// For convenience, provide access to session store data
export const getSessionsData = () => {
  const { sessions, currentSessionId } = useSessionsStore.getState()
  return { sessions, currentSessionId }
}

// Re-export types for consumers
export type { AgentMessage, AgentResponse, AgentInput }
export type { ChatSession } from './sessions'
export { useApiClientStore, useApiClientState, useApiClientActions } from './api'
