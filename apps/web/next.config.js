/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV === 'development'

const developmentHeaders = [
  {
    source: '/(.*)',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-hashes' https://challenges.cloudflare.com https://va.vercel-scripts.com https://js.stripe.com https://*.clerk.accounts.dev",
          "worker-src 'self' blob:",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.clerk.accounts.dev",
          "img-src 'self' data: blob: https: *",
          "frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com https://*.stripe.com",
          "connect-src 'self' https://challenges.cloudflare.com https://prio-api.zondax.io https://va.vercel-scripts.com http://localhost:9080 https://*.locationiq.com http://localhost:3001/api/agents/test/ https://api.stripe.com https://*.clerk.accounts.dev https://clerk-telemetry.com https://ingest.eu.signoz.cloud https://api-dev-299696020626.us-central1.run.app",
          "font-src 'self' https://fonts.gstatic.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      },
    ],
  },
]
const productionHeaders = [
  {
    source: '/(.*)',
    headers: [
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-hashes' https://challenges.cloudflare.com https://*.zondax.ch https://*.zondax.io https://*.zondax.dev https://*.zondax.net https://va.vercel-scripts.com https://vercel.live https://*.vercel.app https://js.stripe.com https://*.clerk.accounts.dev https://clerk.prio.chat",
          "worker-src 'self' blob:",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.clerk.accounts.dev",
          "img-src 'self' data: blob: https: *",
          "frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com https://*.stripe.com",
          "connect-src 'self' https://challenges.cloudflare.com https://*.zondax.ch https://*.zondax.io https://*.zondax.dev https://*.zondax.net https://va.vercel-scripts.com https://vercel.live https://*.vercel.app https://*.locationiq.com https://api.stripe.com https://*.clerk.accounts.dev https://clerk-telemetry.com https://ingest.eu.signoz.cloud https://api-dev-299696020626.us-central1.run.app https://api-main-917008589709.us-central1.run.app",
          "font-src 'self' https://fonts.gstatic.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
        ].join('; '),
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ],
  },
]

const _fallbackHeaders = [
  {
    source: '/(.*)',
    headers: [{ key: 'X-Frame-Options', value: 'DENY' }],
  },
]

const _noHeaders = []

const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  devIndicators: false,
  async headers() {
    if (isDevelopment) {
      return developmentHeaders
    }
    return productionHeaders
  },
  async redirects() {
    return []
  },
}

module.exports = nextConfig
