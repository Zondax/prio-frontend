import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class Product extends jspb.Message {
  getId(): string;
  setId(value: string): Product;

  getProductCode(): string;
  setProductCode(value: string): Product;

  getName(): string;
  setName(value: string): Product;

  getDescription(): string;
  setDescription(value: string): Product;

  getProductType(): ProductType;
  setProductType(value: ProductType): Product;

  getGateway(): string;
  setGateway(value: string): Product;

  getGatewayProductId(): string;
  setGatewayProductId(value: string): Product;

  getRequestsIncluded(): number;
  setRequestsIncluded(value: number): Product;

  getEndDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndDate(value?: google_protobuf_timestamp_pb.Timestamp): Product;
  hasEndDate(): boolean;
  clearEndDate(): Product;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Product;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Product;

  getActive(): boolean;
  setActive(value: boolean): Product;

  getMetadata(): ProductMetadata | undefined;
  setMetadata(value?: ProductMetadata): Product;
  hasMetadata(): boolean;
  clearMetadata(): Product;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Product.AsObject;
  static toObject(includeInstance: boolean, msg: Product): Product.AsObject;
  static serializeBinaryToWriter(message: Product, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Product;
  static deserializeBinaryFromReader(message: Product, reader: jspb.BinaryReader): Product;
}

export namespace Product {
  export type AsObject = {
    id: string,
    productCode: string,
    name: string,
    description: string,
    productType: ProductType,
    gateway: string,
    gatewayProductId: string,
    requestsIncluded: number,
    endDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    active: boolean,
    metadata?: ProductMetadata.AsObject,
  }
}

export class ProductMetadata extends jspb.Message {
  getFeaturesList(): Array<string>;
  setFeaturesList(value: Array<string>): ProductMetadata;
  clearFeaturesList(): ProductMetadata;
  addFeatures(value: string, index?: number): ProductMetadata;

  getTier(): string;
  setTier(value: string): ProductMetadata;

  getPopular(): boolean;
  setPopular(value: boolean): ProductMetadata;

  getIconUrl(): string;
  setIconUrl(value: string): ProductMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProductMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: ProductMetadata): ProductMetadata.AsObject;
  static serializeBinaryToWriter(message: ProductMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProductMetadata;
  static deserializeBinaryFromReader(message: ProductMetadata, reader: jspb.BinaryReader): ProductMetadata;
}

export namespace ProductMetadata {
  export type AsObject = {
    featuresList: Array<string>,
    tier: string,
    popular: boolean,
    iconUrl: string,
  }
}

export class GetProductsRequest extends jspb.Message {
  getLimit(): number;
  setLimit(value: number): GetProductsRequest;

  getActiveOnly(): boolean;
  setActiveOnly(value: boolean): GetProductsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProductsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetProductsRequest): GetProductsRequest.AsObject;
  static serializeBinaryToWriter(message: GetProductsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProductsRequest;
  static deserializeBinaryFromReader(message: GetProductsRequest, reader: jspb.BinaryReader): GetProductsRequest;
}

export namespace GetProductsRequest {
  export type AsObject = {
    limit: number,
    activeOnly: boolean,
  }
}

export class GetProductsResponse extends jspb.Message {
  getProductsList(): Array<Product>;
  setProductsList(value: Array<Product>): GetProductsResponse;
  clearProductsList(): GetProductsResponse;
  addProducts(value?: Product, index?: number): Product;

  getTotalCount(): number;
  setTotalCount(value: number): GetProductsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProductsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetProductsResponse): GetProductsResponse.AsObject;
  static serializeBinaryToWriter(message: GetProductsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProductsResponse;
  static deserializeBinaryFromReader(message: GetProductsResponse, reader: jspb.BinaryReader): GetProductsResponse;
}

export namespace GetProductsResponse {
  export type AsObject = {
    productsList: Array<Product.AsObject>,
    totalCount: number,
  }
}

export class GetPlansRequest extends jspb.Message {
  getLimit(): number;
  setLimit(value: number): GetPlansRequest;

  getActiveOnly(): boolean;
  setActiveOnly(value: boolean): GetPlansRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPlansRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPlansRequest): GetPlansRequest.AsObject;
  static serializeBinaryToWriter(message: GetPlansRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPlansRequest;
  static deserializeBinaryFromReader(message: GetPlansRequest, reader: jspb.BinaryReader): GetPlansRequest;
}

export namespace GetPlansRequest {
  export type AsObject = {
    limit: number,
    activeOnly: boolean,
  }
}

export class GetPlansResponse extends jspb.Message {
  getPlansList(): Array<Product>;
  setPlansList(value: Array<Product>): GetPlansResponse;
  clearPlansList(): GetPlansResponse;
  addPlans(value?: Product, index?: number): Product;

  getTotalCount(): number;
  setTotalCount(value: number): GetPlansResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPlansResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPlansResponse): GetPlansResponse.AsObject;
  static serializeBinaryToWriter(message: GetPlansResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPlansResponse;
  static deserializeBinaryFromReader(message: GetPlansResponse, reader: jspb.BinaryReader): GetPlansResponse;
}

export namespace GetPlansResponse {
  export type AsObject = {
    plansList: Array<Product.AsObject>,
    totalCount: number,
  }
}

export class GetProductByIDRequest extends jspb.Message {
  getProductId(): string;
  setProductId(value: string): GetProductByIDRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProductByIDRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetProductByIDRequest): GetProductByIDRequest.AsObject;
  static serializeBinaryToWriter(message: GetProductByIDRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProductByIDRequest;
  static deserializeBinaryFromReader(message: GetProductByIDRequest, reader: jspb.BinaryReader): GetProductByIDRequest;
}

export namespace GetProductByIDRequest {
  export type AsObject = {
    productId: string,
  }
}

export class GetProductByIDResponse extends jspb.Message {
  getProduct(): Product | undefined;
  setProduct(value?: Product): GetProductByIDResponse;
  hasProduct(): boolean;
  clearProduct(): GetProductByIDResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProductByIDResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetProductByIDResponse): GetProductByIDResponse.AsObject;
  static serializeBinaryToWriter(message: GetProductByIDResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProductByIDResponse;
  static deserializeBinaryFromReader(message: GetProductByIDResponse, reader: jspb.BinaryReader): GetProductByIDResponse;
}

export namespace GetProductByIDResponse {
  export type AsObject = {
    product?: Product.AsObject,
  }
}

export class GetProductContentRequest extends jspb.Message {
  getProductId(): string;
  setProductId(value: string): GetProductContentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProductContentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetProductContentRequest): GetProductContentRequest.AsObject;
  static serializeBinaryToWriter(message: GetProductContentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProductContentRequest;
  static deserializeBinaryFromReader(message: GetProductContentRequest, reader: jspb.BinaryReader): GetProductContentRequest;
}

export namespace GetProductContentRequest {
  export type AsObject = {
    productId: string,
  }
}

export class GetProductContentResponse extends jspb.Message {
  getContent(): string;
  setContent(value: string): GetProductContentResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProductContentResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetProductContentResponse): GetProductContentResponse.AsObject;
  static serializeBinaryToWriter(message: GetProductContentResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProductContentResponse;
  static deserializeBinaryFromReader(message: GetProductContentResponse, reader: jspb.BinaryReader): GetProductContentResponse;
}

export namespace GetProductContentResponse {
  export type AsObject = {
    content: string,
  }
}

export enum ProductType { 
  PRODUCT_TYPE_UNSPECIFIED = 0,
  PRODUCT_TYPE_ONE_TIME = 1,
  PRODUCT_TYPE_API_CALLS = 2,
  PRODUCT_TYPE_SUBSCRIPTION = 3,
}
