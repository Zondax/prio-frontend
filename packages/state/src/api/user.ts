import { type GrpcConfig, type Metadata, User, UserService } from '@prio-grpc'

export const createUserPreferencesClient = (cp: GrpcConfig) => {
  return new User.UserServiceClient(cp.baseUrl, cp.metadata as Metadata)
}

// Read preferences from the API
export const readPreferences = async (client: User.UserServiceClient, clientParams: GrpcConfig): Promise<UserService.UserPreferences> => {
  const request = new UserService.GetUserPreferencesRequest()
  const response = await client.getUserPreferences(request, clientParams.metadata as Metadata)

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

  const response = await client.upsertUserPreferences(request, clientParams.metadata as Metadata)
  return response.getId()
}

// Delete the current user account
export const deleteUser = async (
  client: User.UserServiceClient,
  clientParams: GrpcConfig
): Promise<{ success: boolean; message: string }> => {
  const request = new UserService.DeleteUserRequest()
  const response = await client.deleteUser(request, clientParams.metadata as Metadata)

  return {
    success: response.getSuccess(),
    message: response.getMessage(),
  }
}
