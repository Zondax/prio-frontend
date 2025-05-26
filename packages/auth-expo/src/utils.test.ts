// Mock expo-constants before imports
import Constants from 'expo-constants'
import { describe, expect, it, vi } from 'vitest'

import { getGrpcUrl } from './utils'

vi.mock('expo-constants', () => ({ __esModule: true, default: { expoGoConfig: { debuggerHost: '10.0.0.1:19000' } } }))

// Tests for getGrpcUrl
describe('getGrpcUrl', () => {
  it('throws when url is empty', () => {
    expect(() => getGrpcUrl('')).toThrow('URL parameter is not provided')
  })

  it('transforms localhost urls to expoGo debugger host', () => {
    expect(getGrpcUrl('localhost:3000')).toBe('http://10.0.0.1:3000')
  })

  it('returns url unchanged if not localhost', () => {
    expect(getGrpcUrl('https://example.com')).toBe('https://example.com')
  })
})
