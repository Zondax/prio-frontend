'use client'

import { useUser } from '@zondax/auth-web'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@zondax/ui-common'
import { ArrowLeft, Clock, Code, Database, Shield, User } from 'lucide-react'
import {
  createGetProductByIDRequest,
  createGetProductContentRequest,
  useEndpointStore,
  useGetProductByIDStore,
  useGetProductContentStore,
} from 'mono-state'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import * as React from 'react'
import BackendValidationSection from './_components/BackendValidationSection'
import FrontendClaimsSection from './_components/FrontendClaimsSection'
import ProtectedContentExample from './_components/ProtectedContentExample'

function ProductContentPageContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { user, isLoaded } = useUser()

  const productId = params.productId as string
  const type = (searchParams.get('type') || 'product') as 'product' | 'subscription'

  // Store hooks
  const productInfoStore = useGetProductByIDStore()
  const productContentStore = useGetProductContentStore()
  const { selectedEndpoint } = useEndpointStore()

  // Setup gRPC
  useGrpcSetup(productInfoStore.setParams, selectedEndpoint)
  useGrpcSetup(productContentStore.setParams, selectedEndpoint)

  // Extract setInput functions
  const { setInput: setProductInfoInput } = productInfoStore
  const { setInput: setProductContentInput } = productContentStore

  // Create callbacks for setting inputs
  const loadProductInfo = React.useCallback(
    (id: string) => {
      const productRequest = createGetProductByIDRequest(id)
      setProductInfoInput(productRequest)
    },
    [setProductInfoInput]
  )

  const loadProductContent = React.useCallback(
    (id: string) => {
      const contentRequest = createGetProductContentRequest(id)
      setProductContentInput(contentRequest)
    },
    [setProductContentInput]
  )

  // Load product information and validate access
  React.useEffect(() => {
    if (productId) {
      loadProductInfo(productId)
      loadProductContent(productId)
    }
  }, [productId, loadProductInfo, loadProductContent])

  const product = productInfoStore.data?.getProduct()
  const productName = product?.getName() || 'Unknown Product'

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>

          {/* Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Button variant="outline" size="sm" asChild className="w-fit">
            <Link href="/dev/stripe">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Authorization Demo</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-muted-foreground">Testing access for:</span>
                <Badge variant="outline" className="font-mono">
                  {productName}
                </Badge>
                <Badge variant="secondary" className="font-mono text-xs">
                  ID: {productId}
                </Badge>
                <Badge variant={type === 'subscription' ? 'default' : 'secondary'} className="text-xs">
                  {type === 'subscription' ? 'Subscription' : 'Product'}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Explore three different approaches to validate user access and understand when to use each one.
              </p>
            </div>
          </div>
        </div>

        {/* Authorization Methods Tabs */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authorization Methods
            </CardTitle>
            <CardDescription>Compare different approaches to validate user access</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="client-side" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="client-side" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Hook-Based
                </TabsTrigger>
                <TabsTrigger value="server-side" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  API-Based
                </TabsTrigger>
                <TabsTrigger value="component" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Component-Based
                </TabsTrigger>
              </TabsList>

              {/* Client-Side Tab */}
              <TabsContent value="client-side" className="space-y-4 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Hook-Based Validation</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Using useAppAuthorization hook to check {type === 'subscription' ? 'subscription status' : 'product permissions'}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    <Clock className="h-3 w-3 mr-1" />
                    Instant
                  </Badge>
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How it works:</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>
                      • Uses <code>{type === 'subscription' ? 'isSubscriptionActive()' : 'hasPermission()'}</code> method
                    </li>
                    <li>• Reads JWT {type === 'subscription' ? 'subscription' : 'permission'} claims stored in browser</li>
                    <li>• Provides instant feedback for UI optimization</li>
                    <li>
                      • <strong>Client-side only</strong> - can be bypassed by users
                    </li>
                  </ul>
                </div>

                <FrontendClaimsSection productId={productId} type={type} />
              </TabsContent>

              {/* Server-Side Tab */}
              <TabsContent value="server-side" className="space-y-4 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">API-Based Validation</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">Making gRPC calls to validate against database</p>
                  </div>
                  <Badge variant="default" className="ml-auto">
                    <Shield className="h-3 w-3 mr-1" />
                    Secure
                  </Badge>
                </div>

                <div className="bg-green-50/50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800 mb-4">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">How it works:</h4>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• Makes secure gRPC calls to backend services</li>
                    <li>• Validates JWT tokens and checks database records</li>
                    <li>• Cannot be bypassed or tampered with by users</li>
                    <li>
                      • <strong>Most secure</strong> approach for sensitive operations
                    </li>
                  </ul>
                </div>

                <BackendValidationSection productId={productId} />
              </TabsContent>

              {/* Component-Based Tab */}
              <TabsContent value="component" className="space-y-4 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Component-Based Protection</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Using ProtectedComponent with custom validation logic</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    <Code className="h-3 w-3 mr-1" />
                    Flexible
                  </Badge>
                </div>

                <div className="bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-4">
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">How it works:</h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                    <li>• Uses ProtectedComponent with subscription or permission props</li>
                    <li>• Combines authorization checks with fallback UI</li>
                    <li>• Declarative approach - authorization rules in JSX</li>
                    <li>
                      • <strong>Best UX</strong> - seamless integration with UI components
                    </li>
                  </ul>
                </div>

                <ProtectedContentExample productId={productId} type={type} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* User Information Display */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Current User Information
              </CardTitle>
              <CardDescription>JWT claims and authentication details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">User ID</h4>
                    <p className="font-mono text-sm bg-muted p-2 rounded">{user.id}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Email</h4>
                    <p className="font-mono text-sm bg-muted p-2 rounded">{user.primaryEmailAddress?.emailAddress || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Public Metadata (Claims)</h4>
                  <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64">{JSON.stringify(user.publicMetadata, null, 2)}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Implementation Notes */}
        <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
              <Shield className="h-5 w-5" />
              Implementation Notes
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Understanding when to use each authorization method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium text-orange-900 dark:text-orange-100">Hook-Based</h4>
                <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                  <li>• Fast UI updates</li>
                  <li>• Loading states</li>
                  <li>• Feature toggles</li>
                  <li>• Navigation guards</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-orange-900 dark:text-orange-100">API-Based</h4>
                <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                  <li>• Sensitive operations</li>
                  <li>• Backend validation</li>
                  <li>• Real-time checks</li>
                  <li>• Audit trails</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-orange-900 dark:text-orange-100">Component-Based</h4>
                <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                  <li>• UI protection</li>
                  <li>• Fallback content</li>
                  <li>• Conditional rendering</li>
                  <li>• User experience</li>
                </ul>
              </div>
            </div>
            <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <p className="text-sm text-orange-900 dark:text-orange-100">
                <strong>Best Practice:</strong> Combine multiple approaches for comprehensive security. Use hook-based for UX, API-based for
                security, and component-based for declarative UI protection.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ProductContentPageFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        {/* Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ProductContentPage() {
  return (
    <React.Suspense fallback={<ProductContentPageFallback />}>
      <ProductContentPageContent />
    </React.Suspense>
  )
}
