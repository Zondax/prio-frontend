'use client'

import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { Alert, AlertDescription, Badge, Button } from '@zondax/ui-common'
import { Database, Loader2, Lock, Server, Shield } from 'lucide-react'
import { createGetProductContentRequest, useEndpointStore, useGetProductContentStore } from 'mono-state'
import { useCallback, useEffect } from 'react'

interface Props {
  productId: string
}

export default function BackendValidationSection({ productId }: Props) {
  const { data, isLoading, error, setInput, setParams, forceRefresh } = useGetProductContentStore()
  const { selectedEndpoint } = useEndpointStore()

  // Setup gRPC connection
  useGrpcSetup(setParams, selectedEndpoint)

  // Create callback for setting input
  const loadContent = useCallback(
    (id: string) => {
      const request = createGetProductContentRequest(id)
      setInput(request)
    },
    [setInput]
  )

  useEffect(() => {
    loadContent(productId)
  }, [productId, loadContent])

  const validateWithBackend = () => {
    const request = createGetProductContentRequest(productId)
    setInput(request)
  }

  // Get current response content
  const content = data?.getContent()
  const hasAccess = !error && !!content

  return (
    <div className="space-y-4">
      {/* Access Status */}
      <div className="flex items-center justify-between">
        <Badge variant={hasAccess ? 'default' : error ? 'destructive' : isLoading ? 'secondary' : 'outline'}>
          <Database className="h-3 w-3 mr-1" />
          {hasAccess && 'Database Verified'}
          {error && 'Access Denied'}
          {isLoading && 'Validating...'}
          {!content && !error && !isLoading && 'Not Validated'}
        </Badge>
        {hasAccess && (
          <Button onClick={forceRefresh} variant="outline" size="sm">
            <Database className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Validation Details */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Method:
          </span>
          <code className="text-xs bg-muted px-2 py-1 rounded">GetProductContent</code>
        </div>

        <div className="flex justify-between">
          <span>Security Level:</span>
          <Badge variant="secondary" className="text-xs">
            Authoritative
          </Badge>
        </div>

        <div className="flex justify-between">
          <span>Resource:</span>
          <span className="font-mono text-xs">product:{productId}</span>
        </div>

        <div className="flex justify-between">
          <span>Status:</span>
          <Badge variant={hasAccess ? 'default' : error ? 'destructive' : 'outline'} className="text-xs">
            {error ? 'Error' : content ? 'Success' : isLoading ? 'Loading' : 'Idle'}
          </Badge>
        </div>
      </div>

      {/* Action Button */}
      {!content && !isLoading && (
        <Button onClick={validateWithBackend} className="w-full">
          <Server className="h-4 w-4 mr-2" />
          Validate with Backend
        </Button>
      )}

      {isLoading && (
        <Button disabled className="w-full">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Checking Database...
        </Button>
      )}

      {/* Success State */}
      {content && !error && (
        <div className="space-y-3">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription className="text-xs">Backend validation successful! Purchase confirmed in database.</AlertDescription>
          </Alert>
          <div className="bg-gray-900 rounded-lg p-3 text-sm">
            <div className="text-green-400 mb-2 font-mono text-xs">Protected Content:</div>
            <pre className="text-gray-300 overflow-auto text-xs">{content}</pre>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription className="text-xs">
            {error || 'Backend validation failed - access denied or purchase required'}
          </AlertDescription>
        </Alert>
      )}

      {/* Usage Example */}
      <div className="bg-muted/30 p-3 rounded-lg">
        <div className="text-xs font-medium mb-2">gRPC Call:</div>
        <code className="text-xs text-muted-foreground">GetProductContent(productId: "{productId}")</code>
      </div>

      {/* Security Note */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-xs">Authoritative validation against purchase database. Cannot be bypassed.</AlertDescription>
      </Alert>
    </div>
  )
}
