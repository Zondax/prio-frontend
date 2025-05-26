import DebugLayout from '@/components/debug/debug-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prio | Explore',
  description: 'Explore the world!',
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1">
      <DebugLayout index={3}>{children}</DebugLayout>
    </div>
  )
}
