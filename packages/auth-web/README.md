# @zondax/auth-web

Modern authentication and authorization package for Next.js applications using Clerk.

## Features

- 🔐 **Clerk Integration** - Complete authentication with Clerk
- 🛡️ **SaaS Authorization** - Subscription-based access control
- 🎯 **Feature Gates** - Granular permission system
- 📊 **Usage Limits** - Track and limit resource usage
- 🚩 **Feature Flags** - Beta features and gradual rollouts
- ⚡ **Zero Backend Calls** - All checks use local JWT claims
- 🎨 **React Components** - Ready-to-use protection components

## Installation

```bash
pnpm add @zondax/auth-web
```

## Quick Start

### 1. Setup Clerk Provider

```tsx
import { AuthProvider } from '@zondax/auth-web'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### 2. Configure Middleware

```tsx
// middleware.ts
import { authMiddleware, createRouteMatcher } from '@zondax/auth-web/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])

export default authMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return
  await auth.protect()
})

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)']
}
```

### 3. Use Authorization

```tsx
import { useAuthorization, ProGate, FeatureGate } from '@zondax/auth-web'

export default function Dashboard() {
  const { hasSubscription, hasPermission } = useAuthorization()

  return (
    <div>
      <h1>Dashboard</h1>
      
      <ProGate fallback={<div>Upgrade to Pro for advanced features</div>}>
        <AdvancedFeatures />
      </ProGate>

      <FeatureGate 
        feature="api" 
        action="write" 
        fallback={<div>API write access required</div>}
      >
        <APIControls />
      </FeatureGate>
    </div>
  )
}
```

## Package Structure

```
src/
├── client.ts              # Client-side hooks and components
├── server.ts              # Server-side functions
├── index.ts               # Main exports
├── components/
│   ├── ProtectedComponent.tsx  # Authorization components
│   ├── clerk.ts               # Clerk re-exports
│   └── index.ts               # Component exports
├── hooks/
│   ├── useAuthorization.ts    # Main authorization hook
│   ├── useGrpcSetup.ts       # gRPC configuration
│   └── index.ts              # Hook exports
└── authjs/                   # Alternative AuthJS implementation (unused)
```

## Import Paths

### Client Components
```tsx
import { useAuthorization, ProGate, SignInButton } from '@zondax/auth-web'
```

### Server Components
```tsx
import { auth } from '@zondax/auth-web/server'
```

### Specific Hooks
```tsx
import { useGrpcSetup } from '@zondax/auth-web/hooks'
```

## Authorization Components

### Subscription Gates
```tsx
<SubscriptionGate tier="pro" fallback={<UpgradePrompt />}>
  <ProFeatures />
</SubscriptionGate>

<ProGate fallback={<UpgradePrompt />}>
  <ProFeatures />
</ProGate>

<EnterpriseGate fallback={<ContactSales />}>
  <EnterpriseFeatures />
</EnterpriseGate>
```

### Feature Gates
```tsx
<FeatureGate feature="chat" action="advanced" fallback={<UpgradePrompt />}>
  <AdvancedChat />
</FeatureGate>
```

### Usage Gates
```tsx
<UsageGate resource="api_calls" fallback={<LimitReached />}>
  <APIInterface />
</UsageGate>
```

### Feature Flags
```tsx
<BetaFeatureGate fallback={<ComingSoon />}>
  <BetaFeature />
</BetaFeatureGate>
```

## Claims Structure

Configure user claims in Clerk's `publicMetadata`:

```json
{
  "subscription": "pro",
  "permissions": {
    "chat": ["basic", "advanced"],
    "api": ["read", "write"]
  },
  "usage": {
    "api_calls": { "used": 150, "limit": 1000 },
    "chat_messages": { "used": 50, "limit": 500 }
  },
  "features": ["beta_features", "priority_support"],
  "subscription_expires_at": 1735689600000
}
```

## License

UNLICENSED
