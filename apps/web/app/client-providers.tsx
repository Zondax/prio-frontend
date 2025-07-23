'use client'

import { ProviderStack, webProviders } from '@zondax/ui-web/client'
import type * as React from 'react'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <ProviderStack providers={webProviders}>{children}</ProviderStack>
}
