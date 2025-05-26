'use client'

import DebugLayout from '@/components/debug/debug-layout'

export default function EmptyPage() {
  return (
    <DebugLayout index={2}>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Empty Page</h1>
        <p>This is an empty page for testing purposes.</p>
      </div>
    </DebugLayout>
  )
}
