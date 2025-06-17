import { type GrpcConfig, type GrpcMetadata, createMetadataAwareMethod } from '@mono-grpc'
import { PaymentGatewayClient } from '../../../grpc/src/entities/proto/api/v1/Payment-gatewayServiceClientPb'
import {
  type CreateCheckoutSessionRequest,
  type CreateCheckoutSessionResponse,
  type GetCheckoutSessionStatusRequest,
  type GetCheckoutSessionStatusResponse,
  type CreatePortalSessionRequest,
  type CreatePortalSessionResponse,
  CreateCheckoutSessionRequest as CreateCheckoutSessionRequestClass,
  GetCheckoutSessionStatusRequest as GetCheckoutSessionStatusRequestClass,
  CreatePortalSessionRequest as CreatePortalSessionRequestClass,
} from '../../../grpc/src/entities/proto/api/v1/payment-gateway_pb'

// Client factory
export const createPaymentGatewayClient = (cp: GrpcConfig) => {
  return new PaymentGatewayClient(cp.baseUrl, cp.metadata as any)
}

// Create metadata-aware method wrappers for clean, reusable API calls
const createCheckoutSessionWithAuth = createMetadataAwareMethod<
  PaymentGatewayClient,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse
>((client, request, metadata) => client.createCheckoutSession(request, metadata as any))

const getCheckoutSessionStatusWithAuth = createMetadataAwareMethod<
  PaymentGatewayClient,
  GetCheckoutSessionStatusRequest,
  GetCheckoutSessionStatusResponse
>((client, request, metadata) => client.getCheckoutSessionStatus(request, metadata as any))

const createPortalSessionWithAuth = createMetadataAwareMethod<
  PaymentGatewayClient,
  CreatePortalSessionRequest,
  CreatePortalSessionResponse
>((client, request, metadata) => client.createPortalSession(request, metadata as any))

// Helper functions to create request objects
// SECURITY: Frontend should ONLY send product_id and quantity
// Backend handles all Stripe configuration and price lookup
export const createCheckoutSessionRequest = (params: {
  productId: string
  quantity?: number
}): CreateCheckoutSessionRequest => {
  const request = new CreateCheckoutSessionRequestClass()

  // Set internal product ID and quantity (what user wants to buy)
  request.setProductId(params.productId)
  request.setQuantity(params.quantity || 1)

  // SECURITY: Backend handles:
  // - Looking up Stripe price_id from product_id
  // - Setting mode, return_url, success_url, cancel_url
  // - Configuring all security-sensitive parameters

  return request
}

export const createGetCheckoutSessionStatusRequest = (sessionId: string): GetCheckoutSessionStatusRequest => {
  const request = new GetCheckoutSessionStatusRequestClass()
  request.setSessionId(sessionId)
  return request
}

// SECURITY: Portal sessions should also be controlled by backend
// Frontend should not control customer_id or return_url for security
export const createPortalSessionRequest = (): CreatePortalSessionRequest => {
  const request = new CreatePortalSessionRequestClass()

  // SECURITY: Backend will determine customer_id from authentication context
  // and configure return_url based on environment/configuration

  return request
}

// API call functions
export const createCheckoutSession = async (
  client: PaymentGatewayClient,
  clientParams: GrpcConfig,
  request: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> => {
  try {
    console.log('🛒 payment-gateway API: Creating checkout session for product:', request.getProductId())

    const response = await createCheckoutSessionWithAuth(client, clientParams, request)

    console.log('✅ payment-gateway API: Checkout session created successfully', {
      sessionId: response.getSessionId(),
      clientSecret: response.getClientSecret() ? '***' : 'missing',
    })
    return response
  } catch (error) {
    console.error('❌ payment-gateway API: createCheckoutSession error:', error)
    throw error
  }
}

export const getCheckoutSessionStatus = async (
  client: PaymentGatewayClient,
  clientParams: GrpcConfig,
  request: GetCheckoutSessionStatusRequest
): Promise<GetCheckoutSessionStatusResponse> => {
  try {
    console.log('🔍 payment-gateway API: Getting checkout session status for:', request.getSessionId())

    const response = await getCheckoutSessionStatusWithAuth(client, clientParams, request)

    console.log('✅ payment-gateway API: Session status retrieved:', {
      sessionId: response.getSessionId(),
      status: response.getStatus(),
    })
    return response
  } catch (error) {
    console.error('❌ payment-gateway API: getCheckoutSessionStatus error:', error)
    throw error
  }
}

export const createPortalSession = async (
  client: PaymentGatewayClient,
  clientParams: GrpcConfig,
  request: CreatePortalSessionRequest
): Promise<CreatePortalSessionResponse> => {
  try {
    console.log('🏛️ payment-gateway API: Creating portal session')

    const response = await createPortalSessionWithAuth(client, clientParams, request)

    console.log('✅ payment-gateway API: Portal session created successfully', {
      url: response.getUrl(),
    })
    return response
  } catch (error) {
    console.error('❌ payment-gateway API: createPortalSession error:', error)
    throw error
  }
}
