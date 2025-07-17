import * as BookmarkServiceClientPb from './entities/proto/api/v1/BookmarkServiceClientPb'
import * as BookmarkPb from './entities/proto/api/v1/bookmark_pb'
import * as ChatServiceClientPb from './entities/proto/api/v1/ChatServiceClientPb'
import * as ChatPb from './entities/proto/api/v1/chat_pb'
import * as CommonPb from './entities/proto/api/v1/common_pb'
import * as PaymentGatewayServiceClientPb from './entities/proto/api/v1/Payment-gatewayServiceClientPb'
import * as PaymentGatewayPb from './entities/proto/api/v1/payment-gateway_pb'
import * as UserPreferencesPb from './entities/proto/api/v1/UserServiceClientPb'
import * as UserServiceClientPb from './entities/proto/api/v1/user_pb'

export { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
export * from './grpc'

export {
  BookmarkPb as Bookmark,
  BookmarkServiceClientPb as BookmarkService,
  CommonPb as Common,
  UserPreferencesPb as User,
  UserServiceClientPb as UserService,
  PaymentGatewayPb as PaymentGateway,
  PaymentGatewayServiceClientPb as PaymentGatewayService,
  ChatPb as Chat,
  ChatServiceClientPb as ChatService,
}

// Export individual user types for authorization module
export {
  ProductPermissionList,
  SubscriptionPlan,
  SubscriptionStatus,
  UserPublicMetadata,
  UserSubscription,
} from './entities/proto/api/v1/user_pb'

export const GRPC_URLS = {
  prod: 'https://prio-api.zondax.ch',
  dev: 'https://prio-api.zondax.io',
} as const
