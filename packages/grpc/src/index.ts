import * as CommonPb from './entities/proto/api/v1/common_pb'
import * as PaymentGatewayServiceClientPb from './entities/proto/api/v1/Payment-gatewayServiceClientPb'
import * as PaymentGatewayPb from './entities/proto/api/v1/payment-gateway_pb'
import * as UserPreferencesPb from './entities/proto/api/v1/UserServiceClientPb'
import * as UserServiceClientPb from './entities/proto/api/v1/user_pb'

export { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
export * from './grpc'

export {
  CommonPb as Common,
  UserPreferencesPb as User,
  UserServiceClientPb as UserService,
  PaymentGatewayPb as PaymentGateway,
  PaymentGatewayServiceClientPb as PaymentGatewayService,
}

export const GRPC_URLS = {
  prod: 'https://prio-api.zondax.ch',
  dev: 'https://prio-api.zondax.io',
} as const
