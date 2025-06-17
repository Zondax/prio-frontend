import { type GrpcConfig, type GrpcMetadata, User, UserService, createMetadataAwareMethod, withAuthMetadata } from '@mono-grpc'

export const createUserPreferencesClient = (cp: GrpcConfig) => {
  return new User.UserServiceClient(cp.baseUrl, cp.metadata as any)
}

// Create metadata-aware method wrappers for clean, reusable API calls
const getUserPreferencesWithAuth = createMetadataAwareMethod<
  User.UserServiceClient,
  UserService.GetUserPreferencesRequest,
  UserService.GetUserPreferencesResponse
>((client, request, metadata) => client.getUserPreferences(request, metadata as any))

const upsertUserPreferencesWithAuth = createMetadataAwareMethod<
  User.UserServiceClient,
  UserService.UpsertUserPreferencesRequest,
  UserService.UpsertUserPreferencesResponse
>((client, request, metadata) => client.upsertUserPreferences(request, metadata as any))

const deleteUserWithAuth = createMetadataAwareMethod<User.UserServiceClient, UserService.DeleteUserRequest, UserService.DeleteUserResponse>(
  (client, request, metadata) => client.deleteUser(request, metadata as any)
)

// Read preferences from the API
export const readPreferences = async (client: User.UserServiceClient, clientParams: GrpcConfig): Promise<UserService.UserPreferences> => {
  const request = new UserService.GetUserPreferencesRequest()
  const response = await getUserPreferencesWithAuth(client, clientParams, request)

  const preferences = response.getPreferences()
  if (!preferences) {
    throw new Error('No preferences returned from API')
  }

  return preferences
}

// Write preferences to the API
export const writePreferences = async (
  client: User.UserServiceClient,
  clientParams: GrpcConfig,
  data: Partial<UserService.UserPreferences>
): Promise<number> => {
  const request = new UserService.UpsertUserPreferencesRequest()
  if (data instanceof UserService.UserPreferences) {
    request.setPreferences(data)
  } else {
    const preferences = new UserService.UserPreferences()
    Object.assign(preferences, data)
    request.setPreferences(preferences)
  }

  const response = await upsertUserPreferencesWithAuth(client, clientParams, request)
  return response.getId()
}

// Delete the current user account
export const deleteUser = async (
  client: User.UserServiceClient,
  clientParams: GrpcConfig
): Promise<{ success: boolean; message: string }> => {
  const request = new UserService.DeleteUserRequest()
  const response = await deleteUserWithAuth(client, clientParams, request)

  return {
    success: response.getSuccess(),
    message: response.getMessage(),
  }
}
