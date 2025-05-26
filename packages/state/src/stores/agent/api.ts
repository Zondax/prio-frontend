///////////////////////////////////////////////
import type { GrpcConfig } from '@prio-grpc'
import { createGrpcSingleMethodStore } from '@zondax/stores'
import { create } from 'zustand'

import { type AgentClient, type AgentInput, type AgentResponse, createAgentClient, sendMessage } from '../../api/agent'

// Define internal state for the API client store
interface ApiClientInternalState {
  client: AgentClient | null
  config: GrpcConfig
  isInitialized: boolean
}

// Define API client actions
interface ApiClientActions {
  initialize: () => void
  updateConfig: (config: Partial<GrpcConfig>) => void
  sendMessage: (input: AgentInput) => Promise<AgentResponse>
}

// Combine internal state and actions for the complete store type
export type ApiClientStore = ApiClientInternalState & ApiClientActions

// Create the API client store
export const useApiClientStore = create<ApiClientStore>((set, get) => {
  return {
    // Internal state with initial values
    client: null,
    config: {
      baseUrl: 'http://localhost:9080',
      metadata: {},
    },
    isInitialized: false,

    // Actions implementation
    initialize: () => {
      // Only create a new client if one doesn't already exist
      if (!get().client) {
        try {
          const client = createAgentClient(get().config)
          set({ client, isInitialized: true })
        } catch (error) {
          console.error('Failed to initialize API client:', error)
          set({ isInitialized: false })
        }
      }
    },

    updateConfig: (config) => {
      set((state) => ({
        config: { ...state.config, ...config },
        // Reset client when config changes to ensure it uses the new config
        client: null,
        isInitialized: false,
      }))
    },

    sendMessage: async (input) => {
      // Ensure client is initialized
      if (!get().isInitialized || !get().client) {
        get().initialize()
      }

      const client = get().client
      const config = get().config

      if (!client) {
        throw new Error('API client could not be initialized')
      }

      try {
        return await sendMessage(client, config, input)
      } catch (error) {
        console.error('Error sending message:', error)
        throw error
      }
    },
  }
})

// Create selectors for different parts of the store
export const useApiClientState = () => {
  return useApiClientStore((state) => ({
    config: state.config,
    isInitialized: state.isInitialized,
  }))
}

export const useApiClientActions = () => {
  return useApiClientStore((state) => ({
    initialize: state.initialize,
    updateConfig: state.updateConfig,
    sendMessage: state.sendMessage,
  }))
}

///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

export const useRemoteAgentStore = createGrpcSingleMethodStore<GrpcConfig, AgentClient, AgentInput, AgentResponse>({
  createClient: createAgentClient,
  method: sendMessage,
})
