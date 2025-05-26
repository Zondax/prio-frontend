import { Common } from '@prio-grpc'

import { InvalidPlatformError } from '../../../auth-core/src/errors'
import { getGrpcUrl } from '../utils'

export const authGrpcUrl = getGrpcUrl(process.env.EXPO_PUBLIC_AUTH_URL || 'https://test-api.example.com')

const Platform = Common.Platform

export function intoGrpcPlatform(platform: string) {
  switch (platform) {
    case 'ios':
      return Platform.PLATFORM_IOS
    case 'android':
      return Platform.PLATFORM_ANDROID
    default:
      throw new InvalidPlatformError(`Platform ${platform} is not supported`)
  }
}
