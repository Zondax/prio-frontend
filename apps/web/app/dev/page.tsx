'use client'

import { useUser } from '@zondax/auth-web'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@zondax/ui-common'
import { ArrowRight, CreditCard, Database, Shield } from 'lucide-react'
import Link from 'next/link'

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
              <CreditCard className="h-6 w-6 text-purple-500" />
              Stripe
            </CardTitle>
            <CardDescription className="text-sm">Test payment integration and authorization</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pb-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAuthenticated
                ? 'Demo payment flows, product purchases, and authorization system'
                : 'Sign in to test Stripe payment features'}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dev/stripe" className="w-full">
              <button
                type="button"
                className="flex items-center justify-between w-full p-3 text-sm font-medium bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                {isAuthenticated ? 'Test payments' : 'Sign in required'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
