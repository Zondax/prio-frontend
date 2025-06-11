'use client'

import { cn } from '@/lib/utils'
import { useAuthorization } from '@zondax/auth-web'
import ProtectedComponent from '@zondax/auth-web/components'
import { Check, CheckCircle, Code, Copy, Crown, Database, MessageSquare, Shield, XCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const EXAMPLE_CLAIMS = {
  free: {
    subscriptions: {
      main: { plan: 'free', status: 'active' },
    },
    permissions: {
      chat: ['basic'],
    },
  },
  pro: {
    subscriptions: {
      main: { plan: 'pro', status: 'active' },
    },
    permissions: {
      chat: ['basic', 'advanced'],
      api: ['read'],
    },
  },
  enterprise: {
    subscriptions: {
      main: { plan: 'enterprise', status: 'active' },
    },
    permissions: {
      chat: ['basic', 'advanced'],
      api: ['read', 'write'],
      admin: ['view', 'edit'],
    },
  },
  trial: {
    subscriptions: {
      main: { plan: 'pro', status: 'trial', expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 },
    },
    permissions: {
      chat: ['basic', 'advanced'],
      api: ['read'],
    },
  },
}

function StatusBadge({ available }: { available: boolean }) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
        available
          ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
          : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
      )}
    >
      {available ? (
        <>
          <CheckCircle className="h-3 w-3 mr-1.5" /> Available
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3 mr-1.5" /> Blocked
        </>
      )}
    </div>
  )
}

export default function AuthorizationDemoPage() {
  const { claims, hasPermission } = useAuthorization()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 max-h-screen overflow-hidden">
      {/* Compact Header */}
      <div className="text-center py-2">
        <h1 className="text-2xl font-bold tracking-tight">Authorization Testing</h1>
      </div>

      {/* Minimal Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span className="text-sm text-blue-800 dark:text-blue-300">
            Copy example claims and paste into your user's <strong>publicMetadata</strong> in the Clerk Dashboard.
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-160px)]">
        {/* Left Side - Unified Claims */}
        <div className="h-full">
          <Card className="h-full flex flex-col">
            <CardHeader className="py-4 px-6 border-b">
              <CardTitle className="text-lg font-semibold">Claims</CardTitle>
              <CardDescription className="text-sm">Current and example JWT claims</CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <Tabs defaultValue="current" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-5 h-10 bg-muted/50">
                  <TabsTrigger
                    value="current"
                    className="text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Current
                  </TabsTrigger>
                  <TabsTrigger
                    value="free"
                    className="text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Free
                  </TabsTrigger>
                  <TabsTrigger
                    value="pro"
                    className="text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Pro
                  </TabsTrigger>
                  <TabsTrigger
                    value="enterprise"
                    className="text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Enterprise
                  </TabsTrigger>
                  <TabsTrigger
                    value="trial"
                    className="text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Trial
                  </TabsTrigger>
                </TabsList>

                <div className="relative mt-3 flex-grow">
                  {/* Current Claims Tab */}
                  <TabsContent value="current" className="absolute inset-0 h-full m-0">
                    <div className="bg-muted/30 rounded-lg p-4 h-full overflow-auto border">
                      <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap pb-6">
                        {JSON.stringify(claims || {}, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>

                  {/* Example Claims Tabs */}
                  {Object.entries(EXAMPLE_CLAIMS).map(([key, exampleClaims]) => (
                    <TabsContent key={key} value={key} className="absolute inset-0 h-full m-0">
                      <div className="bg-muted/30 rounded-lg p-4 relative h-full border">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 h-8 w-8 p-0 z-10 hover:bg-background/80"
                          onClick={() => copyToClipboard(JSON.stringify(exampleClaims, null, 2))}
                        >
                          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <div className="overflow-auto h-full pr-12 pb-6">
                          <pre className="text-xs text-muted-foreground font-mono whitespace-pre-wrap">
                            {JSON.stringify(exampleClaims, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Visual Tests */}
        <div className="space-y-4 h-full overflow-auto">
          {/* Subscription Tests */}
          <Card>
            <CardHeader className="py-4 px-6 border-b">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Crown className="h-5 w-5 text-amber-500" />
                Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <ProtectedComponent
                  subscription={{ plan: 'free' }}
                  fallback={
                    <div className="flex-1 text-center p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                      <p className="text-sm text-muted-foreground font-medium">Free</p>
                    </div>
                  }
                >
                  <div className="flex-1 text-center p-3 bg-green-50 border-2 border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">Free</p>
                  </div>
                </ProtectedComponent>
                <ProtectedComponent
                  subscription={{ plan: 'pro' }}
                  fallback={
                    <div className="flex-1 text-center p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                      <p className="text-sm text-muted-foreground font-medium">Pro</p>
                    </div>
                  }
                >
                  <div className="flex-1 text-center p-3 bg-blue-50 border-2 border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Pro</p>
                  </div>
                </ProtectedComponent>
                <ProtectedComponent
                  subscription={{ plan: 'enterprise' }}
                  fallback={
                    <div className="flex-1 text-center p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                      <p className="text-sm text-muted-foreground font-medium">Enterprise</p>
                    </div>
                  }
                >
                  <div className="flex-1 text-center p-3 bg-purple-50 border-2 border-purple-200 rounded-lg dark:bg-purple-900/20 dark:border-purple-800">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">Enterprise</p>
                  </div>
                </ProtectedComponent>
              </div>
            </CardContent>
          </Card>

          {/* Feature Tests */}
          <Card>
            <CardHeader className="py-4 px-6 border-b">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Shield className="h-5 w-5 text-blue-500" />
                Features
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Basic Chat</span>
                  </div>
                  <StatusBadge available={hasPermission('chat', 'basic')} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Advanced Chat</span>
                  </div>
                  <StatusBadge available={hasPermission('chat', 'advanced')} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">API Read</span>
                  </div>
                  <StatusBadge available={hasPermission('api', 'read')} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">API Write</span>
                  </div>
                  <StatusBadge available={hasPermission('api', 'write')} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Copy Notification */}
      {copied && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  )
}
