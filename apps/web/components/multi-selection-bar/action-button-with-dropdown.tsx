'use client'

import { CheckCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import type { ActionState } from './types'

interface ActionButtonWithDropdownProps {
  /** Text to display on the button */
  text: string
  /** Current state of the action */
  state: ActionState
  /** Content to show in the dropdown */
  dropdownContent: React.ReactNode
  /** Text to display when in success state */
  successText?: string
  /** Optional variant for the button */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Handler for dropdown open state changes */
  onOpenChange?: (open: boolean) => void
}

export function ActionButtonWithDropdown({
  text,
  state,
  dropdownContent,
  successText = 'Added successfully!',
  variant = 'default',
  onOpenChange,
}: ActionButtonWithDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Handle dropdown state changes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }

  // Close dropdown when action is successful
  useEffect(() => {
    if (state === 'success' && isOpen) {
      setIsOpen(false)
    }
  }, [state, isOpen])

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild disabled={state !== 'idle'}>
        <Button
          variant={variant}
          size="sm"
          className={cn(
            'h-9 px-3 transition-all duration-200',
            state === 'success' && 'bg-green-500 text-white hover:bg-green-600',
            state === 'processing' && 'bg-primary/80'
          )}
        >
          {state === 'processing' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Processing...</span>
            </>
          ) : state === 'success' ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>{successText}</span>
            </>
          ) : (
            <span className="font-medium">{text}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" onClick={(e) => e.stopPropagation()}>
        {dropdownContent}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
