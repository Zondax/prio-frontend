'use client'

import { useUser } from '@zondax/auth-web'
import { ArrowRight, Code, Database, Palette, Shield, UserCog } from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function DevPage() {
  const { user, isLoaded } = useUser()
  const isAuthenticated = isLoaded && !!user

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Development Environment</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Tools and utilities for development and testing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Shield className="h-6 w-6 text-blue-500" />
              Authentication
            </CardTitle>
            <CardDescription className="text-sm">Manage and test authentication</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAuthenticated ? 'View your authentication details and tokens' : 'Sign in to access authentication features'}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dev/auth" className="w-full">
              <button
                type="button"
                className="flex items-center justify-between w-full p-3 text-sm font-medium bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                {isAuthenticated ? 'View auth details' : 'Sign in required'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Database className="h-6 w-6 text-green-500" />
              gRPC
            </CardTitle>
            <CardDescription className="text-sm">Test gRPC connections and queries</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAuthenticated ? 'Manage user preferences and test gRPC endpoints' : 'Sign in to access gRPC testing features'}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dev/grpc" className="w-full">
              <button
                type="button"
                className="flex items-center justify-between w-full p-3 text-sm font-medium bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                {isAuthenticated ? 'Access gRPC' : 'Sign in required'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Shield className="h-6 w-6 text-orange-500" />
              Authorization
            </CardTitle>
            <CardDescription className="text-sm">Test SaaS authorization system</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAuthenticated ? 'Demo subscription-based and usage-based authorization' : 'Sign in to test authorization features'}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dev/authorization" className="w-full">
              <button
                type="button"
                className="flex items-center justify-between w-full p-3 text-sm font-medium bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                {isAuthenticated ? 'Test authorization' : 'Sign in required'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <UserCog className="h-6 w-6 text-purple-500" />
              Waiting List
            </CardTitle>
            <CardDescription className="text-sm">Manage waiting list users</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAuthenticated ? 'View and manage users on the waiting list' : 'Sign in to access waiting list management'}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dev/waiting" className="w-full">
              <button
                type="button"
                className="flex items-center justify-between w-full p-3 text-sm font-medium bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                {isAuthenticated ? 'View waiting list' : 'Sign in required'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Palette className="h-6 w-6 text-pink-500" />
              UI Components
            </CardTitle>
            <CardDescription className="text-sm">Browse and test UI components</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore the component library with interactive examples and documentation
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dev/ui" className="w-full">
              <button
                type="button"
                className="flex items-center justify-between w-full p-3 text-sm font-medium bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Browse components
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {!isAuthenticated && (
        <div className="max-w-2xl mx-auto mt-12 p-6 bg-muted rounded-lg">
          <div className="flex items-start gap-4">
            <Code className="h-6 w-6 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Authentication Required</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You need to sign in to access most of the developer tools. Click the &quot;Sign In&quot; button in the top-right corner.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
