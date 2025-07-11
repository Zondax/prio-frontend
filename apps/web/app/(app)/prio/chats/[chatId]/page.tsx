'use client'

import { use } from 'react'

export default function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = use(params)

  return (
    <div className="h-full p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Chat {chatId}</h1>
        <p className="text-muted-foreground">Chat functionality will be implemented once chat stores are available in prio-frontend.</p>
      </div>
    </div>
  )
}
