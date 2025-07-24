'use client'

import { useGrpcSetup } from '@zondax/auth-web/hooks'
import type { GridRenderItem } from '@zondax/ui-web'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  VirtualizedGrid,
} from '@zondax/ui-web/client'
import { CreditCard, Crown, Loader2, Package, RefreshCw, ShoppingCart } from 'lucide-react'
import {
  createCheckoutSessionRequest,
  createGetPlansRequest,
  createGetProductsRequest,
  type Product,
  useCreateCheckoutSessionStore,
  useEndpointStore,
  useGetPlansStore,
  useGetProductsStore,
} from 'mono-state'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { ManageBillingButton } from '@/components/manage-billing-button'

// Configuration
const LOAD_LIMITS = {
  PRODUCTS: 50,
  PLANS: 50,
} as const

// Utility functions
const getProductTypeLabel = (type: number): string => {
  switch (type) {
    case 1:
      return 'One-time'
    case 2:
      return 'API Calls'
    case 3:
      return 'Subscription'
    default:
      return 'Unknown'
  }
}

// Product Card Component
function ProductCard({
  product,
  onBuy,
  isCheckoutLoading,
  checkoutReady,
}: {
  product: Product
  onBuy: (productId: string) => void
  isCheckoutLoading: boolean
  checkoutReady: boolean
}) {
  const metadata = product.getMetadata()
  const isActive = product.getActive()

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/20 ${!isActive ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">{product.getName()}</CardTitle>
          <Package className="h-6 w-6 text-primary" />
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-2">
          {product.getDescription() || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {getProductTypeLabel(product.getProductType())}
            </Badge>
            <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs">
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {product.getRequestsIncluded() > 0 && (
            <div className="text-right">
              <div className="text-sm font-semibold text-primary">{product.getRequestsIncluded()} requests</div>
            </div>
          )}
        </div>

        {metadata && (
          <div className="space-y-2">
            {metadata.getTier() && (
              <Badge variant="outline" className="text-xs">
                {metadata.getTier()}
              </Badge>
            )}
            {metadata.getPopular() && (
              <Badge variant="secondary" className="text-xs">
                Popular
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <Button
            onClick={() => onBuy(product.getId())}
            disabled={!isActive || !checkoutReady || isCheckoutLoading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isCheckoutLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
            Buy Now
          </Button>
          <Button asChild variant="outline" className="w-full" disabled={!isActive}>
            <Link
              href={`/dev/stripe/content/${product.getId()}?type=${product.getProductType() === 3 ? 'subscription' : 'product'}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Test Access
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Plan Card Component
function PlanCard({
  plan,
  onBuy,
  isCheckoutLoading,
  checkoutReady,
}: {
  plan: Product
  onBuy: (planId: string) => void
  isCheckoutLoading: boolean
  checkoutReady: boolean
}) {
  const metadata = plan.getMetadata()
  const isActive = plan.getActive()

  return (
    <Card
      className={`hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/20 relative ${!isActive ? 'opacity-60' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">{plan.getName()}</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-2">
          {plan.getDescription() || 'No description available'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {getProductTypeLabel(plan.getProductType())}
            </Badge>
            <Badge variant={isActive ? 'default' : 'secondary'} className="text-xs">
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {plan.getRequestsIncluded() > 0 && (
            <div className="text-right">
              <div className="text-sm font-semibold text-primary">{plan.getRequestsIncluded()} requests</div>
            </div>
          )}
        </div>

        {metadata && (
          <div className="space-y-2">
            {metadata.getTier() && (
              <Badge variant="outline" className="text-xs">
                {metadata.getTier()}
              </Badge>
            )}
            {metadata.getPopular() && (
              <Badge variant="secondary" className="text-xs">
                Popular
              </Badge>
            )}
            {metadata.getFeaturesList().length > 0 && (
              <div className="flex flex-wrap gap-1">
                {metadata.getFeaturesList().map((feature) => (
                  <Badge key={`feature-${feature}`} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <Button
            onClick={() => onBuy(plan.getId())}
            disabled={!isActive || !checkoutReady || isCheckoutLoading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isCheckoutLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
            Subscribe
          </Button>
          <Button asChild variant="outline" className="w-full" disabled={!isActive}>
            <Link href={`/dev/stripe/content/${plan.getId()}?type=subscription`} target="_blank" rel="noopener noreferrer">
              <CreditCard className="h-4 w-4 mr-2" />
              Test Access
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton component for loading states
function ProductSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Custom hooks for data handling
function useProductsData() {
  const productsStore = useGetProductsStore()
  const { setInput } = productsStore

  const load = React.useCallback(() => {
    const request = createGetProductsRequest({
      limit: LOAD_LIMITS.PRODUCTS,
      activeOnly: true,
    })

    setInput(request)
  }, [setInput])

  return {
    ...productsStore,
    load,
  }
}

function usePlansData() {
  const plans = useGetPlansStore()
  const { setInput } = plans

  const load = React.useCallback(() => {
    const request = createGetPlansRequest({
      limit: LOAD_LIMITS.PLANS,
      activeOnly: true,
    })

    setInput(request)
  }, [setInput])

  return {
    ...plans,
    load,
  }
}

// Transform functions to convert data to GridRenderItem
function transformProductsToGridItems(
  products: Product[],
  onBuy: (id: string) => void,
  isCheckoutLoading: boolean,
  checkoutReady: boolean
): GridRenderItem[] {
  return products.map((product) => ({
    gridRender: () => (
      <ProductCard
        key={product.getId()}
        product={product}
        onBuy={onBuy}
        isCheckoutLoading={isCheckoutLoading}
        checkoutReady={checkoutReady}
      />
    ),
  }))
}

function transformPlansToGridItems(
  plans: Product[],
  onBuy: (id: string) => void,
  isCheckoutLoading: boolean,
  checkoutReady: boolean
): GridRenderItem[] {
  return plans.map((plan) => ({
    gridRender: () => (
      <PlanCard key={plan.getId()} plan={plan} onBuy={onBuy} isCheckoutLoading={isCheckoutLoading} checkoutReady={checkoutReady} />
    ),
  }))
}

export default function StripePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState('products')

  // Store hooks
  const productsStore = useProductsData()
  const plansStore = usePlansData()
  const checkoutStore = useCreateCheckoutSessionStore()

  // Setup
  const { selectedEndpoint } = useEndpointStore()

  // Configure all stores with the same endpoint
  useGrpcSetup(productsStore.setParams, selectedEndpoint)
  useGrpcSetup(plansStore.setParams, selectedEndpoint)
  useGrpcSetup(checkoutStore.setParams, selectedEndpoint)

  React.useEffect(() => {
    // Only load once on initial mount
    productsStore.load()
    plansStore.load()
  }, [productsStore.load, plansStore.load])

  // Handlers - simple functions without complex dependencies
  // Handlers - simple functions without complex dependencies
  const handleBuyProduct = React.useCallback(
    (productId: string) => {
      const request = createCheckoutSessionRequest({
        productId: productId,
      })
      checkoutStore.setInput(request)
    },
    [checkoutStore]
  )

  // Redirect to checkout when URL is available
  React.useEffect(() => {
    if (checkoutStore.data?.getUrl()) {
      router.push(checkoutStore.data.getUrl())
    }
  }, [checkoutStore.data, router])

  // Transform data for VirtualizedGrid
  const productsList = productsStore.data?.getProductsList() || []
  const plansList = plansStore.data?.getPlansList() || []

  const productGridItems = transformProductsToGridItems(
    productsList,
    handleBuyProduct,
    checkoutStore.isAnyLoading(),
    checkoutStore.data !== null
  )

  const planGridItems = transformPlansToGridItems(plansList, handleBuyProduct, checkoutStore.isAnyLoading(), checkoutStore.data !== null)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">🚀 Prio Stripe Integration</h1>
          <p className="text-xl text-muted-foreground mb-6">Browse our products and subscription plans</p>

          {/* Manage Billing Button */}
          <div className="flex justify-center">
            <ManageBillingButton
              variant="outline"
              size="lg"
              className="font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Products ({productsList.length})</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center space-x-2">
              <Crown className="h-4 w-4" />
              <span>Plans ({plansList.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-6">
            <VirtualizedGrid
              items={productGridItems}
              isLoading={productsStore.isAnyLoading()}
              hasEverLoaded={!!productsStore.data}
              renderSkeleton={() => <ProductSkeleton />}
              emptyComponent={
                <EmptyState
                  icon={Package}
                  title="No products available"
                  subtitle="There are no products to display at the moment."
                  button={{
                    onClick: productsStore.forceRefresh,
                    label: 'Refresh',
                    icon: RefreshCw,
                  }}
                />
              }
              layoutConfig={{
                itemMinWidth: 350,
                rowHeight: 320,
                spacing: 24,
              }}
            />
          </TabsContent>

          {/* Plans Tab */}
          <TabsContent value="plans" className="mt-6">
            <VirtualizedGrid
              items={planGridItems}
              isLoading={plansStore.isAnyLoading()}
              hasEverLoaded={!!plansStore.data}
              renderSkeleton={() => <ProductSkeleton />}
              emptyComponent={
                <EmptyState
                  icon={Crown}
                  title="No plans available"
                  subtitle="There are no subscription plans to display at the moment."
                  button={{
                    onClick: plansStore.forceRefresh,
                    label: 'Refresh',
                    icon: RefreshCw,
                  }}
                />
              }
              layoutConfig={{
                itemMinWidth: 350,
                rowHeight: 320,
                spacing: 24,
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
