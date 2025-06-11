import type { ClerkUserClaims } from '@zondax/auth-core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProtectedComponent from './ProtectedComponent'

// Mock the useAuthorization hook
const mockAuthState = {
  isLoading: false,
  isAuthenticated: true,
  claims: null as ClerkUserClaims | null,
  hasSubscription: vi.fn(() => false),
  isSubscriptionActive: vi.fn(() => false),
  getSubscriptionPlan: vi.fn(() => null),
  getSubscriptionStatus: vi.fn(() => null),
  hasPermission: vi.fn(() => false),
}

vi.mock('../hooks/useAuthorization', () => ({
  useAuthorization: () => mockAuthState,
}))

// Mock React for testing
const mockChildren = 'Protected Content'
const mockFallback = 'Fallback Content'

// Simple render function for testing
function renderComponent(props: any) {
  const component = ProtectedComponent(props)
  return component
}

describe('ProtectedComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthState.isLoading = false
    mockAuthState.isAuthenticated = true
    mockAuthState.claims = null
    mockAuthState.hasSubscription.mockReturnValue(false)
    mockAuthState.hasPermission.mockReturnValue(false)
  })

  describe('loading state', () => {
    it('should render fallback when loading', () => {
      mockAuthState.isLoading = true

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
      })

      expect(result).toBe(mockFallback)
    })

    it('should render null when loading and no fallback provided', () => {
      mockAuthState.isLoading = true

      const result = renderComponent({
        children: mockChildren,
      })

      expect(result).toBe(null)
    })
  })

  describe('authentication state', () => {
    it('should render fallback when not authenticated', () => {
      mockAuthState.isAuthenticated = false

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
      })

      expect(result).toBe(mockFallback)
    })

    it('should render null when not authenticated and no fallback provided', () => {
      mockAuthState.isAuthenticated = false

      const result = renderComponent({
        children: mockChildren,
      })

      expect(result).toBe(null)
    })

    it('should render children when authenticated and no other restrictions', () => {
      mockAuthState.isAuthenticated = true

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
      })

      expect(result).toBe(mockChildren)
    })
  })

  describe('subscription checks', () => {
    beforeEach(() => {
      mockAuthState.isAuthenticated = true
    })

    it('should render children when subscription requirement is met', () => {
      mockAuthState.hasSubscription.mockReturnValue(true)

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
        subscription: { plan: 'pro' },
      })

      expect(mockAuthState.hasSubscription).toHaveBeenCalledWith('pro', 'main')
      expect(result).toBe(mockChildren)
    })

    it('should render fallback when subscription requirement is not met', () => {
      mockAuthState.hasSubscription.mockReturnValue(false)

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
        subscription: { plan: 'pro' },
      })

      expect(mockAuthState.hasSubscription).toHaveBeenCalledWith('pro', 'main')
      expect(result).toBe(mockFallback)
    })

    it('should use custom product ID for subscription check', () => {
      mockAuthState.hasSubscription.mockReturnValue(true)

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
        subscription: { plan: 'enterprise', productId: 'custom' },
      })

      expect(mockAuthState.hasSubscription).toHaveBeenCalledWith('enterprise', 'custom')
      expect(result).toBe(mockChildren)
    })

    it('should default to "main" product ID when not specified', () => {
      mockAuthState.hasSubscription.mockReturnValue(false)

      renderComponent({
        children: mockChildren,
        subscription: { plan: 'pro' },
      })

      expect(mockAuthState.hasSubscription).toHaveBeenCalledWith('pro', 'main')
    })
  })

  describe('permission checks', () => {
    beforeEach(() => {
      mockAuthState.isAuthenticated = true
    })

    it('should render children when permission requirement is met', () => {
      mockAuthState.hasPermission.mockReturnValue(true)

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
        feature: 'chat',
        action: 'advanced',
      })

      expect(mockAuthState.hasPermission).toHaveBeenCalledWith('chat', 'advanced')
      expect(result).toBe(mockChildren)
    })

    it('should render fallback when permission requirement is not met', () => {
      mockAuthState.hasPermission.mockReturnValue(false)

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
        feature: 'chat',
        action: 'advanced',
      })

      expect(mockAuthState.hasPermission).toHaveBeenCalledWith('chat', 'advanced')
      expect(result).toBe(mockFallback)
    })

    it('should not check permissions when feature is missing', () => {
      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
        action: 'advanced',
      })

      expect(mockAuthState.hasPermission).not.toHaveBeenCalled()
      expect(result).toBe(mockChildren)
    })

    it('should not check permissions when action is missing', () => {
      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
        feature: 'chat',
      })

      expect(mockAuthState.hasPermission).not.toHaveBeenCalled()
      expect(result).toBe(mockChildren)
    })

    it('should not check permissions when both feature and action are missing', () => {
      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
      })

      expect(mockAuthState.hasPermission).not.toHaveBeenCalled()
      expect(result).toBe(mockChildren)
    })
  })

  describe('combined checks', () => {
    beforeEach(() => {
      mockAuthState.isAuthenticated = true
    })

    it('should render children when both subscription and permission requirements are met', () => {
      mockAuthState.hasSubscription.mockReturnValue(true)
      mockAuthState.hasPermission.mockReturnValue(true)

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
        subscription: { plan: 'pro' },
        feature: 'chat',
        action: 'advanced',
      })

      expect(mockAuthState.hasSubscription).toHaveBeenCalledWith('pro', 'main')
      expect(mockAuthState.hasPermission).toHaveBeenCalledWith('chat', 'advanced')
      expect(result).toBe(mockChildren)
    })

    it('should render fallback when subscription requirement is not met (even if permission is met)', () => {
      mockAuthState.hasSubscription.mockReturnValue(false)
      mockAuthState.hasPermission.mockReturnValue(true)

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
        subscription: { plan: 'pro' },
        feature: 'chat',
        action: 'advanced',
      })

      expect(mockAuthState.hasSubscription).toHaveBeenCalledWith('pro', 'main')
      expect(mockAuthState.hasPermission).not.toHaveBeenCalled() // Should not reach permission check
      expect(result).toBe(mockFallback)
    })

    it('should render fallback when permission requirement is not met (even if subscription is met)', () => {
      mockAuthState.hasSubscription.mockReturnValue(true)
      mockAuthState.hasPermission.mockReturnValue(false)

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
        subscription: { plan: 'pro' },
        feature: 'chat',
        action: 'advanced',
      })

      expect(mockAuthState.hasSubscription).toHaveBeenCalledWith('pro', 'main')
      expect(mockAuthState.hasPermission).toHaveBeenCalledWith('chat', 'advanced')
      expect(result).toBe(mockFallback)
    })

    it('should render fallback when both requirements are not met', () => {
      mockAuthState.hasSubscription.mockReturnValue(false)
      mockAuthState.hasPermission.mockReturnValue(false)

      const result = renderComponent({
        children: mockChildren,
        fallback: mockFallback,
        subscription: { plan: 'pro' },
        feature: 'chat',
        action: 'advanced',
      })

      expect(mockAuthState.hasSubscription).toHaveBeenCalledWith('pro', 'main')
      expect(mockAuthState.hasPermission).not.toHaveBeenCalled() // Should not reach permission check
      expect(result).toBe(mockFallback)
    })
  })

  describe('real-world scenarios', () => {
    beforeEach(() => {
      mockAuthState.isAuthenticated = true
    })

    it('should handle freemium user scenario', () => {
      // Free user trying to access pro feature
      mockAuthState.hasSubscription.mockReturnValue(false)

      const result = renderComponent({
        children: 'Advanced Chat Features',
        fallback: 'Upgrade to Pro for advanced chat',
        subscription: { plan: 'pro' },
      })

      expect(result).toBe('Upgrade to Pro for advanced chat')
    })

    it('should handle pro user with proper permissions', () => {
      // Pro user with advanced chat permissions
      mockAuthState.hasSubscription.mockReturnValue(true)
      mockAuthState.hasPermission.mockReturnValue(true)

      const result = renderComponent({
        children: 'Advanced Chat Interface',
        fallback: 'Access Denied',
        subscription: { plan: 'pro' },
        feature: 'chat',
        action: 'advanced',
      })

      expect(result).toBe('Advanced Chat Interface')
    })

    it('should handle admin-only features', () => {
      // Regular user trying to access admin features
      mockAuthState.hasPermission.mockReturnValue(false)

      const result = renderComponent({
        children: 'Admin Dashboard',
        fallback: 'Admin access required',
        feature: 'admin',
        action: 'view',
      })

      expect(result).toBe('Admin access required')
    })

    it('should handle enterprise features with custom product ID', () => {
      // Enterprise user with custom product
      mockAuthState.hasSubscription.mockReturnValue(true)

      const result = renderComponent({
        children: 'Enterprise Analytics',
        fallback: 'Enterprise subscription required',
        subscription: { plan: 'analytics', productId: 'enterprise-addon' },
      })

      expect(mockAuthState.hasSubscription).toHaveBeenCalledWith('analytics', 'enterprise-addon')
      expect(result).toBe('Enterprise Analytics')
    })

    it('should handle trial user scenario', () => {
      // Trial user with temporary access
      mockAuthState.hasSubscription.mockReturnValue(true) // Trial counts as active subscription
      mockAuthState.hasPermission.mockReturnValue(true)

      const result = renderComponent({
        children: 'Pro Features (Trial)',
        fallback: 'Trial expired',
        subscription: { plan: 'pro' },
        feature: 'api',
        action: 'read',
      })

      expect(result).toBe('Pro Features (Trial)')
    })
  })

  describe('edge cases', () => {
    it('should handle undefined children gracefully', () => {
      mockAuthState.isAuthenticated = true

      const result = renderComponent({
        children: undefined,
        fallback: mockFallback,
      })

      expect(result).toBe(undefined)
    })

    it('should handle undefined fallback gracefully', () => {
      mockAuthState.isAuthenticated = false

      const result = renderComponent({
        children: mockChildren,
        fallback: undefined,
      })

      expect(result).toBe(null) // ProtectedComponent returns null when fallback is undefined
    })

    it('should handle empty string children', () => {
      mockAuthState.isAuthenticated = true

      const result = renderComponent({
        children: '',
        fallback: mockFallback,
      })

      expect(result).toBe('')
    })

    it('should handle empty string fallback', () => {
      mockAuthState.isAuthenticated = false

      const result = renderComponent({
        children: mockChildren,
        fallback: '',
      })

      expect(result).toBe('')
    })

    it('should handle complex children objects', () => {
      mockAuthState.isAuthenticated = true
      const complexChildren = { type: 'div', props: { children: 'Complex Content' } }

      const result = renderComponent({
        children: complexChildren,
        fallback: mockFallback,
      })

      expect(result).toBe(complexChildren)
    })
  })

  describe('prop validation', () => {
    beforeEach(() => {
      mockAuthState.isAuthenticated = true
    })

    it('should handle subscription prop with only plan', () => {
      mockAuthState.hasSubscription.mockReturnValue(true)

      renderComponent({
        children: mockChildren,
        subscription: { plan: 'basic' },
      })

      expect(mockAuthState.hasSubscription).toHaveBeenCalledWith('basic', 'main')
    })

    it('should handle subscription prop with plan and productId', () => {
      mockAuthState.hasSubscription.mockReturnValue(true)

      renderComponent({
        children: mockChildren,
        subscription: { plan: 'premium', productId: 'addon' },
      })

      expect(mockAuthState.hasSubscription).toHaveBeenCalledWith('premium', 'addon')
    })

    it('should handle feature without action (should not check permissions)', () => {
      renderComponent({
        children: mockChildren,
        feature: 'chat',
      })

      expect(mockAuthState.hasPermission).not.toHaveBeenCalled()
    })

    it('should handle action without feature (should not check permissions)', () => {
      renderComponent({
        children: mockChildren,
        action: 'read',
      })

      expect(mockAuthState.hasPermission).not.toHaveBeenCalled()
    })

    it('should require both feature and action for permission check', () => {
      mockAuthState.hasPermission.mockReturnValue(true)

      renderComponent({
        children: mockChildren,
        feature: 'api',
        action: 'write',
      })

      expect(mockAuthState.hasPermission).toHaveBeenCalledWith('api', 'write')
    })
  })
})
