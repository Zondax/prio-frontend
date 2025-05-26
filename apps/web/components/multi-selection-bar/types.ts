/**
 * Possible states for an action button
 */
export type ActionState = 'idle' | 'processing' | 'success'

/**
 * Definition for an action button configuration
 */
export interface ActionConfig {
  /** Text to display on the button */
  text: string
  /** Custom dropdown content to show when the action button is clicked. If function, receives { onSuccess } */
  dropdownContent?: React.ReactNode | ((opts: { onSuccess: () => void }) => React.ReactNode)
  /** Function to handle the action directly (without dropdown) */
  onAction?: () => Promise<void>
  /** Text to display when the action is completed successfully */
  successText?: string
  /** Button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  /** Externally controlled success state */
  isSuccess?: boolean
  /** Externally controlled loading state */
  isLoading?: boolean
}

/**
 * Props for the MultiSelectionBar component
 */
export interface MultiSelectionBarProps<T> {
  /** Array of selected items */
  selectedItems: T[]
  /** Function to clear all selected items */
  onClearSelection: () => void
  /** The type of items being selected (e.g., "events", "files", "users") */
  itemType?: string
  /** Position of the bar (fixed at bottom or inline) */
  position?: 'fixed' | 'relative'
  /** CSS class name for the container */
  className?: string
  /** Whether to auto-clear selection after successful action */
  autoClearOnSuccess?: boolean
  /** Array of action buttons to display */
  actions: ActionConfig[]
}
