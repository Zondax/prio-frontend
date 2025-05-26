import type { TopBarItem } from '@/components/topbar'

export const topBarItems: TopBarItem[] = [
  { key: 'Home', name: 'Home', href: '/explore' },
  { key: 'dev', name: 'Dev', href: '/dev' },
  { key: 'dev-auth', name: 'Auth', href: '/dev/auth' },
  { key: 'dev-grpc', name: 'Grpc', href: '/dev/grpc' },
  { key: 'dev-waiting', name: 'Waiting List', href: '/dev/waiting' },
  { key: 'dev-ui', name: 'DevUI', href: '/dev/ui' },
]
