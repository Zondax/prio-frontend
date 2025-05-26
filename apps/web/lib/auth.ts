'use server'

import { handleSignIn, handleSignOut } from '@zondax/auth-web'

import { signIn, signOut } from '@/app/auth'

export async function signInAction(params: FormData | { redirectTo?: string }) {
  'use server'
  return handleSignIn(params, signIn)
}

export async function signOutAction(params: FormData | { redirectTo?: string }) {
  'use server'
  return handleSignOut(params, signOut)
}
