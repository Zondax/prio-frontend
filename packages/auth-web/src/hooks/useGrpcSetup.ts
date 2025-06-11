'use client'

import { useAuth } from '@clerk/nextjs'
import { useCallback, useEffect } from 'react'

export interface GrpcConfig {
  baseUrl: string
  metadata: Record<string, string>
  authInterceptor?: () => Promise<Record<string, string>>
}

export type GrpcParamSetter = (config: GrpcConfig) => void

export interface UseGrpcSetupOptions {
  authHeaderName?: string
  tokenTtlSeconds?: number
}

/**
 * Creates an auth interceptor function that gets fresh tokens on each call
 * @param getToken - Clerk's getToken function
 * @param authHeaderName - Header name for the auth token
 * @param tokenTtlSeconds - Seconds before expiry to refresh token
 * @returns Function that provides fresh auth metadata
 */
const createAuthInterceptor = (
  getToken: (options?: { leewayInSeconds?: number }) => Promise<string | null>,
  authHeaderName = 'x-auth-token',
  tokenTtlSeconds = 45
) => {
  return async (): Promise<Record<string, string>> => {
    const token = await getToken({ leewayInSeconds: tokenTtlSeconds })

    return token ? { [authHeaderName]: token } : {}
  }
}

/**
 * Hook that configures gRPC with auth interceptor - zero re-renders
 */
export function useGrpcSetup(setParams: GrpcParamSetter, selectedEndpoint: string, options: UseGrpcSetupOptions = {}) {
  const { getToken, isLoaded } = useAuth()
  const { authHeaderName = 'x-auth-token', tokenTtlSeconds = 45 } = options

  const setupGrpcConfig = useCallback(() => {
    if (!isLoaded || !selectedEndpoint) return

    const authInterceptor = createAuthInterceptor(getToken, authHeaderName, tokenTtlSeconds)

    // Set params ONLY ONCE with the interceptor
    // No token in initial metadata - the interceptor will provide it fresh on each call
    const config: GrpcConfig = {
      baseUrl: selectedEndpoint,
      metadata: {},
      authInterceptor,
    }

    setParams(config)
  }, [isLoaded, selectedEndpoint, setParams, getToken, authHeaderName, tokenTtlSeconds])

  useEffect(() => {
    // Only call setupGrpcConfig when isLoaded or selectedEndpoint changes
    setupGrpcConfig()
  }, [setupGrpcConfig])
}
