import type { GrpcConfig } from '@mono-grpc'
import { createSimpleStore } from '@zondax/stores'
import type { ProductServiceClient } from '../../../grpc/src/entities/proto/api/v1/ProductServiceClientPb'
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
import { createProductServiceClient, getPlans, getProductByID, getProductContent, getProducts } from '../api/product'

// Store for getting products
export const useGetProductsStore = createSimpleStore<GrpcConfig, ProductServiceClient, GetProductsRequest, GetProductsResponse>({
  createClient: createProductServiceClient,
  method: getProducts,
})

// Store for getting plans
export const useGetPlansStore = createSimpleStore<GrpcConfig, ProductServiceClient, GetPlansRequest, GetPlansResponse>({
  createClient: createProductServiceClient,
  method: getPlans,
})

// Store for getting product by ID
export const useGetProductByIDStore = createSimpleStore<GrpcConfig, ProductServiceClient, GetProductByIDRequest, GetProductByIDResponse>({
  createClient: createProductServiceClient,
  method: getProductByID,
})

// Store for getting product content (protected)
export const useGetProductContentStore = createSimpleStore<
  GrpcConfig,
  ProductServiceClient,
  GetProductContentRequest,
  GetProductContentResponse
>({
  createClient: createProductServiceClient,
  method: getProductContent,
})
