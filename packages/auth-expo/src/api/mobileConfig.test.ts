// Import Vitest test functions
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Import the module under test AFTER mocks are configured
import { fetchMobileConfig } from './mobileConfig'

// Mock modules before importing the module under test
// Mock client instance with methods that will be spied on
const mockClient = {
  getMobileConfig: vi.fn(),
}

// Mock module that contains the client class
vi.mock('@prio-grpc', () => ({
  MobileIntegrityService: {
    MobileIntegrityServiceClient: vi.fn().mockImplementation(() => mockClient),
  },
  MobileIntegrity: {
    GetMobileConfigRequest: vi.fn().mockImplementation(() => ({
      setPlatform: vi.fn(),
      setAppId: vi.fn(),
      setUuid: vi.fn(),
      setKeyId: vi.fn(),
      setAttestationResult: vi.fn(),
      setChallenge: vi.fn(),
    })),
  },
  Common: {
    Platform: {
      PLATFORM_IOS: 1,
      PLATFORM_ANDROID: 2,
    },
  },
}))

// Mock the utils module
vi.mock('./utils', () => ({
  authGrpcUrl: 'https://test.example.com',
  intoGrpcPlatform: vi.fn().mockImplementation((platform) => {
    if (platform === 'ios') return 1
    if (platform === 'android') return 2
    throw new Error('Invalid platform')
  }),
}))

// Mock Platform.OS for testing
vi.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}))

describe('fetchMobileConfig', () => {
  const mockAttestationInput = {
    platform: 'ios',
    appId: 'test-app-id',
    attestationResult: 'test-attestation-result',
    challenge: 'test-challenge',
    uuidFlow: 'test-uuid-flow',
    keyId: 'test-key-id',
  }

  // Setup mock response for testing
  const mockResponse = {
    getConfig: vi.fn().mockReturnValue('{"test": "value"}'),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockClient.getMobileConfig.mockResolvedValue(mockResponse)
  })

  it('calls the gRPC client with correct parameters', async () => {
    const result = await fetchMobileConfig(mockAttestationInput)

    expect(mockClient.getMobileConfig).toHaveBeenCalledTimes(1)
    expect(result).toEqual('{"test": "value"}')
  })

  it('throws an error when the API call fails', async () => {
    mockClient.getMobileConfig.mockRejectedValueOnce(new Error('API error'))

    await expect(fetchMobileConfig(mockAttestationInput)).rejects.toThrow('failed to fetch config')
  })
})
