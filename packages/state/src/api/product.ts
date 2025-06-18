import { createMetadataAwareMethod, type GrpcConfig } from '@mono-grpc'
import { ProductServiceClient } from '../../../grpc/src/entities/proto/api/v1/ProductServiceClientPb'
import type {
  GetPlansRequest,
  GetPlansResponse,
  GetProductByIDRequest,
  GetProductByIDResponse,
  GetProductContentRequest,
  GetProductContentResponse,
  GetProductsRequest,
  GetProductsResponse,
} from '../../../grpc/src/entities/proto/api/v1/product_pb'

// Client factory
export const createProductServiceClient = (cp: GrpcConfig) => {
  return new ProductServiceClient(cp.baseUrl, cp.metadata as any)
}

// Create metadata-aware method wrappers for clean, reusable API calls
const getProductsWithAuth = createMetadataAwareMethod<ProductServiceClient, GetProductsRequest, GetProductsResponse>(
  (client, request, metadata) => client.getProducts(request, metadata as any)
)

const getPlansWithAuth = createMetadataAwareMethod<ProductServiceClient, GetPlansRequest, GetPlansResponse>((client, request, metadata) =>
  client.getPlans(request, metadata as any)
)

const getProductByIDWithAuth = createMetadataAwareMethod<ProductServiceClient, GetProductByIDRequest, GetProductByIDResponse>(
  (client, request, metadata) => client.getProductByID(request, metadata as any)
)

const getProductContentWithAuth = createMetadataAwareMethod<ProductServiceClient, GetProductContentRequest, GetProductContentResponse>(
  (client, request, metadata) => client.getProductContent(request, metadata as any)
)

// Helper functions to create request objects
export const createGetProductsRequest = (params?: { limit?: number; activeOnly?: boolean }): GetProductsRequest => {
  const { GetProductsRequest } = require('../../../grpc/src/entities/proto/api/v1/product_pb')

  const request = new GetProductsRequest()
  if (params?.limit) request.setLimit(params.limit)
  if (params?.activeOnly !== undefined) request.setActiveOnly(params.activeOnly)

  return request
}

export const createGetPlansRequest = (params?: { limit?: number; activeOnly?: boolean }): GetPlansRequest => {
  const { GetPlansRequest } = require('../../../grpc/src/entities/proto/api/v1/product_pb')

  const request = new GetPlansRequest()
  if (params?.limit) request.setLimit(params.limit)
  if (params?.activeOnly !== undefined) request.setActiveOnly(params.activeOnly)

  return request
}

export const createGetProductByIDRequest = (productId: string): GetProductByIDRequest => {
  const { GetProductByIDRequest } = require('../../../grpc/src/entities/proto/api/v1/product_pb')

  const request = new GetProductByIDRequest()
  request.setProductId(productId)
  return request
}

export const createGetProductContentRequest = (productId: string): GetProductContentRequest => {
  const { GetProductContentRequest } = require('../../../grpc/src/entities/proto/api/v1/product_pb')

  const request = new GetProductContentRequest()
  request.setProductId(productId)
  return request
}

// API Methods
export const getProducts = async (
  client: ProductServiceClient,
  clientParams: GrpcConfig,
  input: GetProductsRequest
): Promise<GetProductsResponse> => {
  try {
    const response = await getProductsWithAuth(client, clientParams, input)
    return response
  } catch (error) {
    console.error('❌ product API: getProducts error:', error)
    throw error
  }
}

export const getPlans = async (
  client: ProductServiceClient,
  clientParams: GrpcConfig,
  input: GetPlansRequest
): Promise<GetPlansResponse> => {
  try {
    const response = await getPlansWithAuth(client, clientParams, input)
    return response
  } catch (error) {
    console.error('❌ product API: getPlans error:', error)
    throw error
  }
}

export const getProductByID = async (
  client: ProductServiceClient,
  clientParams: GrpcConfig,
  input: GetProductByIDRequest
): Promise<GetProductByIDResponse> => {
  try {
    const response = await getProductByIDWithAuth(client, clientParams, input)
    return response
  } catch (error) {
    console.error('❌ product API: getProductByID error:', error)
    throw error
  }
}

export const getProductContent = async (
  client: ProductServiceClient,
  clientParams: GrpcConfig,
  input: GetProductContentRequest
): Promise<GetProductContentResponse> => {
  try {
    const response = await getProductContentWithAuth(client, clientParams, input)
    return response
  } catch (error) {
    console.error('❌ product API: getProductContent error:', error)
    throw error
  }
}
