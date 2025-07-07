# ADR-009: Authentication Architecture

**Status**: Active  
**Date**: 2025-07-04  
**Decision Makers**: Development Team  
**Consulted**: Security Team, Backend Team  

## Problem Statement

As we build SaaS applications across multiple platforms (web, mobile, desktop) with enterprise requirements, we need a comprehensive authentication system that provides:

1. **Multi-Platform Support**: Consistent authentication across web browsers, mobile apps, and desktop applications
2. **Enterprise Features**: SSO, SAML, role-based access control, audit trails
3. **Security Standards**: JWT tokens, secure storage, automatic refresh, session management
4. **Developer Experience**: Type-safe APIs, easy integration, comprehensive testing
5. **Scalability**: Multi-tenant architecture with subscription-based authorization
6. **Flexibility**: Support for multiple authentication providers and custom business logic
7. **Compliance**: GDPR, SOC2, and enterprise security requirements

The decision point: How do we architect an authentication system that scales from startup to enterprise while maintaining security, developer productivity, and user experience?

## Decision

**Multi-Library Authentication Architecture**: Platform-specific authentication implementations sharing common core logic, with Clerk.dev as primary web provider and auth-core for business logic abstraction.

### Core Architecture
- **@zondax/auth-core**: Platform-agnostic authentication logic (JWT, roles, permissions)
- **@zondax/auth-web**: Web implementation using Clerk.dev with React integration
- **@zondax/auth-expo**: Mobile implementation with device attestation and secure storage
- **@zondax/auth-tauri**: Desktop implementation with deep-link OAuth and keychain storage
- **Subscription-based authorization**: Fine-grained permission system with feature gates

### Authentication Flow
```typescript
// Multi-platform pattern
Platform Provider (Clerk/OAuth) -> auth-core -> Business Logic -> Protected Resources

// Authorization pattern  
JWT Claims -> Subscription Check -> Permission Validation -> Resource Access
```

## Alternatives Considered

### Option A: Single Provider Solution (Auth0, Firebase Auth)
**Pros**: Comprehensive features, enterprise support, proven scalability
**Cons**: Vendor lock-in, high costs at scale, limited customization
**Verdict**: Rejected - prefer modular approach with provider flexibility

### Option B: Custom Authentication System
**Pros**: Full control, optimized for specific needs, no vendor dependency
**Cons**: Significant development overhead, security risks, maintenance burden
**Verdict**: Rejected - authentication security is too critical to build from scratch

### Option C: NextAuth.js + Custom Authorization
**Pros**: Open source, flexible providers, good Next.js integration
**Cons**: Limited enterprise features, complex setup, mobile integration challenges
**Verdict**: Considered but secondary - kept as Zitadel integration option

### Option D: Platform-Specific Solutions
**Pros**: Optimized for each platform, native integrations
**Cons**: Inconsistent UX, multiple systems to maintain, complex user management
**Verdict**: Rejected - prefer unified user experience across platforms

## Rationale

### Why Multi-Library + Clerk Architecture?

**Platform Abstraction Benefits**:
- **Consistent APIs**: Same authentication interface across web, mobile, desktop
- **Business Logic Separation**: Core authorization logic independent of providers
- **Provider Flexibility**: Can switch providers without changing business logic
- **Testing**: Unified testing patterns across all platforms

**Clerk Selection for Web**:
- **Developer Experience**: Excellent React integration, comprehensive hooks
- **Enterprise Features**: SSO, SAML, organizations, audit logs
- **Security**: SOC2 compliant, secure by default, automatic security updates
- **Scalability**: Handles growth from prototype to enterprise scale
- **Cost Efficiency**: Competitive pricing with transparent scaling

**auth-core Abstraction**:
- **Business Logic**: Subscription management, permission checking, role validation
- **Type Safety**: Comprehensive TypeScript types with protobuf integration
- **Testability**: Pure functions for easy unit testing
- **Reusability**: Share logic across all platform implementations

### Architecture Benefits

**Developer Productivity**: Consistent APIs reduce context switching between platforms
**Security**: Industry-standard providers with security expertise
**User Experience**: Seamless authentication across all platforms
**Maintainability**: Centralized business logic with platform-specific optimizations
**Compliance**: Enterprise-grade security and audit capabilities

## Consequences

### Positive
- **Rapid Development**: Pre-built authentication features accelerate time-to-market
- **Enterprise Ready**: SSO, SAML, and compliance features available out-of-box
- **Security**: Professional security management without internal expertise required
- **Scalability**: Proven to handle enterprise user volumes and requirements
- **Multi-Platform**: Consistent user experience across web, mobile, desktop
- **Cost Predictable**: Transparent pricing model with enterprise volume discounts

### Negative
- **Vendor Dependency**: Reliance on Clerk for web authentication features
- **Integration Complexity**: Multiple libraries require careful coordination
- **Learning Curve**: Team needs to understand multiple authentication patterns

### Risks
- **Provider Changes**: Clerk pricing or feature changes could impact roadmap
- **Platform Limitations**: Platform-specific authentication constraints
- **Migration Complexity**: Switching providers requires significant development effort

## Implementation Architecture

### 1. Core Authentication Library (@zondax/auth-core)

**Business Logic Interface**:
```typescript
// Core authentication types
export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  emailVerified: boolean
  createdAt: Date
  lastLoginAt: Date
}

export interface AuthSession {
  userId: string
  token: string
  expiresAt: Date
  refreshToken?: string
  deviceId?: string
  platform: 'web' | 'mobile' | 'desktop'
}

// Subscription and permissions
export interface UserSubscription {
  plan: SubscriptionPlan
  productId: string
  features: string[]
  limits: Record<string, number>
  expiresAt?: Date
}

export interface AuthPermissions {
  resources: Record<string, string[]> // resource -> permissions
  roles: string[]
  organizations: OrganizationMembership[]
}
```

**Authorization Logic**:
```typescript
// auth-core/src/permissions.ts
export class AuthorizationService {
  static hasSubscription(
    user: AuthUser, 
    plan: SubscriptionPlan, 
    productId: string
  ): boolean {
    const subscription = user.subscriptions?.find(s => s.productId === productId)
    return subscription?.plan === plan && this.isSubscriptionActive(subscription)
  }

  static hasPermission(
    user: AuthUser,
    resource: string,
    permission: string,
    resourceId?: string
  ): boolean {
    // Check role-based permissions
    const hasRolePermission = user.permissions.resources[resource]?.includes(permission)
    
    // Check organization-level permissions
    const hasOrgPermission = resourceId ? 
      this.checkOrganizationPermission(user, resource, permission, resourceId) : 
      false

    return hasRolePermission || hasOrgPermission
  }

  static canAccessFeature(user: AuthUser, featureId: string): boolean {
    return user.subscriptions?.some(sub => 
      sub.features.includes(featureId) && this.isSubscriptionActive(sub)
    ) ?? false
  }
}
```

### 2. Web Authentication (@zondax/auth-web)

**Clerk Provider Integration**:
```typescript
// auth-web/src/ClerkAuthProvider.tsx
import { ClerkProvider, useAuth, useUser } from '@clerk/nextjs'
import { AuthorizationService } from '@zondax/auth-core'

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider 
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        theme: 'light',
        elements: { card: 'shadow-lg border border-gray-200' }
      }}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ClerkProvider>
  )
}

// Custom React hooks wrapping Clerk
export function useAppAuthorization() {
  const { user } = useUser()
  const { getToken } = useAuth()

  return {
    user: convertClerkUserToAuthUser(user),
    hasSubscription: (plan: SubscriptionPlan, productId: string) =>
      AuthorizationService.hasSubscription(user, plan, productId),
    hasPermission: (resource: string, permission: string, resourceId?: string) =>
      AuthorizationService.hasPermission(user, resource, permission, resourceId),
    getAuthToken: () => getToken({ leewayInSeconds: 45 }),
    isLoading: !user,
  }
}
```

**Route Protection**:
```typescript
// middleware.ts - Route-level protection
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/pricing', '/about'],
  beforeAuth: (auth, req) => {
    // Custom logic before authentication
  },
  afterAuth: async (auth, req) => {
    if (!auth.userId && !isPublicRoute(req)) {
      return redirectToSignIn({ returnBackUrl: req.url })
    }
    
    // Check subscription for protected features
    if (isSubscriptionRoute(req) && !hasActiveSubscription(auth.userId)) {
      return redirect('/upgrade')
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
```

**Component Protection**:
```typescript
// Protected component pattern
export function ProtectedComponent({ 
  children, 
  subscription,
  permission,
  fallback = <UpgradePrompt />
}: ProtectedComponentProps) {
  const { hasSubscription, hasPermission } = useAppAuthorization()

  const isAuthorized = useMemo(() => {
    if (subscription) {
      return hasSubscription(subscription.plan, subscription.productId)
    }
    if (permission) {
      return hasPermission(permission.resource, permission.action, permission.resourceId)
    }
    return true
  }, [subscription, permission, hasSubscription, hasPermission])

  if (!isAuthorized) {
    return fallback
  }

  return <>{children}</>
}

// Usage
<ProtectedComponent 
  subscription={{ plan: 'pro', productId: 'advanced-analytics' }}
  fallback={<AnalyticsUpgrade />}
>
  <AdvancedAnalytics />
</ProtectedComponent>
```

### 3. Mobile Authentication (@zondax/auth-expo)

**Expo Authentication Setup**:
```typescript
// auth-expo/src/ExpoAuthProvider.tsx
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'

export function ExpoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loginWithOAuth = useCallback(async (provider: 'google' | 'apple') => {
    const request = new AuthSession.AuthRequest({
      clientId: Config.OAUTH_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true })
    })

    const result = await request.promptAsync({
      authorizationEndpoint: `${Config.AUTH_ENDPOINT}/oauth/${provider}`
    })

    if (result.type === 'success') {
      const { accessToken, refreshToken } = result.params
      await storeTokens(accessToken, refreshToken)
      await loadUserProfile(accessToken)
    }
  }, [])

  const storeTokens = async (accessToken: string, refreshToken: string) => {
    await SecureStore.setItemAsync('auth_access_token', accessToken)
    await SecureStore.setItemAsync('auth_refresh_token', refreshToken)
  }

  return (
    <AuthContext.Provider value={{ user, loginWithOAuth, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Device Attestation**:
```typescript
// Device security for mobile
export async function createDeviceAttestation(): Promise<DeviceAttestation> {
  const deviceInfo = {
    platform: Platform.OS,
    version: Platform.Version,
    model: Device.modelName,
    isEmulator: Device.isDevice === false,
    hasPasscode: await LocalAuthentication.hasHardwareAsync(),
    biometricType: await LocalAuthentication.supportedAuthenticationTypesAsync()
  }

  const attestation = await signDeviceInfo(deviceInfo)
  return { deviceInfo, signature: attestation }
}
```

### 4. Desktop Authentication (@zondax/auth-tauri)

**Tauri OAuth Implementation**:
```typescript
// auth-tauri/src/TauriAuthProvider.tsx
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'

export function TauriAuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState)

  const loginWithOAuth = useCallback(async (provider: string) => {
    // Development: localhost callback
    if (process.env.NODE_ENV === 'development') {
      const authUrl = `${AUTH_ENDPOINT}/oauth/${provider}?redirect_uri=http://localhost:3000/auth/callback`
      await invoke('open_external_url', { url: authUrl })
    } else {
      // Production: deep-link callback
      const authUrl = `${AUTH_ENDPOINT}/oauth/${provider}?redirect_uri=myapp://auth/callback`
      await invoke('open_external_url', { url: authUrl })
    }

    // Listen for OAuth callback
    const unlisten = await listen('oauth-callback', (event) => {
      const { code, state } = event.payload as OAuthCallback
      handleOAuthCallback(code, state)
      unlisten()
    })
  }, [])

  const storeTokenSecurely = async (tokens: AuthTokens) => {
    await invoke('store_credentials', {
      service: 'myapp-auth',
      account: tokens.userId,
      credentials: JSON.stringify(tokens)
    })
  }

  return (
    <AuthContext.Provider value={{ ...authState, loginWithOAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### 5. gRPC Integration

**Authenticated gRPC Calls**:
```typescript
// gRPC authentication interceptor
export function createAuthInterceptor(getToken: () => Promise<string | null>) {
  return async (request: any, next: any) => {
    const token = await getToken()
    
    if (token) {
      request.metadata = {
        ...request.metadata,
        'authorization': `Bearer ${token}`,
        'x-client-platform': getPlatform(),
        'x-client-version': getAppVersion()
      }
    }

    return next(request)
  }
}

// Store integration with authentication
export function useAuthenticatedStore<T>(
  createStore: (client: GrpcClient) => T,
  clientFactory: (config: GrpcConfig) => GrpcClient
): T {
  const { getAuthToken } = useAppAuthorization()
  
  const authenticatedClient = useMemo(() => {
    const config: GrpcConfig = {
      endpoint: process.env.GRPC_ENDPOINT,
      interceptors: [createAuthInterceptor(getAuthToken)]
    }
    return clientFactory(config)
  }, [getAuthToken])

  return createStore(authenticatedClient)
}
```

### 6. Testing Patterns

**Authentication Testing Utilities**:
```typescript
// test-utils/auth.ts
export function createMockAuthUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: true,
    subscriptions: [createMockSubscription()],
    permissions: createMockPermissions(),
    ...overrides
  }
}

export function createAuthProviderWrapper(user: AuthUser = createMockAuthUser()) {
  return function AuthWrapper({ children }: { children: React.ReactNode }) {
    return (
      <AuthContext.Provider value={{
        user,
        isLoading: false,
        hasSubscription: vi.fn(() => true),
        hasPermission: vi.fn(() => true),
        getAuthToken: vi.fn(() => Promise.resolve('mock-token'))
      }}>
        {children}
      </AuthContext.Provider>
    )
  }
}

// Component testing with authentication
describe('ProtectedComponent', () => {
  it('renders content for authorized users', () => {
    const AuthWrapper = createAuthProviderWrapper(
      createMockAuthUser({ subscriptions: [{ plan: 'pro', productId: 'analytics' }] })
    )

    render(
      <ProtectedComponent subscription={{ plan: 'pro', productId: 'analytics' }}>
        <div>Protected Content</div>
      </ProtectedComponent>,
      { wrapper: AuthWrapper }
    )

    expect(screen.getByText('Protected Content')).toBeTruthy()
  })
})
```

### 7. Multi-Tenant Architecture

**Organization-Based Permissions**:
```typescript
// Organization context and permissions
export interface OrganizationMembership {
  organizationId: string
  organizationName: string
  role: 'owner' | 'admin' | 'member'
  permissions: string[]
  joinedAt: Date
}

export function useOrganizationAuth(organizationId: string) {
  const { user } = useAppAuthorization()
  
  const membership = useMemo(() => 
    user?.organizations?.find(org => org.organizationId === organizationId),
    [user, organizationId]
  )

  const hasOrgPermission = useCallback((permission: string) => {
    return membership?.permissions.includes(permission) ?? false
  }, [membership])

  return {
    membership,
    hasOrgPermission,
    isOwner: membership?.role === 'owner',
    isAdmin: membership?.role === 'admin',
    canManageMembers: hasOrgPermission('manage:members'),
    canManageBilling: hasOrgPermission('manage:billing')
  }
}
```

### 8. Security Implementation

**Token Refresh Strategy**:
```typescript
// Automatic token refresh with retry logic
export class TokenManager {
  private refreshPromise: Promise<string> | null = null

  async getValidToken(): Promise<string | null> {
    const currentToken = await this.getCurrentToken()
    
    if (!currentToken || this.isTokenExpiringSoon(currentToken)) {
      return this.refreshToken()
    }
    
    return currentToken
  }

  private async refreshToken(): Promise<string | null> {
    // Prevent multiple concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performTokenRefresh()
    
    try {
      const newToken = await this.refreshPromise
      this.refreshPromise = null
      return newToken
    } catch (error) {
      this.refreshPromise = null
      throw error
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = await this.getRefreshToken()
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    // Platform-specific token refresh implementation
    return this.platformRefreshToken(refreshToken)
  }
}
```

## Future Enhancements

### Planned Features
- **SSO Integration**: Enterprise SAML/OIDC provider integration
- **Advanced RBAC**: Fine-grained role and permission management
- **Audit Logging**: Comprehensive authentication and authorization audit trails
- **Session Management**: Advanced session controls and device management
- **Passwordless Authentication**: WebAuthn and magic link support

### Security Enhancements
- **Zero-Trust Architecture**: Continuous authentication and authorization
- **Device Trust**: Device attestation and trust scoring
- **Anomaly Detection**: Suspicious authentication activity monitoring
- **Compliance**: Additional compliance certifications (FedRAMP, HIPAA)

### Platform Extensions
- **Chrome Extension**: Browser extension authentication
- **CLI Tools**: Command-line authentication for developer tools
- **API Keys**: Service-to-service authentication patterns
- **Webhook Authentication**: Secure webhook verification

## Related Decisions

- **ADR-005**: StoreBuilder architecture integrates with authentication for gRPC calls
- **ADR-008**: OpenTelemetry observability includes authentication event tracking
- **ADR-007**: Testing standards cover comprehensive authentication testing patterns
- **ADR-000**: Security standards inform authentication implementation requirements

---

*This authentication architecture provides enterprise-grade security and scalability while maintaining excellent developer experience across all platform implementations. The modular approach ensures flexibility and maintainability as requirements evolve.*