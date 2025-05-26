export interface GrpcMetadata {
  authorization?: string
  [key: string]: string | undefined
}

export interface GrpcConfig {
  baseUrl: string
  metadata: GrpcMetadata
}

export type GrpcErrorCode = 'INVALID_ARGUMENT' | 'NOT_FOUND' | 'PERMISSION_DENIED' | 'INTERNAL' | 'UNAVAILABLE'

export interface GrpcError {
  code: GrpcErrorCode
  message: string
  metadata?: Record<string, string>
}
