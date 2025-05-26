import { MobileIntegrity, MobileIntegrityService } from '@prio-grpc'

import type { MobileConfigResponse } from './mobileAttestation'
import { authGrpcUrl, intoGrpcPlatform } from './utils'

export type RequestConfigInput = {
  platform: string
  appId: string
  uuidFlow: string
}

export type AttestationRequest = {
  platform: string
  appId: string
  attestationResult: string
  challenge: string
  uuidFlow: string
  keyId?: string
}

const MobileIntegrityServiceClient = MobileIntegrityService.MobileIntegrityServiceClient

export const fetchMobileConfig = async (
  attestationInput: AttestationRequest,
  clientClass: typeof MobileIntegrityServiceClient = MobileIntegrityServiceClient
): Promise<MobileConfigResponse> => {
  const requestPlatform = intoGrpcPlatform(attestationInput.platform)
  try {
    const client = new clientClass(authGrpcUrl)
    const request = new MobileIntegrity.GetMobileConfigRequest()
    request.setPlatform(requestPlatform)
    request.setAppId(attestationInput.appId)
    request.setUuid(attestationInput.uuidFlow)
    request.setKeyId(attestationInput.keyId)
    request.setAttestationResult(attestationInput.attestationResult)
    request.setChallenge(attestationInput.challenge)
    const data = await client.getMobileConfig(request)

    return data.getConfig()
  } catch (error) {
    console.error('[config] Config fetch failed:', error)
    throw new Error('failed to fetch config')
  }
}
