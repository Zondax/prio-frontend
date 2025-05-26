import { fetchAttestationChallenge, fetchMobileConfig } from '@zondax/auth-expo'
import * as Crypto from 'expo-crypto'
import React, { useCallback, useEffect, useState, type FC, type ReactNode } from 'react'

import { getAppId, getPlatform } from '../device'
import { type ConfigState, SecureConfigContext } from '../hooks/secureConfig'
import { verifyAppIntegrity } from '../integrity'
import type { AppConfig } from '../types/config'

const initialState: ConfigState<AppConfig> = {
  config: null,
  isLoading: true,
  error: null,
  isReady: false,
}

export const SecureConfigProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ConfigState<AppConfig>>(initialState)

  const initializeConfig = useCallback(async () => {
    try {
      console.log('[config] Initializing attestation flow')

      const challengeInput = {
        platform: getPlatform(),
        appId: getAppId(),
        uuidFlow: Crypto.randomUUID(),
      }

      const challenge = await fetchAttestationChallenge(challengeInput)
      const integrityResult = await verifyAppIntegrity(challenge)
      if (!integrityResult.isValid) {
        throw new Error(integrityResult.error || 'Integrity check failed')
      }

      const attestationInput = {
        ...challengeInput,
        challenge,
        attestationResult: integrityResult.attestationObj || '',
        keyId: integrityResult.keyId,
      }

      const config = await fetchMobileConfig(attestationInput)
      const typedConfig = config.toObject() as AppConfig
      console.log('[config] Attestation flow successful')

      setState({
        config: typedConfig,
        isLoading: false,
        error: null,
        isReady: true,
      })
    } catch (error) {
      let detailedErrorMsg = 'An unknown error occurred during secure config initialization.'
      if (error instanceof Error) {
        detailedErrorMsg = error.message
      }
      console.error('[config] Initialization failed:', error)

      setState({
        ...initialState,
        isLoading: false,
        error: detailedErrorMsg,
      })
    }
  }, [])

  useEffect(() => {
    initializeConfig()
  }, [initializeConfig])

  return <SecureConfigContext.Provider value={state}>{children}</SecureConfigContext.Provider>
}
