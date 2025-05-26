'use client'

import { Send } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ChatInputProps {
  onSubmit: (message: string) => void
  isProcessing: boolean
}

export default function ChatInput({ onSubmit, isProcessing }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = () => {
    if (!inputValue.trim()) return

    // Send the message to the parent component
    onSubmit(inputValue)

    // Reset input value
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t">
      <div className="p-3">
        <Card className="flex items-center p-2 shadow-xs border-zinc-100">
          <textarea
            placeholder="Type your message here..."
            className="min-h-[40px] max-h-[160px] resize-none outline-hidden border-0 p-0 bg-transparent flex-1 focus:outline-hidden text-sm"
            style={{ boxShadow: 'none' }}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full ml-2 hover:bg-zinc-100"
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isProcessing}
          >
            <Send className="h-4 w-4" />
          </Button>
        </Card>
      </div>
    </div>
  )
}
