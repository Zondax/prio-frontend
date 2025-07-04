import * as jspb from 'google-protobuf'

import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb'; // proto import: "google/protobuf/struct.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class CreateCheckoutSessionRequest extends jspb.Message {
  getProductId(): string;
  setProductId(value: string): CreateCheckoutSessionRequest;

  getQuantity(): number;
  setQuantity(value: number): CreateCheckoutSessionRequest;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): CreateCheckoutSessionRequest;
  hasMetadata(): boolean;
  clearMetadata(): CreateCheckoutSessionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateCheckoutSessionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateCheckoutSessionRequest): CreateCheckoutSessionRequest.AsObject;
  static serializeBinaryToWriter(message: CreateCheckoutSessionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateCheckoutSessionRequest;
  static deserializeBinaryFromReader(message: CreateCheckoutSessionRequest, reader: jspb.BinaryReader): CreateCheckoutSessionRequest;
}

export namespace CreateCheckoutSessionRequest {
  export type AsObject = {
    productId: string,
    quantity: number,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
  }
}

export class CreateCheckoutSessionResponse extends jspb.Message {
  getSessionId(): string;
  setSessionId(value: string): CreateCheckoutSessionResponse;

  getClientSecret(): string;
  setClientSecret(value: string): CreateCheckoutSessionResponse;

  getUrl(): string;
  setUrl(value: string): CreateCheckoutSessionResponse;

  getStatus(): string;
  setStatus(value: string): CreateCheckoutSessionResponse;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): CreateCheckoutSessionResponse;
  hasCreatedAt(): boolean;
  clearCreatedAt(): CreateCheckoutSessionResponse;

  getExpiresAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setExpiresAt(value?: google_protobuf_timestamp_pb.Timestamp): CreateCheckoutSessionResponse;
  hasExpiresAt(): boolean;
  clearExpiresAt(): CreateCheckoutSessionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateCheckoutSessionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateCheckoutSessionResponse): CreateCheckoutSessionResponse.AsObject;
  static serializeBinaryToWriter(message: CreateCheckoutSessionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateCheckoutSessionResponse;
  static deserializeBinaryFromReader(message: CreateCheckoutSessionResponse, reader: jspb.BinaryReader): CreateCheckoutSessionResponse;
}

export namespace CreateCheckoutSessionResponse {
  export type AsObject = {
    sessionId: string,
    clientSecret: string,
    url: string,
    status: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    expiresAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class GetCheckoutSessionStatusRequest extends jspb.Message {
  getSessionId(): string;
  setSessionId(value: string): GetCheckoutSessionStatusRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCheckoutSessionStatusRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCheckoutSessionStatusRequest): GetCheckoutSessionStatusRequest.AsObject;
  static serializeBinaryToWriter(message: GetCheckoutSessionStatusRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCheckoutSessionStatusRequest;
  static deserializeBinaryFromReader(message: GetCheckoutSessionStatusRequest, reader: jspb.BinaryReader): GetCheckoutSessionStatusRequest;
}

export namespace GetCheckoutSessionStatusRequest {
  export type AsObject = {
    sessionId: string,
  }
}

export class GetCheckoutSessionStatusResponse extends jspb.Message {
  getSessionId(): string;
  setSessionId(value: string): GetCheckoutSessionStatusResponse;

  getStatus(): string;
  setStatus(value: string): GetCheckoutSessionStatusResponse;

  getPaymentStatus(): string;
  setPaymentStatus(value: string): GetCheckoutSessionStatusResponse;

  getCustomerEmail(): string;
  setCustomerEmail(value: string): GetCheckoutSessionStatusResponse;

  getAmountTotal(): number;
  setAmountTotal(value: number): GetCheckoutSessionStatusResponse;

  getCurrency(): string;
  setCurrency(value: string): GetCheckoutSessionStatusResponse;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): GetCheckoutSessionStatusResponse;
  hasCreatedAt(): boolean;
  clearCreatedAt(): GetCheckoutSessionStatusResponse;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): GetCheckoutSessionStatusResponse;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): GetCheckoutSessionStatusResponse;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): GetCheckoutSessionStatusResponse;
  hasMetadata(): boolean;
  clearMetadata(): GetCheckoutSessionStatusResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCheckoutSessionStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCheckoutSessionStatusResponse): GetCheckoutSessionStatusResponse.AsObject;
  static serializeBinaryToWriter(message: GetCheckoutSessionStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCheckoutSessionStatusResponse;
  static deserializeBinaryFromReader(message: GetCheckoutSessionStatusResponse, reader: jspb.BinaryReader): GetCheckoutSessionStatusResponse;
}

export namespace GetCheckoutSessionStatusResponse {
  export type AsObject = {
    sessionId: string,
    status: string,
    paymentStatus: string,
    customerEmail: string,
    amountTotal: number,
    currency: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
  }
}

export class CreatePortalSessionRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreatePortalSessionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreatePortalSessionRequest): CreatePortalSessionRequest.AsObject;
  static serializeBinaryToWriter(message: CreatePortalSessionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreatePortalSessionRequest;
  static deserializeBinaryFromReader(message: CreatePortalSessionRequest, reader: jspb.BinaryReader): CreatePortalSessionRequest;
}

export namespace CreatePortalSessionRequest {
  export type AsObject = {
  }
}

export class CreatePortalSessionResponse extends jspb.Message {
  getSessionId(): string;
  setSessionId(value: string): CreatePortalSessionResponse;

  getUrl(): string;
  setUrl(value: string): CreatePortalSessionResponse;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): CreatePortalSessionResponse;
  hasCreatedAt(): boolean;
  clearCreatedAt(): CreatePortalSessionResponse;

  getExpiresAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setExpiresAt(value?: google_protobuf_timestamp_pb.Timestamp): CreatePortalSessionResponse;
  hasExpiresAt(): boolean;
  clearExpiresAt(): CreatePortalSessionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreatePortalSessionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreatePortalSessionResponse): CreatePortalSessionResponse.AsObject;
  static serializeBinaryToWriter(message: CreatePortalSessionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreatePortalSessionResponse;
  static deserializeBinaryFromReader(message: CreatePortalSessionResponse, reader: jspb.BinaryReader): CreatePortalSessionResponse;
}

export namespace CreatePortalSessionResponse {
  export type AsObject = {
    sessionId: string,
    url: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    expiresAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

