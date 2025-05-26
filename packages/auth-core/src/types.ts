import { z } from 'zod'

/**
 * OAuth2 token schema
 * Note: refresh_token response doesn't include expires_at field, but other token responses do
 */
export const OAuth2TokenSchema = z.object({
  access_token: z.string().describe('Access token'),
  refresh_token: z.string().optional().describe('Refresh token'),
  token_type: z.string().optional().describe('Token type'),
  expires_at: z.number().optional().describe('Expiration time in seconds'),
  expires_in: z.number().optional().describe('Token lifetime in seconds'),
  issued_at: z.number().optional().describe('Issued at in seconds'),
  scope: z.string().optional().describe('Space-separated list of scopes'),
  id_token: z.string().optional(),
})

export const UserSchema = z.object({
  id: z.string().describe('User ID'),
  email: z.string().describe('User email'),
  given_name: z.string().optional().describe('User given name'),
  family_name: z.string().optional().describe('User family name'),
  preferred_username: z.string().optional().describe('User preferred username'),
})

export interface UserExtended {
  client_id: string
  iss: string
}

export const ZitadelSettingsSchema = z.object({
  issuer: z.string().describe('Issuer URL'),
  clientId: z.string().describe('Client ID'),
  clientSecret: z.string().describe('Client secret for the OAuth2 client'),
  scope: z.string().describe('Space-separated list of scopes'),
  debug: z.boolean().describe('Enable debug mode'),
  trustHost: z.boolean().optional().describe('Trust host'),
})

export type User = z.infer<typeof UserSchema>

export type ZitadelSettings = z.infer<typeof ZitadelSettingsSchema>

export type OAuth2Token = z.infer<typeof OAuth2TokenSchema>

export interface Role {
  role: string
  org_id: string
  org_url: string
}
