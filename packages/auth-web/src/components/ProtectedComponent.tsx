'use client'

import type { ReactNode } from 'react'
import { useAuthorization } from '../hooks/useAuthorization'

export interface ProtectedComponentProps {
  children: ReactNode
  fallback?: ReactNode

  // Subscription check
  subscription?: {
    plan: string
    productId?: string
  }

  // Feature permission check
  feature?: string
  action?: string
}

/**
 * Simple component that conditionally renders children based on authorization
 */
export default function ProtectedComponent({ children, fallback = null, subscription, feature, action }: ProtectedComponentProps) {
  const auth = useAuthorization()

  if (auth.isLoading) {
    return fallback as any
  }

  if (!auth.isAuthenticated) {
    return fallback as any
  }

  // Check subscription
  if (subscription) {
    const { plan, productId = 'main' } = subscription
    if (!auth.hasSubscription(plan, productId)) {
      return fallback as any
    }
  }

  // Check feature permission
  if (feature && action && !auth.hasPermission(feature, action)) {
    return fallback as any
  }

  return children as any
}
