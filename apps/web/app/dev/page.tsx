import { ArrowRight, Code, Database, Shield, UserCog } from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { auth } from '../auth'

export default async function DevPage() {
  const session = await auth()
  const isAuthenticated = !!session?.user

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Development Environment</h1>
        <p className="text-muted-foreground">Tools and utilities for development and testing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Authentication
            </CardTitle>
            <CardDescription>Manage and test authentication</CardDescription>
          </CardHeader>
          <CardContent className="grow">
            <p className="text-sm">
              {isAuthenticated ? 'View your authentication details and tokens' : 'Sign in to access authentication features'}
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dev/auth" className="w-full">
              <button
                type="button"
                className="flex items-center justify-between w-full p-2 text-sm font-medium bg-muted rounded-md hover:bg-muted/80 transition-colors"
              >
                {isAuthenticated ? 'View auth details' : 'Sign in required'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              gRPC
            </CardTitle>
            <CardDescription>Test gRPC connections and queries</CardDescription>
          </CardHeader>
          <CardContent className="grow">
            <p className="text-sm">
              {isAuthenticated ? 'Manage user preferences and test gRPC endpoints' : 'Sign in to access gRPC testing features'}
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dev/grpc" className="w-full">
              <button
                type="button"
                className="flex items-center justify-between w-full p-2 text-sm font-medium bg-muted rounded-md hover:bg-muted/80 transition-colors"
              >
                {isAuthenticated ? 'Access gRPC' : 'Sign in required'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-purple-500" />
              Waiting List
            </CardTitle>
            <CardDescription>Manage waiting list users</CardDescription>
          </CardHeader>
          <CardContent className="grow">
            <p className="text-sm">
              {isAuthenticated ? 'View and manage users on the waiting list' : 'Sign in to access waiting list management'}
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dev/waiting" className="w-full">
              <button
                type="button"
                className="flex items-center justify-between w-full p-2 text-sm font-medium bg-muted rounded-md hover:bg-muted/80 transition-colors"
              >
                {isAuthenticated ? 'View waiting list' : 'Sign in required'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {!isAuthenticated && (
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-3">
            <Code className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Authentication Required</h3>
              <p className="text-sm text-muted-foreground">
                You need to sign in to access most of the developer tools. Click the &quot;Sign In&quot; button in the top-right corner.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
