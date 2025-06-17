'use client'

import { ProtectedComponent } from '@zondax/auth-web'
import { useAppAuthorization } from '@/lib/authorization/useAppAuthorization'
import { Shield, Code, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Props {
  productId: string
  productName?: string
  type: 'product' | 'subscription'
}

export default function ProtectedContentExample({ productId, productName, type }: Props) {
  // Custom validation function based on type
  const customValidate = (auth: ReturnType<typeof useAppAuthorization>) => {
    return type === 'subscription' ? auth.isSubscriptionActive(productId) : auth.hasPermission('product', productId)
  }

  return (
    <div className="space-y-4">
      {/* Component Usage Example */}
      <div className="bg-muted/30 p-3 rounded-lg border">
        <div className="text-xs font-medium mb-2 text-muted-foreground">Component Usage:</div>
        <code className="text-xs font-mono">&lt;ProtectedComponent validate=&#123;customValidate&#125;&gt;</code>
      </div>

      {/* Live Demo */}
      <div className="border rounded-lg p-4 bg-background">
        <div className="text-sm font-medium mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Live Demo - Protected Content:
        </div>

        <ProtectedComponent
          useAuth={useAppAuthorization}
          validate={customValidate}
          fallback={<AccessDeniedCard productName={productName} type={type} />}
        >
          <AccessGrantedCard productName={productName} type={type} />
        </ProtectedComponent>
      </div>

      {/* How It Works */}
      <Alert className="border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20">
        <Code className="h-4 w-4" />
        <AlertDescription className="text-xs">
          <strong>{type === 'subscription' ? 'Subscription' : 'Product'} validation:</strong> ProtectedComponent uses custom validate
          function with {type === 'subscription' ? 'isSubscriptionActive()' : 'hasPermission()'}
          to check {type === 'subscription' ? 'subscription status' : 'product permissions'}.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function AccessDeniedCard({ productName, type }: { productName?: string; type: 'product' | 'subscription' }) {
  return (
    <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 rounded-lg">
      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
      <div className="flex-1">
        <div className="font-medium text-red-900 dark:text-red-100">
          {type === 'subscription' ? 'Subscription Required' : 'Access Denied'}
        </div>
        <div className="text-sm text-red-700 dark:text-red-300">
          {type === 'subscription'
            ? `You need an active subscription to access ${productName || 'this content'}.`
            : `You don't have permission to access ${productName || 'this product'}.`}
        </div>
      </div>
      <Badge variant="destructive" className="text-xs">
        {type === 'subscription' ? 'No Subscription' : 'Restricted'}
      </Badge>
    </div>
  )
}

function AccessGrantedCard({ productName, type }: { productName?: string; type: 'product' | 'subscription' }) {
  return (
    <div className="flex items-center gap-3 p-4 border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 rounded-lg">
      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
      <div className="flex-1">
        <div className="font-medium text-green-900 dark:text-green-100">
          {type === 'subscription' ? 'Subscription Active' : 'Access Granted'}
        </div>
        <div className="text-sm text-green-700 dark:text-green-300">
          {type === 'subscription'
            ? `Welcome! Your subscription to ${productName || 'this content'} is active.`
            : `Welcome! You have access to ${productName || 'this product'}.`}
        </div>
      </div>
      <Badge variant="default" className="text-xs">
        {type === 'subscription' ? 'Subscribed' : 'Authorized'}
      </Badge>
    </div>
  )
}
