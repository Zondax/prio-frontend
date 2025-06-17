'use client'

import { OtelProvider as BaseOtelProvider, type OtelConfig } from '@zondax/otel-web'

// Kickstarter web app specific configuration using environment variables
const KICKSTARTER_CONFIG: OtelConfig = {
  serviceName: process.env.NEXT_PUBLIC_SERVICE_NAME || 'kickstarter-web-client',
  serviceVersion: process.env.NEXT_PUBLIC_SERVICE_VERSION || '1.0.0',
  signozEndpoint: process.env.NEXT_PUBLIC_SIGNOZ_ENDPOINT,
  signozApiKey: process.env.NEXT_PUBLIC_SIGNOZ_API_KEY,
  allowedTraceDomains: process.env.NEXT_PUBLIC_TRACE_DOMAINS?.split(',') || [
    'localhost',
    '127.0.0.1',
    '.vercel.app',
    '.zondax.ch',
    '.zondax.com',
  ],
  enableConsoleLogging: process.env.NEXT_PUBLIC_OTEL_CONSOLE_LOGGING === 'true' || process.env.NODE_ENV === 'development',
}

interface OtelProviderProps {
  children: React.ReactNode
}

/**
 * Kickstarter Web App OpenTelemetry Provider
 *
 * Wraps the base OtelProvider with kickstarter-specific configuration.
 * This allows for easy customization while using the shared otel-web package.
 *
 * Configuration is loaded from environment variables:
 * - NEXT_PUBLIC_SERVICE_NAME: Service name for tracing
 * - NEXT_PUBLIC_SERVICE_VERSION: Service version for tracing
 * - NEXT_PUBLIC_SIGNOZ_ENDPOINT: SigNoz endpoint URL
 * - NEXT_PUBLIC_SIGNOZ_API_KEY: SigNoz API key
 * - NEXT_PUBLIC_TRACE_DOMAINS: Comma-separated list of allowed domains
 * - NEXT_PUBLIC_OTEL_CONSOLE_LOGGING: Enable console logging (true/false)
 */
export default function OtelProvider({ children }: OtelProviderProps) {
  return <BaseOtelProvider config={KICKSTARTER_CONFIG}>{children}</BaseOtelProvider>
}
