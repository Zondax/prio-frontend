import * as ActivityServiceClientPb from './entities/proto/api/v1/ActivityServiceClientPb'
import * as ActivityPb from './entities/proto/api/v1/activity_pb'
import * as CalendarServiceClientPb from './entities/proto/api/v1/CalendarServiceClientPb'
import * as CalendarPb from './entities/proto/api/v1/calendar_pb'
import * as CommonPb from './entities/proto/api/v1/common_pb'
import * as EventServiceClientPb from './entities/proto/api/v1/EventServiceClientPb'
import * as EventscollectionsServiceClientPb from './entities/proto/api/v1/EventscollectionsServiceClientPb'
import * as EventPb from './entities/proto/api/v1/event_pb'
import * as EventscollectionsPb from './entities/proto/api/v1/eventscollections_pb'
import * as MobileIntegrityServiceClientPb from './entities/proto/api/v1/Mobile_integrityServiceClientPb'
import * as MobileIntegrityPb from './entities/proto/api/v1/mobile_integrity_pb'
import * as PaymentGatewayServiceClientPb from './entities/proto/api/v1/Payment-gatewayServiceClientPb'
import * as PaymentGatewayPb from './entities/proto/api/v1/payment-gateway_pb'
import * as UserPreferencesPb from './entities/proto/api/v1/UserServiceClientPb'
import * as UserServiceClientPb from './entities/proto/api/v1/user_pb'
import * as WaitingListServiceClientPb from './entities/proto/api/v1/Waiting_listServiceClientPb'
import * as WaitingListPb from './entities/proto/api/v1/waiting_list_pb'

export { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb'
export * from './grpc'

export {
  CalendarPb as Calendar,
  CalendarServiceClientPb as CalendarService,
  CommonPb as Common,
  ActivityPb as Activity,
  ActivityServiceClientPb as ActivityService,
  EventPb as Event,
  EventServiceClientPb as EventService,
  UserPreferencesPb as User,
  UserServiceClientPb as UserService,
  WaitingListPb as WaitingList,
  WaitingListServiceClientPb as WaitingListService,
  MobileIntegrityPb as MobileIntegrity,
  MobileIntegrityServiceClientPb as MobileIntegrityService,
  EventscollectionsPb as EventsCollections,
  EventscollectionsServiceClientPb as EventsCollectionsService,
  PaymentGatewayPb as PaymentGateway,
  PaymentGatewayServiceClientPb as PaymentGatewayService,
}

export const GRPC_URLS = {
  prod: 'https://prio-api.zondax.ch',
  dev: 'https://prio-api.zondax.io',
} as const
