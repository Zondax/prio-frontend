import type { GrpcConfig, GrpcMetadata } from './types'

/**
 * @fileoverview
 * gRPC Metadata Utilities with Auth Interceptor Support
 *
 * This module provides utilities for handling gRPC metadata with automatic
 * authentication token injection. It solves the problem of token expiration
 * by providing fresh tokens on every gRPC call without causing re-renders.
 *
 * @example Basic Usage
 * ```typescript
 * import { getMetadata, withAuthMetadata, createMetadataAwareMethod } from '@mono-grpc'
 *
 * // Option 1: Direct metadata access
 * const metadata = await getMetadata(clientParams)
 *
 * // Option 2: Wrapper pattern
 * const result = await withAuthMetadata(clientParams, (metadata) =>
 *   client.method(request, metadata)
 * )
 *
 * // Option 3: Method factory (recommended)
 * const methodWithAuth = createMetadataAwareMethod(
 *   (client, request, metadata) => client.method(request, metadata)
 * )
 * ```
 */

// ============================================================================
// CORE METADATA FUNCTIONS
// ============================================================================

/**
 * Gets fresh metadata by merging base metadata with auth interceptor results.
 *
 * This function is the foundation of the auth interceptor pattern. It:
 * 1. Starts with the base metadata from clientParams
 * 2. If an authInterceptor is provided, calls it to get fresh auth data
 * 3. Merges both metadata objects, with auth data taking precedence
 *
 * @param clientParams - The gRPC configuration containing base metadata and optional auth interceptor
 * @returns Promise resolving to fresh metadata with authentication headers
 *
 * @example
 * ```typescript
 * const clientParams = {
 *   baseUrl: 'https://api.example.com',
 *   metadata: { 'custom-header': 'value' },
 *   authInterceptor: async () => ({ 'x-auth-token': 'fresh-token' })
 * }
 *
 * const metadata = await getMetadata(clientParams)
 * // Result: { 'custom-header': 'value', 'x-auth-token': 'fresh-token' }
 * ```
 */
export const getMetadata = async (clientParams: GrpcConfig): Promise<GrpcMetadata> => {
  // Start with base metadata (static headers, custom config, etc.)
  let metadata = { ...clientParams.metadata } as GrpcMetadata

  // If authInterceptor is available, get fresh auth metadata
  if (clientParams.authInterceptor) {
    const authMetadata = await clientParams.authInterceptor()
    // Merge auth metadata, allowing it to override base metadata
    metadata = { ...metadata, ...authMetadata } as GrpcMetadata
  }

  return metadata
}

// ============================================================================
// WRAPPER FUNCTIONS
// ============================================================================

/**
 * Generic wrapper for gRPC method calls that automatically handles metadata with auth interceptor.
 *
 * This is the mid-level API that provides a clean way to wrap any gRPC call
 * with automatic metadata handling. Use this when you need to make multiple
 * calls with the same fresh metadata or when you have complex call logic.
 *
 * @param clientParams - The gRPC configuration
 * @param methodCall - Function that makes the actual gRPC call with metadata
 * @returns Promise resolving to the method call result
 *
 * @example Single Call
 * ```typescript
 * const user = await withAuthMetadata(clientParams, async (metadata) => {
 *   const request = new GetUserRequest()
 *   request.setUserId('123')
 *   return client.getUser(request, metadata)
 * })
 * ```
 *
 * @example Multiple Calls with Same Metadata
 * ```typescript
 * const result = await withAuthMetadata(clientParams, async (metadata) => {
 *   // All calls use the same fresh metadata - efficient!
 *   const user = await client.getUser(userRequest, metadata)
 *   const prefs = await client.getPreferences(prefsRequest, metadata)
 *   const settings = await client.getSettings(settingsRequest, metadata)
 *
 *   return { user, prefs, settings }
 * })
 * ```
 */
export const withAuthMetadata = async <T>(clientParams: GrpcConfig, methodCall: (metadata: GrpcMetadata) => Promise<T>): Promise<T> => {
  const metadata = await getMetadata(clientParams)
  return methodCall(metadata)
}

// ============================================================================
// METHOD FACTORY (RECOMMENDED APPROACH)
// ============================================================================

/**
 * Creates a metadata-aware method wrapper for a specific gRPC client method.
 *
 * This is the high-level, recommended API for most use cases. It creates
 * a clean, reusable function that automatically handles metadata for a
 * specific gRPC method. The resulting function has a clean signature and
 * can be used just like a regular async function.
 *
 * @param method - The gRPC client method to wrap
 * @returns A function that automatically handles metadata with auth interceptor
 *
 * @example Basic Usage
 * ```typescript
 * // 1. Create the wrapper
 * const getUserWithAuth = createMetadataAwareMethod<
 *   UserServiceClient,
 *   GetUserRequest,
 *   GetUserResponse
 * >((client, request, metadata) => client.getUser(request, metadata))
 *
 * // 2. Use it like a normal function
 * const response = await getUserWithAuth(client, clientParams, request)
 * ```
 *
 * @example Real-world API Function
 * ```typescript
 * // In your API layer
 * const getUserWithAuth = createMetadataAwareMethod<
 *   UserServiceClient,
 *   GetUserRequest,
 *   GetUserResponse
 * >((client, request, metadata) => client.getUser(request, metadata))
 *
 * export const getUser = async (
 *   client: UserServiceClient,
 *   clientParams: GrpcConfig,
 *   userId: string
 * ): Promise<User> => {
 *   const request = new GetUserRequest()
 *   request.setUserId(userId)
 *
 *   const response = await getUserWithAuth(client, clientParams, request)
 *   return response.getUser()!
 * }
 * ```
 *
 * @example Multiple Methods for Same Service
 * ```typescript
 * // Create wrappers for all methods you need
 * const getUserWithAuth = createMetadataAwareMethod<...>(...)
 * const updateUserWithAuth = createMetadataAwareMethod<...>(...)
 * const deleteUserWithAuth = createMetadataAwareMethod<...>(...)
 *
 * // Use them in your API functions
 * export const userApi = {
 *   get: (client, params, id) => getUserWithAuth(client, params, createGetRequest(id)),
 *   update: (client, params, data) => updateUserWithAuth(client, params, createUpdateRequest(data)),
 *   delete: (client, params, id) => deleteUserWithAuth(client, params, createDeleteRequest(id))
 * }
 * ```
 */
export const createMetadataAwareMethod = <TClient, TRequest, TResponse>(
  method: (client: TClient, request: TRequest, metadata: GrpcMetadata) => Promise<TResponse>
) => {
  return async (client: TClient, clientParams: GrpcConfig, request: TRequest): Promise<TResponse> => {
    return withAuthMetadata(clientParams, (metadata) => method(client, request, metadata))
  }
}
