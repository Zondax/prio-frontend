import type { Metadata } from 'next'
import DebugLayout from '@/components/debug/debug-layout'

export const metadata: Metadata = {
  title: 'Prio | Empty',
  description: 'Empty page',
}

export default function EmptyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-gray-100">
      <DebugLayout index={3}>{children}</DebugLayout>
    </div>
  )
}
