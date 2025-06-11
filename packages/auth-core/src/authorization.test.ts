import { beforeEach, describe, expect, it } from 'vitest'
import { createAuthorizationMethods } from './authorization'
import type { ClerkUserClaims, SubscriptionStatus } from './authorization'

describe('createAuthorizationMethods', () => {
  let mockClaims: ClerkUserClaims
  let authMethods: ReturnType<typeof createAuthorizationMethods>

  beforeEach(() => {
    mockClaims = {
      subscriptions: {
        main: {
          plan: 'pro',
          status: 'active',
        },
        secondary: {
          plan: 'enterprise',
          status: 'trial',
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
        },
        expired: {
          plan: 'pro',
          status: 'expired',
        },
      },
      permissions: {
        chat: ['basic', 'advanced'],
        api: ['read'],
        admin: ['view'],
      },
    }
    authMethods = createAuthorizationMethods(mockClaims)
  })

  describe('hasSubscription', () => {
    it('should return true for matching plan and active status', () => {
      expect(authMethods.hasSubscription('pro')).toBe(true)
      expect(authMethods.hasSubscription('pro', 'main')).toBe(true)
    })

    it('should return true for trial status (default active status)', () => {
      expect(authMethods.hasSubscription('enterprise', 'secondary')).toBe(true)
    })

    it('should return false for non-matching plan', () => {
      expect(authMethods.hasSubscription('free')).toBe(false)
      expect(authMethods.hasSubscription('enterprise', 'main')).toBe(false)
    })

    it('should return false for inactive status', () => {
      expect(authMethods.hasSubscription('pro', 'expired')).toBe(false)
    })

    it('should return false for non-existent product', () => {
      expect(authMethods.hasSubscription('pro', 'nonexistent')).toBe(false)
    })

    it('should return false when claims are null', () => {
      const nullAuthMethods = createAuthorizationMethods(null)
      expect(nullAuthMethods.hasSubscription('pro')).toBe(false)
    })

    it('should return false when subscriptions are undefined', () => {
      const claimsWithoutSubs = { permissions: { chat: ['basic'] } }
      const authMethodsNoSubs = createAuthorizationMethods(claimsWithoutSubs)
      expect(authMethodsNoSubs.hasSubscription('pro')).toBe(false)
    })
  })

  describe('isSubscriptionActive', () => {
    it('should return true for active subscription', () => {
      expect(authMethods.isSubscriptionActive()).toBe(true)
      expect(authMethods.isSubscriptionActive('main')).toBe(true)
    })

    it('should return true for trial subscription', () => {
      expect(authMethods.isSubscriptionActive('secondary')).toBe(true)
    })

    it('should return false for expired subscription', () => {
      expect(authMethods.isSubscriptionActive('expired')).toBe(false)
    })

    it('should return false for non-existent subscription', () => {
      expect(authMethods.isSubscriptionActive('nonexistent')).toBe(false)
    })

    it('should respect custom active statuses', () => {
      expect(authMethods.isSubscriptionActive('main', ['active'])).toBe(true)
      expect(authMethods.isSubscriptionActive('secondary', ['active'])).toBe(false)
      expect(authMethods.isSubscriptionActive('secondary', ['trial'])).toBe(true)
    })

    it('should return false for expired trial subscription', () => {
      const expiredTrialClaims: ClerkUserClaims = {
        subscriptions: {
          main: {
            plan: 'pro',
            status: 'trial',
            expiresAt: Date.now() - 1000, // 1 second ago
          },
        },
      }
      const expiredAuthMethods = createAuthorizationMethods(expiredTrialClaims)
      expect(expiredAuthMethods.isSubscriptionActive()).toBe(false)
    })

    it('should return true for subscription without expiration date', () => {
      const noExpirationClaims: ClerkUserClaims = {
        subscriptions: {
          main: {
            plan: 'pro',
            status: 'active',
          },
        },
      }
      const noExpirationAuthMethods = createAuthorizationMethods(noExpirationClaims)
      expect(noExpirationAuthMethods.isSubscriptionActive()).toBe(true)
    })

    it('should return false when claims are null', () => {
      const nullAuthMethods = createAuthorizationMethods(null)
      expect(nullAuthMethods.isSubscriptionActive()).toBe(false)
    })
  })

  describe('getSubscriptionPlan', () => {
    it('should return the correct plan for existing subscription', () => {
      expect(authMethods.getSubscriptionPlan()).toBe('pro')
      expect(authMethods.getSubscriptionPlan('main')).toBe('pro')
      expect(authMethods.getSubscriptionPlan('secondary')).toBe('enterprise')
    })

    it('should return null for non-existent subscription', () => {
      expect(authMethods.getSubscriptionPlan('nonexistent')).toBe(null)
    })

    it('should return null when claims are null', () => {
      const nullAuthMethods = createAuthorizationMethods(null)
      expect(nullAuthMethods.getSubscriptionPlan()).toBe(null)
    })

    it('should return null when subscriptions are undefined', () => {
      const claimsWithoutSubs = { permissions: { chat: ['basic'] } }
      const authMethodsNoSubs = createAuthorizationMethods(claimsWithoutSubs)
      expect(authMethodsNoSubs.getSubscriptionPlan()).toBe(null)
    })
  })

  describe('getSubscriptionStatus', () => {
    it('should return the correct status for existing subscription', () => {
      expect(authMethods.getSubscriptionStatus()).toBe('active')
      expect(authMethods.getSubscriptionStatus('main')).toBe('active')
      expect(authMethods.getSubscriptionStatus('secondary')).toBe('trial')
      expect(authMethods.getSubscriptionStatus('expired')).toBe('expired')
    })

    it('should return null for non-existent subscription', () => {
      expect(authMethods.getSubscriptionStatus('nonexistent')).toBe(null)
    })

    it('should return null when claims are null', () => {
      const nullAuthMethods = createAuthorizationMethods(null)
      expect(nullAuthMethods.getSubscriptionStatus()).toBe(null)
    })

    it('should return null when subscriptions are undefined', () => {
      const claimsWithoutSubs = { permissions: { chat: ['basic'] } }
      const authMethodsNoSubs = createAuthorizationMethods(claimsWithoutSubs)
      expect(authMethodsNoSubs.getSubscriptionStatus()).toBe(null)
    })
  })

  describe('hasPermission', () => {
    it('should return true for existing permissions', () => {
      expect(authMethods.hasPermission('chat', 'basic')).toBe(true)
      expect(authMethods.hasPermission('chat', 'advanced')).toBe(true)
      expect(authMethods.hasPermission('api', 'read')).toBe(true)
      expect(authMethods.hasPermission('admin', 'view')).toBe(true)
    })

    it('should return false for non-existing permissions', () => {
      expect(authMethods.hasPermission('chat', 'premium')).toBe(false)
      expect(authMethods.hasPermission('api', 'write')).toBe(false)
      expect(authMethods.hasPermission('admin', 'edit')).toBe(false)
      expect(authMethods.hasPermission('billing', 'view')).toBe(false)
    })

    it('should return false when claims are null', () => {
      const nullAuthMethods = createAuthorizationMethods(null)
      expect(nullAuthMethods.hasPermission('chat', 'basic')).toBe(false)
    })

    it('should return false when permissions are undefined', () => {
      const claimsWithoutPerms: ClerkUserClaims = {
        subscriptions: {
          main: { plan: 'pro', status: 'active' },
        },
      }
      const authMethodsNoPerms = createAuthorizationMethods(claimsWithoutPerms)
      expect(authMethodsNoPerms.hasPermission('chat', 'basic')).toBe(false)
    })

    it('should return false for empty permission arrays', () => {
      const claimsWithEmptyPerms: ClerkUserClaims = {
        permissions: {
          chat: [],
        },
      }
      const authMethodsEmptyPerms = createAuthorizationMethods(claimsWithEmptyPerms)
      expect(authMethodsEmptyPerms.hasPermission('chat', 'basic')).toBe(false)
    })
  })

  describe('custom configuration', () => {
    it('should use custom default product ID', () => {
      const customAuthMethods = createAuthorizationMethods(mockClaims, 'secondary')
      expect(customAuthMethods.hasSubscription('enterprise')).toBe(true)
      expect(customAuthMethods.getSubscriptionPlan()).toBe('enterprise')
      expect(customAuthMethods.getSubscriptionStatus()).toBe('trial')
    })

    it('should use custom active statuses', () => {
      const customActiveStatuses: SubscriptionStatus[] = ['active', 'paused']
      const customAuthMethods = createAuthorizationMethods(mockClaims, 'main', customActiveStatuses)

      expect(customAuthMethods.hasSubscription('pro')).toBe(true) // active
      expect(customAuthMethods.isSubscriptionActive('main', customActiveStatuses)).toBe(true)
      expect(customAuthMethods.isSubscriptionActive('secondary', customActiveStatuses)).toBe(false) // trial not in custom statuses
    })

    it('should handle edge case subscription statuses', () => {
      const edgeCaseClaims: ClerkUserClaims = {
        subscriptions: {
          paused: { plan: 'pro', status: 'paused' },
          pending: { plan: 'enterprise', status: 'pending' },
          cancelled: { plan: 'free', status: 'cancelled' },
        },
      }
      const edgeAuthMethods = createAuthorizationMethods(edgeCaseClaims)

      expect(edgeAuthMethods.isSubscriptionActive('paused')).toBe(false)
      expect(edgeAuthMethods.isSubscriptionActive('pending')).toBe(false)
      expect(edgeAuthMethods.isSubscriptionActive('cancelled')).toBe(false)

      // But they should be active with custom statuses
      expect(edgeAuthMethods.isSubscriptionActive('paused', ['paused'])).toBe(true)
      expect(edgeAuthMethods.isSubscriptionActive('pending', ['pending'])).toBe(true)
    })
  })

  describe('integration scenarios', () => {
    it('should handle complex real-world scenario', () => {
      const realWorldClaims: ClerkUserClaims = {
        subscriptions: {
          main: {
            plan: 'pro',
            status: 'active',
          },
          addon: {
            plan: 'analytics',
            status: 'trial',
            expiresAt: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days from now
          },
        },
        permissions: {
          chat: ['basic', 'advanced'],
          api: ['read', 'write'],
          analytics: ['view'],
          admin: ['view', 'edit'],
        },
        permissions_updated_at: Date.now(),
      }

      const realWorldAuth = createAuthorizationMethods(realWorldClaims)

      // Subscription checks
      expect(realWorldAuth.hasSubscription('pro')).toBe(true)
      expect(realWorldAuth.hasSubscription('analytics', 'addon')).toBe(true)
      expect(realWorldAuth.isSubscriptionActive()).toBe(true)
      expect(realWorldAuth.isSubscriptionActive('addon')).toBe(true)

      // Permission checks
      expect(realWorldAuth.hasPermission('chat', 'advanced')).toBe(true)
      expect(realWorldAuth.hasPermission('api', 'write')).toBe(true)
      expect(realWorldAuth.hasPermission('analytics', 'view')).toBe(true)
      expect(realWorldAuth.hasPermission('admin', 'edit')).toBe(true)

      // Negative cases
      expect(realWorldAuth.hasPermission('billing', 'manage')).toBe(false)
      expect(realWorldAuth.hasSubscription('enterprise')).toBe(false)
    })

    it('should handle minimal claims', () => {
      const minimalClaims: ClerkUserClaims = {}
      const minimalAuth = createAuthorizationMethods(minimalClaims)

      expect(minimalAuth.hasSubscription('free')).toBe(false)
      expect(minimalAuth.isSubscriptionActive()).toBe(false)
      expect(minimalAuth.getSubscriptionPlan()).toBe(null)
      expect(minimalAuth.getSubscriptionStatus()).toBe(null)
      expect(minimalAuth.hasPermission('any', 'action')).toBe(false)
    })
  })
})
