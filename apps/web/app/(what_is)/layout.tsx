import { LogIn, LogOut, Terminal } from 'lucide-react'
import Link from 'next/link'

import { auth } from '@/app/auth'
import { SignInFormAction, SignOutFormAction } from '@/components/auth/AuthFormAction'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'What is prio?',
  description: 'Prio! What is it?',
}

async function LoginNavigation() {
  const session = await auth()
  const user = session?.user

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-auto">
      <div className="flex items-center gap-2">
        {user ? (
          <div className="flex gap-2">
            <Link href="/explore">
              <Button variant="outline" className="flex items-center gap-2 shadow-xs">
                <Terminal className="h-4 w-4" />
                <span className="hidden sm:inline">Welcome!</span>
              </Button>
            </Link>
            <SignOutFormAction redirectTo="/">
              <Button variant="outline" className="flex items-center gap-2 shadow-xs" type="submit">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </SignOutFormAction>
          </div>
        ) : (
          <SignInFormAction redirectTo="/explore">
            <Button variant="outline" className="flex items-center gap-2 shadow-xs" type="submit">
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          </SignInFormAction>
        )}
      </div>
    </div>
  )
}

export default async function WhatIsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <LoginNavigation />
      <div className="relative z-0">{children}</div>
    </div>
  )
}
