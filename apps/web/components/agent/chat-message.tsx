'use client'

import type { AgentMessage } from '@prio-state'
import { format } from 'date-fns'
import { Bot, User } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

import ChatMessageContent from './chat-message-content'

type ChatMessageProps = Pick<AgentMessage, 'role' | 'content' | 'type' | 'timestamp'>

export default function ChatMessage({ role, content, type = 'text', timestamp }: ChatMessageProps) {
  const isUser = role === 'user'

  // For hydration safety, first render the same on both server and client
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // After hydration is complete, we can safely update to client rendering
    setIsClient(true)
  }, [])

  // Format the timestamp, this will be consistent on both server and client
  const formattedTime = timestamp ? format(timestamp, 'HH:mm') : ''

  return (
    <div className={cn('flex gap-3 items-start', isUser && 'justify-end')}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn('flex flex-col max-w-[70%]', isUser ? 'items-end' : 'items-start')}>
        <ChatMessageContent content={content} isUser={isUser} type={type} />
        {timestamp && (
          <span className={cn('text-xs text-muted-foreground mt-1.5', isUser ? 'mr-1' : 'ml-1')} suppressHydrationWarning>
            {formattedTime}
          </span>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-zinc-800 text-zinc-50">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
