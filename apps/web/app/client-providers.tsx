'use client'

import { ProviderStack, webProviders } from '@zondax/ui-common/client'
import type { ReactNode } from 'react'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <ProviderStack providers={webProviders}>{children}</ProviderStack>
}
