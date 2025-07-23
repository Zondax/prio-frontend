import { AuthProvider } from '@zondax/auth-web'
import { KsBody } from '@zondax/ui-web/client'
import type { Metadata } from 'next'
import { Figtree, Inter as FontSans, Parkinsans } from 'next/font/google'
import TurnstileOtelProvider from '@/app/telemetry/TurnstileOtelProvider'
import ClientProviders from './client-providers'

import '@/styles/globals.css'

// Configure inter with optional subsets
const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// Configure Figtree for body text
const fontBody = Figtree({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

// Import Parkinsans for headings
const fontHeading = Parkinsans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: 'Prio',
  description: 'A clean Next.js template for building products.',
  // TODO: Add fav icon
  icons: {
    icon: '/favicon.ico',
  },
  // TODO: Consider adding OpenGraph and Twitter card metadata
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <KsBody fontClasses={[fontSans.variable, fontBody.variable, fontHeading.variable]}>
        <ClientProviders>
          <AuthProvider>
            <TurnstileOtelProvider>{children}</TurnstileOtelProvider>
          </AuthProvider>
        </ClientProviders>
      </KsBody>
    </html>
  )
}
