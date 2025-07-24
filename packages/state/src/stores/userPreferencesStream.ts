import type { GrpcConfig, User, UserService } from '@mono-grpc'
import { createRealtimeStore } from '@zondax/stores'
import * as React from 'react'

import { createUserPreferencesClient, readPreferences, writePreferences } from '../api/user'
import { startPreferencesStream } from '../api/userPreferencesStream'

// Create the streaming preferences store with real-time updates and optimistic writes
export const usePreferencesStreamStore = createRealtimeStore<
  GrpcConfig,
  User.UserServiceClient,
  UserService.UserPreferences,
  number,
  UserService.UserPreferences
>({
  createClient: createUserPreferencesClient,
  read: async (client, clientParams) => {
    return await readPreferences(client, clientParams)
  },
  write: async (client, clientParams, input) => {
    // Use the existing writePreferences function which expects partial data
    return await writePreferences(client, clientParams, input)
  },
  stream: {
    start: startPreferencesStream,
    // No transformation needed - stream data matches write input format
    transformData: undefined,
  },
  name: 'UserPreferencesStream',
})

// Hook to get the stream connection status
export const usePreferencesStreamStatus = () => usePreferencesStreamStore().streamStatus || 'disconnected'

// Hook to check if we have pending writes
export const usePreferencesHasPendingWrites = () => usePreferencesStreamStore().hasPendingUpdates()

// Hook to access loading states
export const usePreferencesStreamLoading = () => {
  const store = usePreferencesStreamStore()
  return store.isLoading('connect')
}

export const usePreferencesStreamWriting = () => {
  const store = usePreferencesStreamStore()
  return store.isLoading('write')
}

// Hook to access error states
export const usePreferencesStreamError = () => {
  const store = usePreferencesStreamStore()
  return store.streamError || store.errors?.connect || store.errors?.stream || null
}

export const usePreferencesStreamWriteError = () => {
  const store = usePreferencesStreamStore()
  return store.errors?.write || null
}

// Main hook that provides a simpler API for streaming preferences
export const usePreferencesStream = () => {
  const store = usePreferencesStreamStore()

  return {
    // Connection management
    connect: store.connect || (() => Promise.resolve()),
    disconnect: store.disconnect || (() => {}),
    reconnect: store.reconnect || (() => Promise.resolve()),
    setParams: store.setParams,

    // Data access
    data: store.data, // Get optimistic data (with pending writes)
    streamData: store.getStreamData?.() || null, // Get raw stream data
    write: store.write,

    // Status information
    streamStatus: store.streamStatus || 'disconnected',
    hasPendingWrites: store.hasPendingUpdates() || false,
    lastUpdate: store.lastStreamUpdate || null,

    // Loading states
    isConnecting: store.streamStatus === 'connecting',
    isConnected: store.streamStatus === 'connected',
    isWriting: store.isLoading('write'),

    // Error states
    streamError: store.streamError || null,
    writeError: store.errors?.write || null,
    clearWriteError: () => {}, // Not implemented in new store

    // Full store for advanced usage
    store,
  }
}

// Hook for automatic connection management
export const usePreferencesStreamAutoConnect = (config: GrpcConfig) => {
  const store = usePreferencesStreamStore()
  const hasInitializedRef = React.useRef(false)

  // Set params on mount - connection will happen automatically on first read/write
  React.useEffect(() => {
    // Only set params if we have a valid config with baseUrl
    if (!hasInitializedRef.current && config.baseUrl) {
      hasInitializedRef.current = true
      store.setParams(config)
    }
  }, [config, store])

  // Get values from store
  const data = store.data
  const streamData = store.streamData || null
  const hasPendingWrites = store.hasPendingUpdates() || false

  return {
    // Connection management
    connect: store.connect || (() => Promise.resolve()),
    disconnect: store.disconnect || (() => {}),
    reconnect: store.reconnect || (() => Promise.resolve()),
    setParams: store.setParams,

    // Data access
    data,
    streamData,
    write: store.write,

    // Status information
    streamStatus: store.streamStatus || 'disconnected',
    hasPendingWrites,
    lastUpdate: store.lastStreamUpdate || null,

    // Loading states
    isConnecting: store.streamStatus === 'connecting',
    isConnected: store.streamStatus === 'connected',
    isWriting: store.isLoading('write'),

    // Error states
    streamError: store.streamError || null,
    writeError: store.errors?.write || null,
    clearWriteError: () => {}, // Not implemented in new store

    // Full store for advanced usage
    store,
  }
}
