/**
 * @fileoverview gRPC-Web generated client stub for proto.api.v1
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v5.29.1
// source: proto/api/v1/payment-gateway.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as proto_api_v1_payment$gateway_pb from '../../../proto/api/v1/payment-gateway_pb'; // proto import: "proto/api/v1/payment-gateway.proto"


export class PaymentGatewayClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorCreateCheckoutSession = new grpcWeb.MethodDescriptor(
    '/proto.api.v1.PaymentGateway/CreateCheckoutSession',
    grpcWeb.MethodType.UNARY,
    proto_api_v1_payment$gateway_pb.CreateCheckoutSessionRequest,
    proto_api_v1_payment$gateway_pb.CreateCheckoutSessionResponse,
    (request: proto_api_v1_payment$gateway_pb.CreateCheckoutSessionRequest) => {
      return request.serializeBinary();
    },
    proto_api_v1_payment$gateway_pb.CreateCheckoutSessionResponse.deserializeBinary
  );

  createCheckoutSession(
    request: proto_api_v1_payment$gateway_pb.CreateCheckoutSessionRequest,
    metadata?: grpcWeb.Metadata | null): Promise<proto_api_v1_payment$gateway_pb.CreateCheckoutSessionResponse>;

  createCheckoutSession(
    request: proto_api_v1_payment$gateway_pb.CreateCheckoutSessionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: proto_api_v1_payment$gateway_pb.CreateCheckoutSessionResponse) => void): grpcWeb.ClientReadableStream<proto_api_v1_payment$gateway_pb.CreateCheckoutSessionResponse>;

  createCheckoutSession(
    request: proto_api_v1_payment$gateway_pb.CreateCheckoutSessionRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: proto_api_v1_payment$gateway_pb.CreateCheckoutSessionResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/proto.api.v1.PaymentGateway/CreateCheckoutSession',
        request,
        metadata || {},
        this.methodDescriptorCreateCheckoutSession,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/proto.api.v1.PaymentGateway/CreateCheckoutSession',
    request,
    metadata || {},
    this.methodDescriptorCreateCheckoutSession);
  }

  methodDescriptorGetCheckoutSessionStatus = new grpcWeb.MethodDescriptor(
    '/proto.api.v1.PaymentGateway/GetCheckoutSessionStatus',
    grpcWeb.MethodType.UNARY,
    proto_api_v1_payment$gateway_pb.GetCheckoutSessionStatusRequest,
    proto_api_v1_payment$gateway_pb.GetCheckoutSessionStatusResponse,
    (request: proto_api_v1_payment$gateway_pb.GetCheckoutSessionStatusRequest) => {
      return request.serializeBinary();
    },
    proto_api_v1_payment$gateway_pb.GetCheckoutSessionStatusResponse.deserializeBinary
  );

  getCheckoutSessionStatus(
    request: proto_api_v1_payment$gateway_pb.GetCheckoutSessionStatusRequest,
    metadata?: grpcWeb.Metadata | null): Promise<proto_api_v1_payment$gateway_pb.GetCheckoutSessionStatusResponse>;

  getCheckoutSessionStatus(
    request: proto_api_v1_payment$gateway_pb.GetCheckoutSessionStatusRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: proto_api_v1_payment$gateway_pb.GetCheckoutSessionStatusResponse) => void): grpcWeb.ClientReadableStream<proto_api_v1_payment$gateway_pb.GetCheckoutSessionStatusResponse>;

  getCheckoutSessionStatus(
    request: proto_api_v1_payment$gateway_pb.GetCheckoutSessionStatusRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: proto_api_v1_payment$gateway_pb.GetCheckoutSessionStatusResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/proto.api.v1.PaymentGateway/GetCheckoutSessionStatus',
        request,
        metadata || {},
        this.methodDescriptorGetCheckoutSessionStatus,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/proto.api.v1.PaymentGateway/GetCheckoutSessionStatus',
    request,
    metadata || {},
    this.methodDescriptorGetCheckoutSessionStatus);
  }

  methodDescriptorCreatePortalSession = new grpcWeb.MethodDescriptor(
    '/proto.api.v1.PaymentGateway/CreatePortalSession',
    grpcWeb.MethodType.UNARY,
    proto_api_v1_payment$gateway_pb.CreatePortalSessionRequest,
    proto_api_v1_payment$gateway_pb.CreatePortalSessionResponse,
    (request: proto_api_v1_payment$gateway_pb.CreatePortalSessionRequest) => {
      return request.serializeBinary();
    },
    proto_api_v1_payment$gateway_pb.CreatePortalSessionResponse.deserializeBinary
  );

  createPortalSession(
    request: proto_api_v1_payment$gateway_pb.CreatePortalSessionRequest,
    metadata?: grpcWeb.Metadata | null): Promise<proto_api_v1_payment$gateway_pb.CreatePortalSessionResponse>;

  createPortalSession(
    request: proto_api_v1_payment$gateway_pb.CreatePortalSessionRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: proto_api_v1_payment$gateway_pb.CreatePortalSessionResponse) => void): grpcWeb.ClientReadableStream<proto_api_v1_payment$gateway_pb.CreatePortalSessionResponse>;

  createPortalSession(
    request: proto_api_v1_payment$gateway_pb.CreatePortalSessionRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: proto_api_v1_payment$gateway_pb.CreatePortalSessionResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/proto.api.v1.PaymentGateway/CreatePortalSession',
        request,
        metadata || {},
        this.methodDescriptorCreatePortalSession,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/proto.api.v1.PaymentGateway/CreatePortalSession',
    request,
    metadata || {},
    this.methodDescriptorCreatePortalSession);
  }

}

