'use client'

import { Pin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { SelectionProps } from './event-card'

interface PinButtonProps {
  isPinned: boolean
  eventId: string
  onPinToggle: (e: React.MouseEvent) => void
  className?: string
  showDropdown?: boolean
  selection: SelectionProps
}

export function PinButton({ isPinned, eventId, className, onPinToggle, showDropdown = false, selection }: PinButtonProps) {
  isPinned = false // TODO: Workaround, we should define WELL the behavior of the pin button

  const { isEventSelected, toggleEventSelection } = selection

  const handleSelectionClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Toggle selection
    toggleEventSelection(eventId)

    // Also toggle the pin state when selection is toggled
    // onPinToggle(e) // TODO: We comment this because we use the pin now only with the bulk. This meant that when you “pin” an event, it becomes pinned.
  }

  return (
    <>
      <Button
        size="icon"
        variant={isEventSelected(eventId) ? 'default' : 'secondary'}
        className={cn('h-8 w-8 border border-midnight-ridge', className)}
        onClick={handleSelectionClick}
      >
        {isEventSelected(eventId) ? <Pin className="h-4 w-4 fill-current" /> : <Pin className="h-4 w-4" />}
      </Button>
    </>
  )
}
