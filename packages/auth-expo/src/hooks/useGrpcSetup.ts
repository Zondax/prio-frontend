'use client'

import { useEffect } from 'react'

import { getGrpcUrl } from '../utils'
import { useAuth } from './auth'

export type GrpcParamSetter = (config: { baseUrl: string; metadata: Record<string, string> }) => void

/**
 * Hook that handles setting up gRPC configuration with authentication for any store
 * that requires a setParams method with baseUrl and metadata
 *
 * @param accessToken The access token for authentication
 * @param setParams Function from a store that sets baseUrl and metadata
 */
export function useGrpcSetup(setParams: GrpcParamSetter, selectedEndpoint: string) {
  const { accessToken } = useAuth()
  const resolvedEndpoint = getGrpcUrl(selectedEndpoint)

  return useEffect(() => {
    if (accessToken) {
      setParams({
        baseUrl: resolvedEndpoint,
        metadata: accessToken ? { authorization: `Bearer ${accessToken}` } : {},
      })
    }
  }, [resolvedEndpoint, setParams, accessToken])
}
