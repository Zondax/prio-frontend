'use client'

import { UserButton } from '@zondax/auth-web'
import { TriSection } from '@zondax/ui-common/client'
import type { EmbeddedItemComponentProps } from '@zondax/ui-common/server'
import { useMemo } from 'react'

/**
 * Embedded wrapper for UserButton component
 * This is in the app layer to avoid ui-common depending on auth-web
 */
export function UserButtonItem<TSection extends string = `${TriSection}`>({
  locationHook: location,
  section = TriSection.Right as TSection,
  priority = 20,
  persistent = true,
}: EmbeddedItemComponentProps<TSection>) {
  const userButtonComponent = useMemo(() => <UserButton />, [])

  location('user-button', userButtonComponent, section, priority, persistent)

  return null
}
