import { createContext, useContext } from 'react'

import { AuthContextError } from '../../../auth-core/src/errors'
import type { AuthContextType } from '../types'

export const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new AuthContextError()
  }
  return context
}
