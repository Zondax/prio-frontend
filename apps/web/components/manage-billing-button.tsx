'use client'

import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { Button } from '@zondax/ui-web/client'
import { CreditCard, Loader2, Lock } from 'lucide-react'
import { createPortalSessionRequest, useCreatePortalSessionStore, useEndpointStore } from 'mono-state'
import { useCallback, useEffect } from 'react'
import { useAppAuthorization } from '@/lib/authorization/useAppAuthorization'

interface ManageBillingButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function ManageBillingButton({ variant = 'outline', size = 'default', className }: ManageBillingButtonProps) {
  const portalStore = useCreatePortalSessionStore()
  const { selectedEndpoint } = useEndpointStore()
  const auth = useAppAuthorization()

  // Setup gRPC configuration
  useGrpcSetup(portalStore.setParams, selectedEndpoint)

  // Check if user has any active subscriptions or purchases
  // Using a simple approach: if they're authenticated and have metadata, they likely have some billing activity
  const hasActiveBilling = auth.isAuthenticated && auth.hasAnySubscription()

  const handleManageBilling = useCallback(() => {
    try {
      const request = createPortalSessionRequest()

      portalStore.setInput(request)
    } catch (error) {
      console.error('Failed to create portal session:', error)
    }
  }, [portalStore])

  // Redirect to portal URL when available
  useEffect(() => {
    const portalUrl = portalStore.data?.getUrl?.()
    if (portalUrl) {
      window.location.href = portalUrl
    }
  }, [portalStore.data])

  const isLoading = portalStore.isLoading
  const _hasError = !!portalStore.error

  const isButtonDisabled = isLoading || portalStore.data === null || !hasActiveBilling

  return (
    <div className="inline-flex flex-col">
      <Button onClick={handleManageBilling} disabled={isButtonDisabled} variant={variant} size={size} className={className}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating session...
          </>
        ) : !hasActiveBilling ? (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Manage Billing
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Billing
          </>
        )}
      </Button>
      <p className="text-xs text-muted-foreground mt-1 text-center italic">
        {!hasActiveBilling ? '* Requires an active subscription or purchase' : '* Only available if you have an active subscription'}
      </p>
    </div>
  )
}
