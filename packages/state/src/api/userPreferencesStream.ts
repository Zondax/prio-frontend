import type { GrpcConfig, User } from '@mono-grpc'
import { UserService } from '@mono-grpc'

// Create a watch preferences request
export const createWatchPreferencesRequest = (): UserService.WatchUserPreferencesRequest => {
  return new UserService.WatchUserPreferencesRequest()
}

// Start the preferences stream
export const startPreferencesStream = async (client: User.UserServiceClient, clientParams: GrpcConfig) => {
  const request = createWatchPreferencesRequest()

  // Get fresh metadata with auth token
  let metadata = { ...clientParams.metadata }
  if (clientParams.authInterceptor) {
    console.log('[UserPreferencesStream] Fetching fresh auth token for stream connection...')
    const authMetadata = await clientParams.authInterceptor()
    metadata = { ...metadata, ...authMetadata }

    // Log token info (safely, without exposing the actual token)
    const tokenKey = Object.keys(authMetadata).find((key) => key.toLowerCase().includes('auth') || key.toLowerCase().includes('token'))
    if (tokenKey && authMetadata[tokenKey]) {
      console.log(`[UserPreferencesStream] Fresh auth token obtained (key: ${tokenKey}, length: ${authMetadata[tokenKey].length})`)
    }
  } else {
    console.warn('[UserPreferencesStream] No authInterceptor configured - stream may fail with authentication errors')
  }

  // Start the gRPC stream with fresh metadata
  const stream = client.watchPreferences(request, metadata as any)

  // Return stream info with cancel function
  return {
    stream,
    cancel: () => {
      // gRPC-web streams have a cancel method
      if (stream && typeof (stream as any).cancel === 'function') {
        ;(stream as any).cancel()
      }
    },
  }
}

// Helper to create a UserPreferences object from partial data
export const createUserPreferences = (data: Partial<UserService.UserPreferences.AsObject>): UserService.UserPreferences => {
  const preferences = new UserService.UserPreferences()

  if (data.userId !== undefined) {
    preferences.setUserId(data.userId)
  }

  if (data.displayName !== undefined) {
    preferences.setDisplayName(data.displayName)
  }

  if (data.themeMode !== undefined) {
    preferences.setThemeMode(data.themeMode)
  }

  if (data.language !== undefined) {
    preferences.setLanguage(data.language)
  }

  if (data.timezone !== undefined) {
    preferences.setTimezone(data.timezone)
  }

  if (data.accessibilitySettingsMap) {
    const map = preferences.getAccessibilitySettingsMap()
    for (const [key, value] of data.accessibilitySettingsMap) {
      map.set(key, value)
    }
  }

  return preferences
}

// Helper to convert UserPreferences to plain object
export const userPreferencesToObject = (preferences: UserService.UserPreferences): UserService.UserPreferences.AsObject => {
  const accessibilityArray: Array<[string, string]> = []
  const map = preferences.getAccessibilitySettingsMap()
  for (const [key, value] of map.entries()) {
    accessibilityArray.push([key, value])
  }

  return {
    userId: preferences.getUserId(),
    displayName: preferences.hasDisplayName() ? preferences.getDisplayName() : undefined,
    themeMode: preferences.hasThemeMode() ? preferences.getThemeMode() : undefined,
    language: preferences.hasLanguage() ? preferences.getLanguage() : undefined,
    timezone: preferences.hasTimezone() ? preferences.getTimezone() : undefined,
    accessibilitySettingsMap: accessibilityArray,
    updatedAt: preferences.hasUpdatedAt() ? preferences.getUpdatedAt()?.toObject() : undefined,
  }
}
