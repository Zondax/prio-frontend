import type { Metadata } from 'grpc-web'

import type { GrpcError } from './types'

export type { Metadata }

// TODO: review?
export const toGrpcMetadata = (metadata: Record<string, string | undefined>): Metadata => {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(metadata)) {
    if (value !== undefined) {
      result[key.toLowerCase()] = value
    }
  }
  return result
}

export const handleGrpcError = (error: any): GrpcError => {
  const code = error.code ? mapGrpcErrorCode(error.code) : 'INTERNAL'

  return {
    code,
    message: error.message || 'An unexpected error occurred',
    metadata: error.metadata,
  }
}

// FIXME: why not enums?
const mapGrpcErrorCode = (code: number): GrpcError['code'] => {
  switch (code) {
    case 3:
      return 'INVALID_ARGUMENT'
    case 5:
      return 'NOT_FOUND'
    case 7:
      return 'PERMISSION_DENIED'
    case 13:
      return 'INTERNAL'
    case 14:
      return 'UNAVAILABLE'
    default:
      return 'INTERNAL'
  }
}

export const withGrpcErrorHandling = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    throw handleGrpcError(error)
  }
}
