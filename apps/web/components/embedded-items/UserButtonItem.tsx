'use client'

import { UserButton } from '@zondax/auth-web'

/**
 * Embedded wrapper for UserButton component
 * This is in the app layer to avoid ui-common depending on auth-web
 */
export function UserButtonItem() {
  return <UserButton />
}
