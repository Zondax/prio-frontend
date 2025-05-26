export const RouteConfiguration = {
  auth: {
    group: '(auth)',
    signin: '/(auth)/login',
  },
  // Define which routes require authentication
  protected: {
    group: '(protected)',
    explore: '/(protected)/(tabs)',
    profile: '/(protected)/(tabs)/profile',
    now: '/(protected)/(tabs)/now',
    agenda: '/(protected)/(tabs)/agenda',
    social: '/(protected)/(tabs)/social',
    collections: '/(protected)/(tabs)/collections',
    collectionDetail: '/(protected)/collection/[id]',
  },
  // Define which routes are accessible without authentication
  unprotected: {
    group: '',
    home: '/',
    signin: '/(auth)/login',
  },
} as const

export type RouteConfig = typeof RouteConfiguration
