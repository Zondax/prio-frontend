import type { ClerkUserClaims } from '@zondax/auth-core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthorization } from './useAuthorization'

// Mock Clerk
const mockUser = {
  publicMetadata: {} as ClerkUserClaims,
}

const mockUseUser = vi.fn(() => ({
  user: mockUser,
  isLoaded: true,
}))

vi.mock('@clerk/nextjs', () => ({
  useUser: () => mockUseUser(),
}))

// Mock React hooks for testing
let mockUseMemoValue: any = null
let mockUseMemoCallback: any = null

vi.mock('react', () => ({
  useMemo: (callback: () => any, deps: any[]) => {
    mockUseMemoCallback = callback
    return mockUseMemoValue || callback()
  },
}))

describe('useAuthorization', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUser.publicMetadata = {}
    mockUseMemoValue = null
    mockUseMemoCallback = null
  })

  describe('basic functionality', () => {
    it('should return loading state when Clerk is not loaded', () => {
      mockUseUser.mockReturnValue({
        user: null,
        isLoaded: false,
      })

      const result = useAuthorization()

      expect(result.isLoading).toBe(true)
      expect(result.isAuthenticated).toBe(false)
      expect(result.claims).toBe(null)
    })

    it('should return unauthenticated state when no user', () => {
      mockUseUser.mockReturnValue({
        user: null,
        isLoaded: true,
      })

      const result = useAuthorization()

      expect(result.isLoading).toBe(false)
      expect(result.isAuthenticated).toBe(false)
      expect(result.claims).toBe(null)
    })

    it('should return authenticated state with claims', () => {
      const testClaims: ClerkUserClaims = {
        subscriptions: {
          main: { plan: 'pro', status: 'active' },
        },
        permissions: {
          chat: ['basic', 'advanced'],
        },
      }

      mockUser.publicMetadata = testClaims
      mockUseUser.mockReturnValue({
        user: mockUser,
        isLoaded: true,
      })

      const result = useAuthorization()

      expect(result.isLoading).toBe(false)
      expect(result.isAuthenticated).toBe(true)
      expect(result.claims).toEqual(testClaims)
    })

    it('should handle user without publicMetadata', () => {
      const userWithoutMetadata = {
        publicMetadata: undefined,
      }

      mockUseUser.mockReturnValue({
        user: userWithoutMetadata,
        isLoaded: true,
      })

      const result = useAuthorization()

      expect(result.isLoading).toBe(false)
      expect(result.isAuthenticated).toBe(true)
      expect(result.claims).toBe(null)
    })
  })

  describe('authorization methods', () => {
    beforeEach(() => {
      const testClaims: ClerkUserClaims = {
        subscriptions: {
          main: { plan: 'pro', status: 'active' },
          secondary: { plan: 'enterprise', status: 'trial' },
          expired: { plan: 'free', status: 'expired' },
        },
        permissions: {
          chat: ['basic', 'advanced'],
          api: ['read'],
          admin: ['view'],
        },
      }

      mockUser.publicMetadata = testClaims
      mockUseUser.mockReturnValue({
        user: mockUser,
        isLoaded: true,
      })
    })

    it('should provide hasSubscription method', () => {
      const result = useAuthorization()

      expect(result.hasSubscription('pro')).toBe(true)
      expect(result.hasSubscription('enterprise', 'secondary')).toBe(true)
      expect(result.hasSubscription('free')).toBe(false) // expired status
      expect(result.hasSubscription('nonexistent')).toBe(false)
    })

    it('should provide isSubscriptionActive method', () => {
      const result = useAuthorization()

      expect(result.isSubscriptionActive()).toBe(true) // main is active
      expect(result.isSubscriptionActive('main')).toBe(true)
      expect(result.isSubscriptionActive('secondary')).toBe(true) // trial is active by default
      expect(result.isSubscriptionActive('expired')).toBe(false)
      expect(result.isSubscriptionActive('nonexistent')).toBe(false)
    })

    it('should provide getSubscriptionPlan method', () => {
      const result = useAuthorization()

      expect(result.getSubscriptionPlan()).toBe('pro')
      expect(result.getSubscriptionPlan('main')).toBe('pro')
      expect(result.getSubscriptionPlan('secondary')).toBe('enterprise')
      expect(result.getSubscriptionPlan('expired')).toBe('free')
      expect(result.getSubscriptionPlan('nonexistent')).toBe(null)
    })

    it('should provide getSubscriptionStatus method', () => {
      const result = useAuthorization()

      expect(result.getSubscriptionStatus()).toBe('active')
      expect(result.getSubscriptionStatus('main')).toBe('active')
      expect(result.getSubscriptionStatus('secondary')).toBe('trial')
      expect(result.getSubscriptionStatus('expired')).toBe('expired')
      expect(result.getSubscriptionStatus('nonexistent')).toBe(null)
    })

    it('should provide hasPermission method', () => {
      const result = useAuthorization()

      expect(result.hasPermission('chat', 'basic')).toBe(true)
      expect(result.hasPermission('chat', 'advanced')).toBe(true)
      expect(result.hasPermission('api', 'read')).toBe(true)
      expect(result.hasPermission('admin', 'view')).toBe(true)

      expect(result.hasPermission('chat', 'premium')).toBe(false)
      expect(result.hasPermission('api', 'write')).toBe(false)
      expect(result.hasPermission('billing', 'view')).toBe(false)
    })
  })

  describe('configuration options', () => {
    beforeEach(() => {
      const testClaims: ClerkUserClaims = {
        subscriptions: {
          main: { plan: 'pro', status: 'active' },
          custom: { plan: 'enterprise', status: 'trial' },
        },
        permissions: {
          chat: ['basic'],
        },
      }

      mockUser.publicMetadata = testClaims
      mockUseUser.mockReturnValue({
        user: mockUser,
        isLoaded: true,
      })
    })

    it('should use custom default product ID', () => {
      const result = useAuthorization({ defaultProductId: 'custom' })

      expect(result.hasSubscription('enterprise')).toBe(true)
      expect(result.getSubscriptionPlan()).toBe('enterprise')
      expect(result.getSubscriptionStatus()).toBe('trial')
    })

    it('should use custom active statuses', () => {
      const result = useAuthorization({ activeStatuses: ['active'] })

      expect(result.hasSubscription('pro')).toBe(true) // active
      expect(result.hasSubscription('enterprise', 'custom')).toBe(false) // trial not in active statuses
      expect(result.isSubscriptionActive('main')).toBe(true)
      expect(result.isSubscriptionActive('custom')).toBe(false)
    })

    it('should combine custom product ID and active statuses', () => {
      const result = useAuthorization({
        defaultProductId: 'custom',
        activeStatuses: ['trial'],
      })

      expect(result.hasSubscription('enterprise')).toBe(true)
      expect(result.isSubscriptionActive()).toBe(true)
      expect(result.getSubscriptionPlan()).toBe('enterprise')
    })
  })

  describe('edge cases', () => {
    it('should handle null publicMetadata gracefully', () => {
      mockUser.publicMetadata = null as any
      mockUseUser.mockReturnValue({
        user: mockUser,
        isLoaded: true,
      })

      const result = useAuthorization()

      expect(result.claims).toBe(null)
      expect(result.hasSubscription('any')).toBe(false)
      expect(result.hasPermission('any', 'action')).toBe(false)
    })

    it('should handle empty publicMetadata', () => {
      mockUser.publicMetadata = {}
      mockUseUser.mockReturnValue({
        user: mockUser,
        isLoaded: true,
      })

      const result = useAuthorization()

      expect(result.claims).toEqual({})
      expect(result.hasSubscription('any')).toBe(false)
      expect(result.hasPermission('any', 'action')).toBe(false)
    })

    it('should handle expired trial subscriptions', () => {
      const expiredTrialClaims: ClerkUserClaims = {
        subscriptions: {
          main: {
            plan: 'pro',
            status: 'trial',
            expiresAt: Date.now() - 1000, // 1 second ago
          },
        },
      }

      mockUser.publicMetadata = expiredTrialClaims
      mockUseUser.mockReturnValue({
        user: mockUser,
        isLoaded: true,
      })

      const result = useAuthorization()

      // The actual authorization logic should handle expiration correctly
      // hasSubscription only checks plan and status, not expiration
      expect(result.hasSubscription('pro')).toBe(true)
      expect(result.isSubscriptionActive()).toBe(false)
      expect(result.getSubscriptionPlan()).toBe('pro') // Plan exists but not active
      expect(result.getSubscriptionStatus()).toBe('trial')
    })
  })

  describe('real-world scenarios', () => {
    it('should handle complex multi-product subscription scenario', () => {
      const complexClaims: ClerkUserClaims = {
        subscriptions: {
          main: { plan: 'pro', status: 'active' },
          analytics: { plan: 'premium', status: 'trial', expiresAt: Date.now() + 86400000 },
          storage: { plan: 'unlimited', status: 'paused' },
        },
        permissions: {
          chat: ['basic', 'advanced'],
          api: ['read', 'write'],
          analytics: ['view', 'export'],
          storage: ['read'],
        },
        permissions_updated_at: Date.now(),
      }

      mockUser.publicMetadata = complexClaims
      mockUseUser.mockReturnValue({
        user: mockUser,
        isLoaded: true,
      })

      const result = useAuthorization()

      // Main subscription checks
      expect(result.hasSubscription('pro')).toBe(true)
      expect(result.isSubscriptionActive()).toBe(true)

      // Analytics subscription (trial)
      expect(result.hasSubscription('premium', 'analytics')).toBe(true)
      expect(result.isSubscriptionActive('analytics')).toBe(true)

      // Storage subscription (paused - not active by default)
      expect(result.hasSubscription('unlimited', 'storage')).toBe(false)
      expect(result.isSubscriptionActive('storage')).toBe(false)

      // Permission checks
      expect(result.hasPermission('chat', 'advanced')).toBe(true)
      expect(result.hasPermission('api', 'write')).toBe(true)
      expect(result.hasPermission('analytics', 'export')).toBe(true)
      expect(result.hasPermission('storage', 'read')).toBe(true)
    })

    it('should handle freemium user scenario', () => {
      const freemiumClaims: ClerkUserClaims = {
        subscriptions: {
          main: { plan: 'free', status: 'active' },
        },
        permissions: {
          chat: ['basic'],
          api: [],
        },
      }

      mockUser.publicMetadata = freemiumClaims
      mockUseUser.mockReturnValue({
        user: mockUser,
        isLoaded: true,
      })

      const result = useAuthorization()

      expect(result.hasSubscription('free')).toBe(true)
      expect(result.hasSubscription('pro')).toBe(false)
      expect(result.isSubscriptionActive()).toBe(true)
      expect(result.hasPermission('chat', 'basic')).toBe(true)
      expect(result.hasPermission('chat', 'advanced')).toBe(false)
      expect(result.hasPermission('api', 'read')).toBe(false)
    })
  })
})
