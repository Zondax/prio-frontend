import type { GrpcError } from './types'

type ErrorHandler = (error: GrpcError) => void

let globalErrorHandler: ErrorHandler | undefined

export const setGrpcErrorHandler = (handler: ErrorHandler) => {
  globalErrorHandler = handler
}

// TODO: check if we need this of the stores will handle it
export const withErrorHandling = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation()
  } catch (error: any) {
    // TODO: Sentry
    console.error(`[withErrorHandling] error: ${error}`)

    const grpcError: GrpcError = {
      code: error.code || 'INTERNAL',
      message: error.message || 'An unexpected error occurred',
      metadata: error.metadata,
    }

    // TODO: call back to set error?

    if (globalErrorHandler) {
      globalErrorHandler(grpcError)
    }

    throw grpcError
  }
}
