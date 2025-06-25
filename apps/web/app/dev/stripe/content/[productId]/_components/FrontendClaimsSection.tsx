'use client'

import { Alert, AlertDescription, Badge, Button } from '@zondax/ui-common'
import { CheckCircle, Clock, RefreshCw, User, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useAppAuthorization } from '@/lib/authorization/useAppAuthorization'

interface FrontendClaimsSectionProps {
  productId: string
  type: 'product' | 'subscription'
}

export default function FrontendClaimsSection({ productId, type }: FrontendClaimsSectionProps) {
  const auth = useAppAuthorization()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Check access based on type
  const hasAccess = type === 'subscription' ? auth.isSubscriptionActive(productId) : auth.hasPermission('product', productId)

  const subscriptionPlan = type === 'subscription' ? auth.getSubscriptionPlan(productId) : null
  const subscriptionStatus = type === 'subscription' ? auth.getSubscriptionStatus(productId) : null

  const refreshClaims = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  if (auth.isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertDescription>Not authenticated - please sign in</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {/* Access Status */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
        <div className="flex items-center gap-2">
          {hasAccess ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
          <Badge variant={hasAccess ? 'default' : 'destructive'} className="text-xs">
            {type === 'subscription'
              ? hasAccess
                ? 'Subscription Active'
                : 'No Active Subscription'
              : hasAccess
                ? 'Access Granted'
                : 'Access Denied'}
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={refreshClaims} disabled={isRefreshing}>
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Validation Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            Authentication:
          </span>
          <Badge variant="outline" className="text-xs">
            {auth.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            Method:
          </span>
          <code className="text-xs bg-muted px-2 py-1 rounded">{type === 'subscription' ? 'isSubscriptionActive' : 'hasPermission'}</code>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Resource:</span>
          <span className="font-mono text-xs">{type === 'subscription' ? `subscription:${productId}` : `product:${productId}`}</span>
        </div>

        {type === 'subscription' && subscriptionPlan && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Plan:</span>
            <Badge variant="secondary" className="text-xs">
              {subscriptionPlan}
            </Badge>
          </div>
        )}

        {type === 'subscription' && subscriptionStatus !== null && (
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={hasAccess ? 'default' : 'destructive'} className="text-xs">
              {subscriptionStatus === 1 ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Result:</span>
          <Badge variant={hasAccess ? 'default' : 'destructive'} className="text-xs">
            {hasAccess ? 'Authorized' : 'Unauthorized'}
          </Badge>
        </div>
      </div>

      {/* Usage Example */}
      <div className="bg-muted/30 p-3 rounded-lg border">
        <div className="text-xs font-medium mb-2 text-muted-foreground">Code Example:</div>
        <code className="text-xs font-mono">
          {type === 'subscription' ? `auth.isSubscriptionActive('${productId}')` : `auth.hasPermission('product', '${productId}')`}
        </code>
      </div>

      {/* Performance Note */}
      <Alert className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <Clock className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>Instant validation</strong> using cached JWT {type === 'subscription' ? 'subscription' : 'permission'} claims. Use for UI
          optimization only.
        </AlertDescription>
      </Alert>
    </div>
  )
}
