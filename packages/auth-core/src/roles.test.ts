import { describe, expect, it } from 'vitest'

import { ZITADEL_ROLES_KEY, parseZitadelRoles } from './roles'
import type { Role } from './types'

describe('parseZitadelRoles', () => {
  it('should parse valid roles and organizations from JWT profile', () => {
    const mockToken = {
      profile: {
        [ZITADEL_ROLES_KEY]: {
          admin: {
            org123: 'https://org123.example.com',
            org456: 'https://org456.example.com',
          },
          user: {
            org789: 'https://org789.example.com',
          },
        },
      },
    }

    const expected: Role[] = [
      { role: 'admin', org_id: 'org123', org_url: 'https://org123.example.com' },
      { role: 'admin', org_id: 'org456', org_url: 'https://org456.example.com' },
      { role: 'user', org_id: 'org789', org_url: 'https://org789.example.com' },
    ]

    const result = parseZitadelRoles(mockToken)
    expect(result).toEqual(expected)
  })

  it('should handle empty organizations object', () => {
    const mockToken = {
      profile: {
        [ZITADEL_ROLES_KEY]: {
          admin: {},
        },
      },
    }

    const result = parseZitadelRoles(mockToken)
    expect(result).toEqual([])
  })

  it('should handle non-object organization values', () => {
    const mockToken = {
      profile: {
        [ZITADEL_ROLES_KEY]: {
          admin: null,
          user: 'not-an-object',
          viewer: ['array', 'not', 'object'],
          valid: {
            org123: 'https://org123.example.com',
          },
        },
      },
    }

    const expected: Role[] = [{ role: 'valid', org_id: 'org123', org_url: 'https://org123.example.com' }]

    const result = parseZitadelRoles(mockToken)
    expect(result).toEqual(expected)
  })

  it('should handle missing organization URL by using empty string', () => {
    const mockToken = {
      profile: {
        [ZITADEL_ROLES_KEY]: {
          admin: {
            org123: null,
            org456: undefined,
            org789: '',
          },
        },
      },
    }

    const expected: Role[] = [
      { role: 'admin', org_id: 'org123', org_url: '' },
      { role: 'admin', org_id: 'org456', org_url: '' },
      { role: 'admin', org_id: 'org789', org_url: '' },
    ]

    const result = parseZitadelRoles(mockToken)
    expect(result).toEqual(expected)
  })

  it('should handle profile without the ZITADEL_ROLES_KEY', () => {
    const mockToken = {
      profile: {
        other_key: 'some value',
      },
    }

    const result = parseZitadelRoles(mockToken)
    expect(result).toEqual([])
  })
})
