'use client'

import { useUser } from '@zondax/auth-web'
import Link from 'next/link'

export default function SitePage() {
  const { isSignedIn, isLoaded } = useUser()

  return (
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
  )
}
