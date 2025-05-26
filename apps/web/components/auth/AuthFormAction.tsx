import type { ReactNode } from 'react'

import { signInAction, signOutAction } from '@/lib/auth'

import { FormAction } from './FormAction'

interface AuthActionProps {
  children: ReactNode
  redirectTo?: string
}

export function SignInFormAction({ children, redirectTo = '/dev' }: AuthActionProps) {
  return (
    <FormAction action={signInAction} redirectData={{ redirectTo }}>
      {children}
    </FormAction>
  )
}

export function SignOutFormAction({ children, redirectTo = '/dev' }: AuthActionProps) {
  return (
    <FormAction action={signOutAction} redirectData={{ redirectTo }}>
      {children}
    </FormAction>
  )
}
