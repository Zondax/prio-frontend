'use client'

import { type ChatSession, useAgentStore } from '@prio-state'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDate, formatRelativeDate } from '@/lib/utils'

export default function ChatSidebar() {
  const { sessions, selectSession, createNewSession } = useAgentStore()
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">No chat sessions yet</div>
          ) : (
            sessions.map((session: ChatSession) => (
              <Button
                key={session.id}
                variant={session.selected ? 'secondary' : 'ghost'}
                className={`w-full justify-start text-left px-3 py-2 h-auto text-sm ${session.selected ? 'bg-secondary' : ''}`}
                onClick={() => selectSession(session.id)}
              >
                <div className="truncate w-full">
                  <p className="font-medium truncate">{session.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {isClient ? formatRelativeDate(session.date) : formatDate(session.date)}
                    {session.messages && ` · ${session.messages.length} messages`}
                  </p>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <Button variant="outline" className="w-full justify-start" size="sm" onClick={createNewSession}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Chat
        </Button>
      </div>
    </div>
  )
}
