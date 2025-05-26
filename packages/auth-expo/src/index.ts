import { MobileIntegrity } from '@prio-grpc'
import { handleTokenRefreshCycle, isTokenExpired } from '@zondax/auth-core'

export * from '@zondax/auth-core/errors'

export type { Role } from '@zondax/auth-core'
export * from './auth'
export * from './types'

export { handleTokenRefreshCycle, isTokenExpired }

export { MobileIntegrity }

export { ZitadelSettings } from '@zondax/auth-core'
export { fetchAttestationChallenge, fetchMobileConfig } from './api'

export * from './hooks'
