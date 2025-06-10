import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SessionProvider } from '@zondax/auth-web'
import type { Metadata } from 'next'
import { Figtree, Inter as FontSans, Parkinsans } from 'next/font/google'

import { ThemeProvider } from '@/components/theming/theme-provider'
import { cn } from '@/lib/utils'

import './globals.css'
import DebugLayout from '@/components/debug/debug-layout'
import { FloatingSettingsProvider } from '@/components/debug/floating-settings-context'
import { StickyTopProvider } from '@/components/sticky/sticky-top-provider'

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
  title: 'Kickstarter',
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
      <body className={cn('bg-background font-body antialiased', fontSans.variable, fontBody.variable, fontHeading.variable)}>
        <div className="flex flex-col min-h-screen w-full mx-auto">
          <DebugLayout index={0} className="flex-1">
            <FloatingSettingsProvider>
              <SessionProvider>
                <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
                  <StickyTopProvider>{children}</StickyTopProvider>
                </ThemeProvider>
              </SessionProvider>
              <Analytics />
              <SpeedInsights />
            </FloatingSettingsProvider>
          </DebugLayout>
        </div>
      </body>
    </html>
  )
}
