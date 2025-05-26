'use client'

import { Bell } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function MessagesIndicator() {
  // Placeholder for actual notification count and logic
  const notifications = 0 // Example: replace with actual count

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="relative w-10 h-10 rounded-full group">
            <Bell className="h-5 w-5 transition-colors group-hover:text-primary" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
              </span>
            )}
            <span className="sr-only">View notifications</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{notifications > 0 ? `You have ${notifications} new messages` : 'No new messages'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
