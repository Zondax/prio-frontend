import type { GrpcConfig, User, UserService } from '@mono-grpc'
import { createRealtimeStore } from '@zondax/stores'

import { createUserPreferencesClient, readPreferences, writePreferences } from '../api/user'

// Create the preferences store with read and write operations
export const usePreferencesStore = createRealtimeStore<GrpcConfig, User.UserServiceClient, UserService.UserPreferences, number>({
  createClient: createUserPreferencesClient,
  read: readPreferences,
  write: writePreferences,
})

// Hook to access the loading state
export const usePreferencesLoading = () => usePreferencesStore().isLoading

// Hook to access the write loading state
export const usePreferencesWriting = () => usePreferencesStore().isLoading('write')

// Hook to access the error states
export const usePreferencesError = () => {
  const store = usePreferencesStore()
  return store.errors?.read || null
}
export const usePreferencesWriteError = () => {
  const store = usePreferencesStore()
  return store.errors?.write || null
}

// Hook that provides a simpler API for preferences
export const usePreferences = () => {
  const store = usePreferencesStore()

  return {
    // Data and operations
    data: store.data,
    // getData removed - use data property directly
    write: store.write,
    refresh: store.refresh,
    setParams: store.setParams,

    // Simple loading states
    isLoading: store.isLoading('read'),
    isWriting: store.isLoading('write'),

    // Simple error states
    error: store.errors?.read || null,
    writeError: store.errors?.write || null,

    // Full store for advanced usage
    store,
  }
}
