import type { GrpcConfig } from '@mono-grpc'
import { createGrpcSingleMethodStore } from '@zondax/stores'
import type { PaymentGatewayClient } from '../../../grpc/src/entities/proto/api/v1/Payment-gatewayServiceClientPb'
import type {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  GetCheckoutSessionStatusRequest,
  GetCheckoutSessionStatusResponse,
  CreatePortalSessionRequest,
  CreatePortalSessionResponse,
} from '../../../grpc/src/entities/proto/api/v1/payment-gateway_pb'

import {
  createCheckoutSessionRequest,
  createPortalSessionRequest,
  createGetCheckoutSessionStatusRequest,
  createCheckoutSession,
  createPortalSession,
  getCheckoutSessionStatus,
  createPaymentGatewayClient,
} from '../api/payment-gateway'

export const useCreateCheckoutSessionStore = createGrpcSingleMethodStore<
  GrpcConfig,
  PaymentGatewayClient,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse
>({
  createClient: createPaymentGatewayClient,
  method: createCheckoutSession,
})

export const useGetCheckoutSessionStatusStore = createGrpcSingleMethodStore<
  GrpcConfig,
  PaymentGatewayClient,
  GetCheckoutSessionStatusRequest,
  GetCheckoutSessionStatusResponse
>({
  createClient: createPaymentGatewayClient,
  method: getCheckoutSessionStatus,
})

export const useCreatePortalSessionStore = createGrpcSingleMethodStore<
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
