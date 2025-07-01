'use client'

import { useUser } from '@zondax/auth-web'
import { type ContextualItemComponentProps, TriSection } from '@zondax/ui-common'
import { useMemo } from 'react'
import EndpointSelector from '@/components/endpoint-selector'

export interface EndpointSelectorItemProps extends ContextualItemComponentProps<`${TriSection}`> {
  showWhenAuthenticated?: boolean
}

/**
 * Contextual wrapper for EndpointSelector component
 * Only shows when user is authenticated by default
 */
export function EndpointSelectorItem({
  locationHook: location,
  section = TriSection.Right,
  priority = 5,
  persistent = true,
  showWhenAuthenticated = true,
}: EndpointSelectorItemProps) {
  const { user, isLoaded } = useUser()

  const shouldShow = useMemo(() => {
    if (!showWhenAuthenticated) return true
    return isLoaded && user
  }, [isLoaded, user, showWhenAuthenticated])

  const endpointSelectorComponent = useMemo(() => {
    if (!shouldShow) return null
    return <EndpointSelector />
  }, [shouldShow])

  location('endpoint-selector', endpointSelectorComponent, section, priority, persistent)

  return null
}
