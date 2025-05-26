'use client'

import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

/**
 * Selection counter and clear button props
 */
export interface SelectionCounterProps {
  /** Number of selected items */
  count: number
  /** Type of items being selected */
  itemType: string
  /** Handler for clearing selection */
  onClear: () => void
  /** Whether the clear button should be disabled */
  disabled: boolean
}

/**
 * Component displaying selection count and clear button
 */
export function SelectionCounter({ count, itemType, onClear, disabled }: SelectionCounterProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">
        {count} {itemType} selected
      </span>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClear} disabled={disabled}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
