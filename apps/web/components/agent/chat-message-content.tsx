'use client'

import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface ChatMessageContentProps {
  content: string
  isUser: boolean
  type?: 'text' | 'markdown' | 'code'
}

export default function ChatMessageContent({ content, isUser, type = 'text' }: ChatMessageContentProps) {
  const renderContent = (): ReactNode => {
    switch (type) {
      case 'text':
        return <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
      case 'markdown':
        // FIXME: use a markdown renderer like react-markdown here
        return <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
      case 'code':
        return (
          <pre className="text-sm leading-normal p-3 bg-zinc-900 text-zinc-50 rounded overflow-x-auto">
            <code>{content}</code>
          </pre>
        )
      default:
        return <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
    }
  }

  return (
    <div
      className={cn(
        'rounded-2xl px-4 py-2.5 w-full shadow-xs',
        isUser
          ? 'bg-linear-to-br from-primary to-primary/90 text-primary-foreground'
          : 'bg-zinc-100 dark:bg-card border text-zinc-900 dark:text-card-foreground'
      )}
    >
      {renderContent()}
    </div>
  )
}
