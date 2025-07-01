'use client'

import { UserButton } from '@zondax/auth-web'
import { TriSection, withContextualItem } from '@zondax/ui-common'

/**
 * Contextual wrapper for UserButton component
 * This is in the app layer to avoid ui-common depending on auth-web
 */
export const UserButtonItem = withContextualItem<typeof UserButton, `${TriSection}`>(UserButton, {
  id: 'user-button',
  defaultSection: TriSection.Right,
  defaultPriority: 20,
  defaultPersistent: true,
})
