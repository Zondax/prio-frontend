/**
 * Type definitions for application configuration
 */

/**
 * Authentication configuration
 */
export interface AuthConfig {
  clientId: string
  issuer: string
  scope?: string
  scopesList?: string[]
}

/**
 * LocationIQ configuration
 */
export interface LocationIqConfig {
  apiKey: string
}

/**
 * Sentry configuration
 */
export interface SentryConfig {
  dsn: string
  enabled: boolean
  tracesSampleRate: number
  profilesSampleRate: number
  replaysSessionSampleRate: number
  replaysOnErrorSampleRate: number
  enableUserInteractionTracing: boolean
  enableTimeToInitialDisplay: boolean
  enableNativeFramesTracking: boolean
  autoSessionTracking: boolean
  sessionTrackingIntervalMillis: number
}

/**
 * Complete application configuration
 * TODO: In the future we may need to map a key-value structure
 */
export interface AppConfig {
  auth: AuthConfig
  locationIq?: LocationIqConfig
  sentry?: SentryConfig
  [key: string]: any
}
