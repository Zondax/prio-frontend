'use client'

import { useUser } from '@zondax/auth-web'
import { TriSection, withContextualItem } from '@zondax/ui-common'
import { useMemo } from 'react'
import EndpointSelector from '@/components/endpoint-selector'

interface ConditionalEndpointSelectorProps {
  showWhenAuthenticated?: boolean
}

function ConditionalEndpointSelector({ showWhenAuthenticated = true }: ConditionalEndpointSelectorProps) {
  const { user, isLoaded } = useUser()

  const shouldShow = useMemo(() => {
    if (!showWhenAuthenticated) return true
    return isLoaded && user
  }, [isLoaded, user, showWhenAuthenticated])

  if (!shouldShow) return null

  return <EndpointSelector />
}

/**
 * Contextual wrapper for EndpointSelector component
 * Only shows when user is authenticated by default
 */
export const EndpointSelectorItem = withContextualItem<typeof ConditionalEndpointSelector, `${TriSection}`>(ConditionalEndpointSelector, {
  id: 'endpoint-selector',
  defaultSection: TriSection.Right,
  defaultPriority: 5,
  defaultPersistent: true,
})
