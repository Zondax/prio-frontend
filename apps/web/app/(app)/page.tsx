'use client'

import { Button } from '@/components/ui/button'
import { SignInButton, useUser } from '@zondax/auth-web'

export default function HomePage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Kickstarter</h1>
          <p className="text-lg text-muted-foreground">Please sign in to continue</p>
          <SignInButton>
            <Button size="lg">Sign In</Button>
          </SignInButton>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: 'calc(100vh - var(--topbar-height) - (var(--body-base-padding) * 2))',
      }}
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome to Kickstarter</h1>
        <p className="text-lg text-muted-foreground">A clean Next.js template for building products</p>
        <p className="text-sm text-muted-foreground">Hello, {user.firstName || user.emailAddresses[0]?.emailAddress}!</p>
      </div>
    </div>
  )
}
