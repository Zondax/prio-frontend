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
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-hashes' https://challenges.cloudflare.com https://va.vercel-scripts.com https://*.clerk.accounts.dev",
          "worker-src 'self' blob:",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.clerk.accounts.dev",
          "img-src 'self' data: blob: https: *",
          "frame-src 'self' https://challenges.cloudflare.com",
          "connect-src 'self' https://challenges.cloudflare.com https://prio-api.zondax.io https://va.vercel-scripts.com http://localhost:9080 https://*.locationiq.com http://localhost:3001/api/agents/test/ https://*.clerk.accounts.dev",
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
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'unsafe-hashes' https://challenges.cloudflare.com https://*.zondax.ch https://*.zondax.io https://*.zondax.dev https://*.zondax.net https://va.vercel-scripts.com",
          "worker-src 'self' blob:",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: blob: https: *",
          "frame-src 'self' https://challenges.cloudflare.com",
          "connect-src 'self' https://challenges.cloudflare.com https://*.zondax.ch https://*.zondax.io https://*.zondax.dev https://*.zondax.net https://va.vercel-scripts.com https://*.locationiq.com",
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

const fallbackHeaders = [
  {
    source: '/(.*)',
    headers: [{ key: 'X-Frame-Options', value: 'DENY' }],
  },
]

const noHeaders = []

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
    return [
      {
        source: '/what-is',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
