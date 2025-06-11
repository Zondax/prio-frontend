'use server'

/**
 * This module provides server actions for authentication
 */

/**
 * Type for signOut function
 */
type SignOutFunction = (options?: { redirectTo?: string }) => Promise<void>

/**
 * Type for signIn function
 */
type SignInFunction = (provider: string, options?: { redirectTo?: string }) => Promise<void>

/**
 * Handle user sign out
 * @param params - FormData or object with optional redirectTo
 * @param signOut - The sign out function from NextAuth
 */
export async function handleSignOut(params: FormData | { redirectTo?: string }, signOut: SignOutFunction) {
  'use server'
  let redirectTo: string | undefined

  if (params instanceof FormData) {
    redirectTo = (params.get('redirectTo') as string) || '/'
  } else {
    redirectTo = params.redirectTo || '/'
  }

  await signOut({ redirectTo })
}

/**
 * Handle user sign in
 * @param params - FormData or object with optional redirectTo
 * @param signIn - The sign in function from NextAuth
 * @param provider - The authentication provider
 */
export async function handleSignIn(params: FormData | { redirectTo?: string }, signIn: SignInFunction, provider = 'zitadel') {
  'use server'
  let redirectTo: string | undefined

  if (params instanceof FormData) {
    redirectTo = params.get('redirectTo') as string
  } else {
    redirectTo = params.redirectTo
  }

  await signIn(provider, { redirectTo })
}
