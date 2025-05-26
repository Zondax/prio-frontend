import { Common, MobileIntegrity, MobileIntegrityService } from '@prio-grpc'
import { Platform } from 'react-native'

import { ChallengeFetchError } from '../../../auth-core/src/errors'
import { authGrpcUrl, intoGrpcPlatform } from './utils'

export type RequestChallengeInput = {
  platform: string
  appId: string
  uuidFlow: string
}

const MobileIntegrityServiceClient = MobileIntegrityService.MobileIntegrityServiceClient

export type MobileConfigResponse = {
  // Add properties based on your API response
  [key: string]: any
}

export const fetchAttestationChallenge = async (
  challengeInput: RequestChallengeInput,
  clientClass: typeof MobileIntegrityServiceClient = MobileIntegrityServiceClient
): Promise<string> => {
  const requestPlatform = intoGrpcPlatform(challengeInput.platform)
  try {
    const client = new clientClass(authGrpcUrl)
    const request = new MobileIntegrity.GetChallengeRequest()
    request.setPlatform(requestPlatform)
    request.setAppId(challengeInput.appId)
    request.setUuid(challengeInput.uuidFlow)
    const data = await client.getChallenge(request)
    return data.getChallenge()
  } catch (error) {
    console.error('[config] Raw error response:', JSON.stringify(error, null, 2))
    console.error('[config] Challenge fetch failed:', error)
    throw new ChallengeFetchError('Failed to fetch challenge')
  }
}

/**
 * Verifies Play Integrity attestation (for Android)
 */
export const verifyPlayIntegrity = async (
  params: { nonce: string; attestationStatement: string },
  clientClass: typeof MobileIntegrityServiceClient = MobileIntegrityServiceClient
) => {
  try {
    const client = new clientClass(authGrpcUrl)
    const request = new MobileIntegrity.VerifyPlayIntegrityRequest()
    request.setToken(params.attestationStatement)
    request.setChallenge(params.nonce)
    return await client.verifyPlayIntegrity({
      nonce: params.nonce,
      attestationStatement: params.attestationStatement,
    })
  } catch (error) {
    console.error('[mobile attestation] Play Integrity verification failed:', error)
    throw new Error('Failed to verify Play Integrity')
  }
}

/**
 * Requests a challenge from the server
 */
export const requestChallenge = async (clientClass: typeof MobileIntegrityServiceClient = MobileIntegrityServiceClient) => {
  try {
    const client = new clientClass(authGrpcUrl)
    const platform = Platform.OS === 'ios' ? Common.Platform.PLATFORM_IOS : Common.Platform.PLATFORM_ANDROID
    return await client.requestChallenge({ platform })
  } catch (error) {
    console.error('[mobile attestation] Challenge request failed:', error)
    throw new Error('Failed to request challenge')
  }
}

/**
 * Fetches attestation nonce from the server
 */
export const fetchAttestationNonce = async (): Promise<string> => {
  try {
    const response = await fetch(`${authGrpcUrl}/nonce`, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data.nonce
  } catch (error) {
    console.error('[mobile attestation] Failed to fetch attestation nonce:', error)
    throw error
  }
}

/**
 * Verifies Device Check attestation (for iOS)
 */
export const verifyDeviceCheck = async (
  params: { attestation: string; keyId: string },
  clientClass: typeof MobileIntegrityServiceClient = MobileIntegrityServiceClient
) => {
  try {
    const client = new clientClass(authGrpcUrl)
    const platform = Platform.OS === 'ios' ? Common.Platform.PLATFORM_IOS : Common.Platform.PLATFORM_ANDROID
    return await client.verifyDeviceCheck({
      attestation: params.attestation,
      keyId: params.keyId,
      platform,
    })
  } catch (error) {
    console.error('[mobile attestation] Device Check verification failed:', error)
    throw new Error('Failed to verify Device Check')
  }
}
