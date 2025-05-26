'use client'

import { useAgentActions, useAgentStore, useEndpointStore } from '@prio-state'
import { useGrpcSetup } from '@zondax/auth-web/hooks'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import ChatArea from '@/components/agent/chat-area'
import ChatInput from '@/components/agent/chat-input'
import ChatSidebar from '@/components/agent/chat-sidebar'

export default function AgentPage() {
  const { selectedEndpoint } = useEndpointStore()

  const { messages, addUserMessage, isProcessing, ensureDefaultSession, setParams } = useAgentStore()
  useGrpcSetup(setParams, selectedEndpoint)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Ensure we have a default session when the component mounts
  useEffect(() => {
    ensureDefaultSession()
  }, [ensureDefaultSession])

  // Close sidebar on mobile when screen is narrow
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    // Set initial state
    handleResize()

    // Add listener
    window.addEventListener('resize', handleResize)

    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSendMessage = (message: string) => {
    // Add user message to the store
    addUserMessage(message)

    // Close sidebar on mobile after sending a message
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden">
      <div
        className={`${sidebarOpen ? 'w-64 md:w-80' : 'w-0'} transition-all duration-300 border-r overflow-hidden absolute md:relative h-full z-20 bg-background`}
      >
        <ChatSidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 overflow-hidden relative w-full">
        {/* Sidebar Toggle Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="absolute top-4 left-4 z-30 md:hidden bg-primary text-primary-foreground rounded-full p-2 shadow-md"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Messages Area */}
        <ChatArea messages={messages} />

        {/* Input Area */}
        <ChatInput onSubmit={handleSendMessage} isProcessing={isProcessing} />
      </div>
    </div>
  )
}
