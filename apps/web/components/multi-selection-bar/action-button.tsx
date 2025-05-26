'use client'

import { CheckCircle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { ActionState } from './types'

/**
 * Props for the ActionButton component
 */
export interface ActionButtonProps {
  /** Current state of the action */
  state: ActionState
  /** Text to display on the button */
  text: string
  /** Handler for button click */
  onClick?: () => void
  /** Whether the button should be disabled */
  isDisabled: boolean
  /** Text to display when in success state */
  successText?: string
  /** Optional variant for the button */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

/**
 * Action button with state handling (idle, processing, success)
 */
export function ActionButton({
  state,
  text,
  onClick = () => {},
  isDisabled,
  successText = 'Added successfully!',
  variant = 'default',
}: ActionButtonProps) {
  const buttonClasses = cn(
    'h-9 px-3 transition-all duration-200',
    state === 'success' && 'bg-green-500 text-white hover:bg-green-600',
    state === 'processing' && 'bg-primary/80'
  )

  return (
    <Button size="sm" variant={variant} className={buttonClasses} disabled={isDisabled || state !== 'idle'} onClick={onClick}>
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
  )
}
