import { BaseError } from '@zondax/auth-expo'
import { createContext, useContext } from 'react'

// Config state definition
// FIXME: this should be extendable
export interface ConfigState<T = any> {
  config: T | null
  isLoading: boolean
  error: string | null
  isReady: boolean
}

export class SecureConfigContextError extends BaseError {
  code = 'SECURE_CONFIG_CONTEXT_ERROR'

  constructor(message = 'useSecureConfig must be used within an SecureConfigProvider') {
    super(message)
    this.name = 'SecureConfigContextError'
  }
}

// Create context with generic type
export const SecureConfigContext = createContext<ConfigState<any>>({
  config: null,
  isLoading: true,
  error: null,
  isReady: false,
})

// Hook with optional generic type parameter
export function useSecureConfig<T = any>(): ConfigState<T> {
  const context = useContext(SecureConfigContext)
  if (!context) {
    throw new SecureConfigContextError()
  }
  return context as ConfigState<T>
}
