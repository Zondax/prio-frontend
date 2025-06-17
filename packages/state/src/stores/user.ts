import type { GrpcConfig, User, UserService } from '@mono-grpc'
import { createGrpcOptimisticStore } from '@zondax/stores'

import { createUserPreferencesClient, readPreferences, writePreferences } from '../api/user'

// Create the preferences store with read and write operations
export const usePreferencesStore = createGrpcOptimisticStore<GrpcConfig, User.UserServiceClient, UserService.UserPreferences, number>({
  createClient: createUserPreferencesClient,
  read: readPreferences,
  write: writePreferences,
})

// Hook to access the loading state
export const usePreferencesLoading = () => usePreferencesStore().isLoading

// Hook to access the write loading state
export const usePreferencesWriting = () => usePreferencesStore().isWriting

// Hook to access the error states
export const usePreferencesError = () => usePreferencesStore().error
export const usePreferencesWriteError = () => usePreferencesStore().writeError
