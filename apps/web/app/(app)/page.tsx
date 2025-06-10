'use client'

import { useSession } from '@zondax/auth-web'
import { signInAction } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          height: 'calc(100vh - var(--topbar-height) - (var(--body-base-padding) * 2))',
        }}
      >
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          height: 'calc(100vh - var(--topbar-height) - (var(--body-base-padding) * 2))',
        }}
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Kickstarter</h1>
          <p className="text-lg text-muted-foreground">Please sign in to continue</p>
          <form action={signInAction}>
            <Button type="submit" size="lg">
              Sign In
            </Button>
          </form>
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
        <p className="text-sm text-muted-foreground">Hello, {session.user?.name || session.user?.email}!</p>
      </div>
    </div>
  )
}
