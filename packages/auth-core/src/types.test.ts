import { describe, expect, it } from 'vitest'

import { type OAuth2Token, OAuth2TokenSchema, type Role, type User, UserSchema, type ZitadelSettings, ZitadelSettingsSchema } from './types'

describe('Auth Core Types', () => {
  describe('OAuth2TokenSchema', () => {
    it('should validate a complete token', () => {
      const validToken = {
        access_token: 'valid-access-token',
        refresh_token: 'valid-refresh-token',
        token_type: 'Bearer',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        scope: 'openid profile',
        id_token: 'valid-id-token',
      }

      const result = OAuth2TokenSchema.parse(validToken)
      expect(result).toEqual(validToken)
    })

    it('should validate a minimal token with only access_token', () => {
      const minimalToken = {
        access_token: 'valid-access-token',
      }

      const result = OAuth2TokenSchema.parse(minimalToken)
      expect(result).toEqual(minimalToken)
    })

    it('should reject a token without access_token', () => {
      const invalidToken = {
        refresh_token: 'valid-refresh-token',
        token_type: 'Bearer',
      }

      expect(() => OAuth2TokenSchema.parse(invalidToken)).toThrow()
    })

    it('should reject a token with invalid types', () => {
      const invalidToken = {
        access_token: 123, // Should be string
        expires_at: 'soon', // Should be number
      }

      expect(() => OAuth2TokenSchema.parse(invalidToken)).toThrow()
    })
  })

  describe('UserSchema', () => {
    it('should validate a complete user', () => {
      const validUser = {
        id: 'user-123',
        email: 'user@example.com',
        given_name: 'John',
        family_name: 'Doe',
        preferred_username: 'johndoe',
      }

      const result = UserSchema.parse(validUser)
      expect(result).toEqual(validUser)
    })

    it('should validate a minimal user with only required fields', () => {
      const minimalUser = {
        id: 'user-123',
        email: 'user@example.com',
      }

      const result = UserSchema.parse(minimalUser)
      expect(result).toEqual(minimalUser)
    })

    it('should reject a user without required fields', () => {
      const invalidUser = {
        id: 'user-123',
        // missing email
      }

      expect(() => UserSchema.parse(invalidUser)).toThrow()
    })

    it('should reject a user with invalid types', () => {
      const invalidUser = {
        id: 123, // Should be string
        email: true, // Should be string
      }

      expect(() => UserSchema.parse(invalidUser)).toThrow()
    })
  })

  describe('ZitadelSettingsSchema', () => {
    it('should validate complete settings', () => {
      const validSettings = {
        issuer: 'https://auth.example.com',
        clientId: 'client-123',
        clientSecret: 'secret-456',
        scope: 'openid profile',
        debug: true,
      }

      const result = ZitadelSettingsSchema.parse(validSettings)
      expect(result).toEqual(validSettings)
    })

    it('should reject settings without required fields', () => {
      const invalidSettings = {
        issuer: 'https://auth.example.com',
        // missing clientId
        clientSecret: 'secret-456',
        scope: 'openid profile',
        debug: true,
      }

      expect(() => ZitadelSettingsSchema.parse(invalidSettings)).toThrow()
    })

    it('should reject settings with invalid types', () => {
      const invalidSettings = {
        issuer: 'https://auth.example.com',
        clientId: 'client-123',
        clientSecret: 'secret-456',
        scope: 123, // Should be string
        debug: 'yes', // Should be boolean
      }

      expect(() => ZitadelSettingsSchema.parse(invalidSettings)).toThrow()
    })
  })

  describe('Type Interfaces', () => {
    it('should correctly type OAuth2Token', () => {
      // Type check only - this is a compile-time test
      const token: OAuth2Token = {
        access_token: 'valid-access-token',
        refresh_token: 'valid-refresh-token',
        token_type: 'Bearer',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        scope: 'openid profile',
        id_token: 'valid-id-token',
      }

      // Verify structure at runtime
      expect(token).toHaveProperty('access_token')
      expect(typeof token.access_token).toBe('string')
    })

    it('should correctly type User', () => {
      // Type check only - this is a compile-time test
      const user: User = {
        id: 'user-123',
        email: 'user@example.com',
        given_name: 'John',
        family_name: 'Doe',
        preferred_username: 'johndoe',
      }

      // Verify structure at runtime
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('email')
    })

    it('should correctly type ZitadelSettings', () => {
      // Type check only - this is a compile-time test
      const settings: ZitadelSettings = {
        issuer: 'https://auth.example.com',
        clientId: 'client-123',
        clientSecret: 'secret-456',
        scope: 'openid profile',
        debug: true,
      }

      // Verify structure at runtime
      expect(settings).toHaveProperty('issuer')
      expect(settings).toHaveProperty('clientId')
    })

    it('should correctly type Role', () => {
      // Type check only - this is a compile-time test
      const role: Role = {
        role: 'admin',
        org_id: 'org-123',
        org_url: 'https://example.org',
      }

      // Verify structure at runtime
      expect(role).toHaveProperty('role')
      expect(role).toHaveProperty('org_id')
      expect(role).toHaveProperty('org_url')
    })
  })
})
