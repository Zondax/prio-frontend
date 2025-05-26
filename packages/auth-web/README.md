# auth-web

Authentication utilities for Next.js web applications.

## Overview

This package provides authentication utilities for Next.js web applications, including integration with Zitadel identity provider, server actions for authentication, and hooks for gRPC authentication setup.

## Files and Components

### Main Files

- **auth.ts** - Provides NextAuth configuration with Zitadel integration:

  - `authOptions(zitadelSettings)` - Creates NextAuth configuration with Zitadel provider
  - JWT and session callbacks for token management
  - Role parsing from Zitadel profiles

- **server-actions.ts** - Provides server actions for authentication:

  - `handleSignIn` - Function to handle user sign-in
  - `handleSignOut` - Function to handle user sign-out

- **index.ts** - Main entry point exporting all components

### Hooks

- **useGrpcSetup** - A React hook that handles authentication for gRPC services:
  - Sets up authentication metadata with access token
  - Configures baseUrl and authentication headers
  - Automatically updates when session or endpoint changes

## Usage

### NextAuth Configuration

```typescript
// app/auth.ts
import { authOptions } from '@zondax/auth-web'

const zitadelSettings = {
  scope: 'openid profile email',
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
  // other Zitadel settings
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions(zitadelSettings))
```

### Server Actions

The package provides server actions for authentication that can be used in Next.js applications:

```typescript
'use server'

// app/lib/auth-actions.ts
import { handleSignIn, handleSignOut } from '@zondax/auth-web'

import { signIn, signOut } from '@/app/auth' // your Next.js Auth.js setup

export async function signInAction(params: FormData | { redirectTo?: string }) {
  'use server'
  return handleSignIn(params, signIn)
}

export async function signOutAction(params: FormData | { redirectTo?: string }) {
  'use server'
  return handleSignOut(params, signOut)
}
```

Then use these actions in your components:

```typescript
// app/components/login-button.tsx
'use client'
import { signInAction } from '@/app/lib/auth-actions'

export function LoginButton() {
  return (
    <form action={signInAction}>
      <button type="submit">Sign In</button>
    </form>
  )
}
```

```typescript
// app/components/logout-button.tsx
'use client'
import { signOutAction } from '@/app/lib/auth-actions'

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <button type="submit">Sign Out</button>
    </form>
  )
}
```

### gRPC Authentication

For services using gRPC, use the `useGrpcSetup` hook to automatically configure authentication:

```typescript
// In your component or store
import { useGrpcSetup } from '@zondax/auth-web'

// Inside a React component
function MyComponent() {
  useGrpcSetup(myStore.setParams, 'https://api.example.com')

  // rest of your component
}

// Or in a store initialization
const myStore = create()(set => ({
  // other store properties

  init: () => {
    // The hook will call this function with the right authentication metadata
    const setParams = config => {
      set({ config })
    }

    // Use the hook somewhere in your React component tree
    // useGrpcSetup(setParams, 'https://api.example.com')
  },
}))
```
