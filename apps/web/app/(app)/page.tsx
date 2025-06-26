'use client'

import { SignInButton, useUser } from '@zondax/auth-web'
import { Button } from '@zondax/ui-common'
import { ArrowRight, Code2 } from 'lucide-react'
import Link from 'next/link'

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
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Prio</h1>
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
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Prio</h1>
          <p className="text-lg text-muted-foreground">A clean Next.js template for building products</p>
          <p className="text-sm text-muted-foreground">Hello, {user.firstName || user.emailAddresses[0]?.emailAddress}!</p>
        </div>

        <div className="pt-6">
          <Link href="/dev">
            <Button size="lg" className="group">
              <Code2 className="mr-2 h-5 w-5" />
              Test Features & Components
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-3">Explore development tools and test new features</p>
        </div>
      </div>
    </div>
  )
}
