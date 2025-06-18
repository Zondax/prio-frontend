'use client'

import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { CreditCard, Loader2 } from 'lucide-react'
import { createPortalSessionRequest, useCreatePortalSessionStore, useEndpointStore } from 'mono-state'
import { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ManageBillingButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
}

export function ManageBillingButton({ variant = 'outline', size = 'default', className }: ManageBillingButtonProps) {
  const portalStore = useCreatePortalSessionStore()
  const { selectedEndpoint } = useEndpointStore()

  // Setup gRPC configuration
  useGrpcSetup(portalStore.setParams, selectedEndpoint)

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

  return (
    <Button
      onClick={handleManageBilling}
      disabled={isLoading || portalStore.isInitializing}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating session...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Manage Billing
        </>
      )}
    </Button>
  )
}
