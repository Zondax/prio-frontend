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
export const usePreferencesLoading = () => usePreferencesStore().isLoading('read')

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
