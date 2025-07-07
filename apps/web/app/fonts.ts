/**
 * Font Configurations
 *
 * Centralized font definitions following the kedge-frontend pattern.
 * Parkinsans uses manual patch (adjustFontFallback: false) for Next.js compatibility.
 */

import { Figtree, Inter as FontSans, Parkinsans } from 'next/font/google'

// Configure Inter for UI components (aligns with --font-sans token)
const fontUi = FontSans({
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

// Configure Parkinsans for headings with Next.js patch
// PATCH: adjustFontFallback: false fixes "Failed to find font override values"
// See: @zondax/ui-common/server PARKINSANS_PATCH_INFO for details
const fontHeading = Parkinsans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: false, // PATCH: Next.js override issue
})

// Export individual fonts for specific use cases
export { fontUi, fontBody, fontHeading }

// Legacy export for backward compatibility
export { fontUi as fontSans }

// Export combined font variables for easy spreading in className (immutable)
export const fontsVariable = Object.freeze([fontUi.variable, fontBody.variable, fontHeading.variable] as const)
