'use client'

import type { AgentMessage } from '@prio-state'
import { useEffect, useRef } from 'react'

import ChatMessage from './chat-message'

interface ChatAreaProps {
  messages: AgentMessage[]
}

export default function ChatArea({ messages }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(scrollToBottom, 100)
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto absolute inset-0 bottom-[68px] pb-2">
      <div className="p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} role={message.role} content={message.content} type={message.type} timestamp={message.timestamp} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
