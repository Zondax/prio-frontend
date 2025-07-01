'use client'

import { useMemo } from 'react'
import { UserButton } from '@zondax/auth-web'
import { type ContextualItemComponentProps, TriSection } from '@zondax/ui-common'

export interface UserButtonItemProps extends ContextualItemComponentProps<`${TriSection}`> {
  // Add any UserButton-specific props here if needed
}

/**
 * Contextual wrapper for UserButton component
 * This is in the app layer to avoid ui-common depending on auth-web
 */
export function UserButtonItem({
  locationHook: location,
  section = TriSection.Right,
  priority = 20,
  persistent = true,
}: UserButtonItemProps) {
  const userButtonComponent = useMemo(() => <UserButton />, [])

  location('user-button', userButtonComponent, section, priority, persistent)

  return null
}
