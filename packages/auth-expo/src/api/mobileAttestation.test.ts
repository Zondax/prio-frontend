import { Platform } from 'react-native'
// Now import the modules that use the mocks
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  fetchAttestationChallenge,
  fetchAttestationNonce,
  requestChallenge,
  verifyDeviceCheck,
  verifyPlayIntegrity,
} from './mobileAttestation'

// Mock implementations for the MobileIntegrityService methods
const mockVerifyPlayIntegrity = vi.fn()
const mockRequestChallenge = vi.fn()
const mockVerifyDeviceCheck = vi.fn()
const mockGetChallenge = vi.fn()

// Mock client instance
const mockClient = {
  verifyPlayIntegrity: mockVerifyPlayIntegrity,
  requestChallenge: mockRequestChallenge,
  verifyDeviceCheck: mockVerifyDeviceCheck,
  getChallenge: mockGetChallenge,
}

// Mock test URL for device check verification
const TEST_URL = 'https://test.example.com'

// Mock fetch for attestation nonce
global.fetch = vi.fn()

// Mock Expo Constants
vi.mock('expo-constants', () => ({
  default: {
    expoGoConfig: {
      debuggerHost: '10.0.0.1:19000',
    },
  },
}))

// Mock React Native Platform
vi.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}))

// Mock @prio-grpc module
vi.mock('@prio-grpc', () => {
  const MockClient = vi.fn().mockImplementation(() => mockClient)

  return {
    MobileIntegrityService: {
      MobileIntegrityServiceClient: MockClient,
    },
    MobileIntegrity: {
      GetChallengeRequest: vi.fn().mockImplementation(() => ({
        setPlatform: vi.fn(),
        setAppId: vi.fn(),
        setUuid: vi.fn(),
      })),
      VerifyPlayIntegrityRequest: vi.fn().mockImplementation(() => ({
        setToken: vi.fn(),
        setChallenge: vi.fn(),
      })),
      VerifyDeviceCheckRequest: vi.fn().mockImplementation(() => ({
        setToken: vi.fn(),
        setChallenge: vi.fn(),
      })),
    },
    Common: {
      Platform: {
        PLATFORM_IOS: 1,
        PLATFORM_ANDROID: 2,
      },
    },
  }
})

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  mockVerifyPlayIntegrity.mockResolvedValue({ success: true })
  mockRequestChallenge.mockResolvedValue({ nonce: 'test-nonce' })
  mockVerifyDeviceCheck.mockResolvedValue({ success: true })
  mockGetChallenge.mockResolvedValue({ getChallenge: () => 'test-challenge' })
  ;(global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ nonce: 'test-nonce' }),
  })
})

describe('verifyPlayIntegrity', () => {
  it('should call the gRPC client with the correct parameters', async () => {
    const params = {
      nonce: 'test-nonce',
      attestationStatement: 'test-attestation',
    }

    await verifyPlayIntegrity(params)

    expect(mockVerifyPlayIntegrity).toHaveBeenCalledWith({
      nonce: 'test-nonce',
      attestationStatement: 'test-attestation',
    })
  })
})

describe('requestChallenge', () => {
  it('should call the gRPC client with the correct platform', async () => {
    await requestChallenge()

    expect(mockRequestChallenge).toHaveBeenCalledWith({ platform: 1 }) // 1 = iOS
  })
})

describe('fetchAttestationNonce', () => {
  it('should fetch the nonce from the correct URL', async () => {
    await fetchAttestationNonce()

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/nonce'), {
      method: 'GET',
    })
  })

  it('should return the nonce from the response', async () => {
    const result = await fetchAttestationNonce()
    expect(result).toBe('test-nonce')
  })

  it('should throw an error if the response is not ok', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    await expect(fetchAttestationNonce()).rejects.toThrow('HTTP error! Status: 500')
  })
})

describe('verifyDeviceCheck', () => {
  it('should call the gRPC client with the correct parameters', async () => {
    const params = {
      attestation: 'test-attestation',
      keyId: 'test-key-id',
    }

    await verifyDeviceCheck(params)

    expect(mockVerifyDeviceCheck).toHaveBeenCalledWith({
      attestation: 'test-attestation',
      keyId: 'test-key-id',
      platform: 1, // 1 = iOS
    })
  })
})

describe('fetchAttestationChallenge', () => {
  it('should call the gRPC client with the correct parameters', async () => {
    const input = {
      platform: 'ios',
      appId: 'test-app-id',
      uuidFlow: 'test-uuid',
    }

    await fetchAttestationChallenge(input)

    // Check if the MobileIntegrityServiceClient was instantiated
    expect(mockGetChallenge).toHaveBeenCalled()
  })
})
