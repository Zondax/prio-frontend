import type { GrpcConfig } from '@mono-grpc'
import { createSimpleStore } from '@zondax/stores'
import type { PaymentGatewayClient } from '../../../grpc/src/entities/proto/api/v1/Payment-gatewayServiceClientPb'
import type {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  CreatePortalSessionRequest,
  CreatePortalSessionResponse,
  GetCheckoutSessionStatusRequest,
  GetCheckoutSessionStatusResponse,
} from '../../../grpc/src/entities/proto/api/v1/payment-gateway_pb'

import { createCheckoutSession, createPaymentGatewayClient, createPortalSession, getCheckoutSessionStatus } from '../api/payment-gateway'

export const useCreateCheckoutSessionStore = createSimpleStore<
  GrpcConfig,
  PaymentGatewayClient,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse
>({
  createClient: createPaymentGatewayClient,
  method: createCheckoutSession,
})

export const useGetCheckoutSessionStatusStore = createSimpleStore<
  GrpcConfig,
  PaymentGatewayClient,
  GetCheckoutSessionStatusRequest,
  GetCheckoutSessionStatusResponse
>({
  createClient: createPaymentGatewayClient,
  method: getCheckoutSessionStatus,
})

export const useCreatePortalSessionStore = createSimpleStore<
  GrpcConfig,
  PaymentGatewayClient,
  CreatePortalSessionRequest,
  CreatePortalSessionResponse
>({
  createClient: createPaymentGatewayClient,
  method: createPortalSession,
})

export const useCreateCheckoutSessionLoading = () => useCreateCheckoutSessionStore().isLoading
export const useGetCheckoutSessionStatusLoading = () => useGetCheckoutSessionStatusStore().isLoading
export const useCreatePortalSessionLoading = () => useCreatePortalSessionStore().isLoading

export const useCreateCheckoutSessionError = () => useCreateCheckoutSessionStore().error
export const useGetCheckoutSessionStatusError = () => useGetCheckoutSessionStatusStore().error
export const useCreatePortalSessionError = () => useCreatePortalSessionStore().error
