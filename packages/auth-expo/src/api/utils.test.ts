import { describe, expect, it, vi } from 'vitest'

import { InvalidPlatformError } from '../../../auth-core/src/errors'
import { authGrpcUrl, intoGrpcPlatform } from './utils'

// Mock @prio-grpc module with the correct structure
vi.mock('@prio-grpc', () => ({
  Common: {
    Platform: {
      PLATFORM_IOS: 1,
      PLATFORM_ANDROID: 2,
    },
  },
}))

describe('intoGrpcPlatform', () => {
  it('returns PLATFORM_IOS for ios', () => {
    expect(intoGrpcPlatform('ios')).toBe(1)
  })

  it('returns PLATFORM_ANDROID for android', () => {
    expect(intoGrpcPlatform('android')).toBe(2)
  })

  it('throws InvalidPlatformError for unsupported platform', () => {
    expect(() => intoGrpcPlatform('windows')).toThrow(InvalidPlatformError)
  })
})

describe('authGrpcUrl', () => {
  it('is a string URL', () => {
    expect(typeof authGrpcUrl).toBe('string')
    expect(authGrpcUrl.length).toBeGreaterThan(0)
  })
})
