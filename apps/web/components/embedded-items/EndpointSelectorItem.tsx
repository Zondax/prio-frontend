'use client'

import { useUser } from '@zondax/auth-web'
import { useMemo } from 'react'
import EndpointSelector from '@/components/endpoint-selector'

interface EndpointSelectorItemProps {
  showWhenAuthenticated?: boolean
}

/**
 * Embedded wrapper for EndpointSelector component
 * Only shows when user is authenticated by default
 */
export function EndpointSelectorItem({ showWhenAuthenticated = true }: EndpointSelectorItemProps) {
  const { user, isLoaded } = useUser()

  const shouldShow = useMemo(() => {
    if (!showWhenAuthenticated) return true
    return isLoaded && user
  }, [isLoaded, user, showWhenAuthenticated])

  if (!shouldShow) return null

  return <EndpointSelector />
}
