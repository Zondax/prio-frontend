'use client'

import { UserButton, useUser } from '@zondax/auth-web'
import { ThemeToggle, useTopBarItem, WebShell } from '@zondax/ui-common/client'
import Link from 'next/link'
import { useMemo } from 'react'

function SiteTopBarItems() {
  const logoComponent = useMemo(
    () => (
      <Link href="/" className="flex items-center space-x-2">
        <span className="text-xl font-bold text-gray-900 dark:text-white">Prio</span>
      </Link>
    ),
    []
  )
  const themeToggleComponent = useMemo(() => <ThemeToggle />, [])
  const userButtonComponent = useMemo(() => <UserButton />, [])

  useTopBarItem('logo', logoComponent, 'start', 0)
  useTopBarItem('theme-toggle', themeToggleComponent, 'end', 10)
  useTopBarItem('user-button', userButtonComponent, 'end', 20)

  return null
}

export default function SitePage() {
  const { isSignedIn, isLoaded } = useUser()

  return (
    <WebShell topBar={{ sticky: true }}>
      <SiteTopBarItems />

      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl">Welcome to Prio</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            AI does not need to be 1-on-1.
            <br />
            Collaborate with AI and teams to achieve more together.
          </p>
          <div className="pt-4">
            {!isLoaded ? (
              <div className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-gray-400 rounded-lg">Loading...</div>
            ) : isSignedIn ? (
              <Link
                href="/prio"
                className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Enter Prio
              </Link>
            ) : (
              <Link
                href="/prio"
                className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </WebShell>
  )
}
