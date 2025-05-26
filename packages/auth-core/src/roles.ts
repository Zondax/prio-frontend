import type { Role } from './types'

export const ZITADEL_ROLES_KEY = 'urn:zitadel:iam:org:project:roles'

interface JWT_WITH_PROFILE {
  profile: Record<string, unknown>
}

export function parseZitadelRoles(token: JWT_WITH_PROFILE): Role[] {
  const roles = ZITADEL_ROLES_KEY in token.profile ? token.profile[ZITADEL_ROLES_KEY] : undefined

  // If roles is undefined or not an object, return empty array
  if (!roles || typeof roles !== 'object') {
    return []
  }

  return Object.entries(roles).flatMap(([role, organizations]) => {
    // Check if organizations is a valid object before calling Object.entries
    if (organizations && typeof organizations === 'object' && !Array.isArray(organizations)) {
      return Object.entries(organizations as Record<string, unknown>).map(([orgId, orgUrl]) => ({
        role: role as string,
        org_id: orgId as string,
        org_url: (orgUrl as string) || '',
      }))
    }
    return []
  })
}
