'use client'

import { useUser } from '@zondax/auth-web'
import { TriSection } from '@zondax/ui-common/client'
import type { EmbeddedItemComponentProps } from '@zondax/ui-common/server'
import { useMemo } from 'react'
import EndpointSelector from '@/components/endpoint-selector'

interface EndpointSelectorItemProps<TSection extends string = `${TriSection}`> extends EmbeddedItemComponentProps<TSection> {
  showWhenAuthenticated?: boolean
}

/**
 * Embedded wrapper for EndpointSelector component
 * Only shows when user is authenticated by default
 */
export function EndpointSelectorItem<TSection extends string = `${TriSection}`>({
  locationHook: location,
  section = TriSection.Right as TSection,
  priority = 5,
  persistent = true,
  showWhenAuthenticated = true,
}: EndpointSelectorItemProps<TSection>) {
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
