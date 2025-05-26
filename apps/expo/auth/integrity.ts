import * as Device from 'expo-device'
import { Platform } from 'react-native'

import * as AppIntegrity from '../modules/expo-app-integrity'
import { PlatformOS } from './device'
import { getIntegrityKeyId } from './storage'

export interface IntegrityResult {
  // @deprecated: avoid using isValid, use attestationObj instead or exceptions to signal errors
  isValid: boolean
  challenge?: string
  attestationObj?: string
  error?: string
  keyId?: string
  platform?: PlatformOS
}

// NOTE: We're not storing the attestation token in storage because:
// 1. It's not necessary for our current implementation
// 2. The token size exceeds 2048 bytes which could cause issues in future versions
// 3. The attestation is validated server-side and doesn't need persistent storage
// If we need to store it in the future for any reason, we'll need to implement a proper
// storage solution that can handle the token size and security requirements

async function handleAndroidAttestation(challenge: string): Promise<IntegrityResult> {
  try {
    const cloudProjectNumber = Number(process.env.EXPO_PUBLIC_CLOUD_PROJECT_NUMBER)

    if (!cloudProjectNumber) {
      throw new Error('Cloud project number is required for Android (EXPO_PUBLIC_CLOUD_PROJECT_NUMBER)')
    }

    const attestationObj = await AppIntegrity.attestKey(challenge, cloudProjectNumber)
    return { isValid: true, attestationObj: attestationObj }
  } catch (error) {
    console.error('Android attestation error:', error)
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Android attestation failed',
    }
  }
}

async function handleIOSAttestation(challenge: string): Promise<IntegrityResult> {
  if (!Device.isDevice) {
    throw new Error('App attestation cannot be executed in simulator')
  }

  try {
    const attestationObj = await AppIntegrity.attestKey(challenge)
    const keyId = await getIntegrityKeyId()
    return { isValid: true, attestationObj: attestationObj, keyId: keyId }
  } catch (error) {
    console.error('iOS attestation error:', error)
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'iOS attestation failed',
    }
  }
}

export async function verifyAppIntegrity(challenge: string): Promise<IntegrityResult> {
  if (isSimulator()) {
    return {
      isValid: true,
      attestationObj: 'simulation-object',
      keyId: 'simulation-keyId',
    }
  }

  try {
    if (Platform.OS === PlatformOS.IOS) {
      if (!AppIntegrity.isSupported()) {
        throw new Error('iOS attestation not supported')
      }
      return handleIOSAttestation(challenge)
    }

    if (Platform.OS === PlatformOS.ANDROID) {
      return handleAndroidAttestation(challenge)
    }

    return {
      isValid: false,
      error: 'Platform not supported',
    }
  } catch (error) {
    console.error('Integrity verification error:', error)
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Integrity check failed',
    }
  }
}

function isSimulator(): boolean {
  const isSimulatorDevice = !Device.isDevice
  const skipAttestationEnabled = process.env.EXPO_PUBLIC_SKIP_ATTESTATION === 'true'
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Only allow skipping attestation in development mode, also we're checking in the backend side
  return isSimulatorDevice && skipAttestationEnabled && isDevelopment
}
