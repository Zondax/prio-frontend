import { describe, expect, it, vi } from 'vitest'

import { handleSignIn, handleSignOut } from './server-actions'

describe('server-actions', () => {
  describe('handleSignOut', () => {
    it('should call signOut with redirectTo from FormData', async () => {
      // Create mock FormData
      const formData = new FormData()
      formData.append('redirectTo', '/dashboard')

      // Create mock signOut function
      const mockSignOut = vi.fn().mockResolvedValue(undefined)

      // Call the function
      await handleSignOut(formData, mockSignOut)

      // Assert that signOut was called with the right arguments
      expect(mockSignOut).toHaveBeenCalledWith({ redirectTo: '/dashboard' })
    })

    it('should use default redirectTo path when not provided in FormData', async () => {
      // Create mock FormData without redirectTo
      const formData = new FormData()

      // Create mock signOut function
      const mockSignOut = vi.fn().mockResolvedValue(undefined)

      // Call the function
      await handleSignOut(formData, mockSignOut)

      // Assert that signOut was called with default path
      expect(mockSignOut).toHaveBeenCalledWith({ redirectTo: '/' })
    })

    it('should call signOut with redirectTo from options object', async () => {
      // Create options object
      const options = { redirectTo: '/account' }

      // Create mock signOut function
      const mockSignOut = vi.fn().mockResolvedValue(undefined)

      // Call the function
      await handleSignOut(options, mockSignOut)

      // Assert that signOut was called with the right arguments
      expect(mockSignOut).toHaveBeenCalledWith({ redirectTo: '/account' })
    })

    it('should use default redirectTo path when not provided in options object', async () => {
      // Create empty options object
      const options = {}

      // Create mock signOut function
      const mockSignOut = vi.fn().mockResolvedValue(undefined)

      // Call the function
      await handleSignOut(options, mockSignOut)

      // Assert that signOut was called with default path
      expect(mockSignOut).toHaveBeenCalledWith({ redirectTo: '/' })
    })
  })

  describe('handleSignIn', () => {
    it('should call signIn with provider and redirectTo from FormData', async () => {
      // Create mock FormData
      const formData = new FormData()
      formData.append('redirectTo', '/welcome')

      // Create mock signIn function
      const mockSignIn = vi.fn().mockResolvedValue(undefined)

      // Call the function
      await handleSignIn(formData, mockSignIn, 'zitadel')

      // Assert that signIn was called with the right arguments
      expect(mockSignIn).toHaveBeenCalledWith('zitadel', { redirectTo: '/welcome' })
    })

    it('should call signIn with provider and null redirectTo when not provided in FormData', async () => {
      // Create mock FormData without redirectTo
      const formData = new FormData()

      // Create mock signIn function
      const mockSignIn = vi.fn().mockResolvedValue(undefined)

      // Call the function
      await handleSignIn(formData, mockSignIn, 'zitadel')

      // Assert that signIn was called with the right arguments
      expect(mockSignIn).toHaveBeenCalledWith('zitadel', { redirectTo: null })
    })

    it('should call signIn with provider and redirectTo from options object', async () => {
      // Create options object
      const options = { redirectTo: '/onboarding' }

      // Create mock signIn function
      const mockSignIn = vi.fn().mockResolvedValue(undefined)

      // Call the function
      await handleSignIn(options, mockSignIn, 'zitadel')

      // Assert that signIn was called with the right arguments
      expect(mockSignIn).toHaveBeenCalledWith('zitadel', { redirectTo: '/onboarding' })
    })

    it('should call signIn with default provider when not specified', async () => {
      // Create options object
      const options = { redirectTo: '/home' }

      // Create mock signIn function
      const mockSignIn = vi.fn().mockResolvedValue(undefined)

      // Call the function without specifying a provider
      await handleSignIn(options, mockSignIn)

      // Assert that signIn was called with the default provider
      expect(mockSignIn).toHaveBeenCalledWith('zitadel', { redirectTo: '/home' })
    })
  })
})
