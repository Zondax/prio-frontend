'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'

import { ActionButton } from './action-button'
import { ActionButtonWithDropdown } from './action-button-with-dropdown'
import { SelectionCounter } from './selection-counter'
import type { ActionConfig, ActionState, MultiSelectionBarProps } from './types'

/**
 * MultiSelectionBar - A reusable component for displaying actions for selected items
 *
 * This component provides a UI for multiple selection scenarios like selecting events,
 * files, users, etc. and performing actions on them.
 */
export function MultiSelectionBar<T>({
  selectedItems,
  onClearSelection,
  itemType = 'items',
  position = 'fixed',
  className,
  autoClearOnSuccess = true,
  actions,
}: MultiSelectionBarProps<T>) {
  // Internal state for action buttons
  const [actionStates, setActionStates] = useState<{ [key: number]: ActionState }>({})
  const [dropdownStates, setDropdownStates] = useState<{ [key: number]: boolean }>({})

  /**
   * Reset all action states to 'idle'
   */
  const resetAllActionStates = useCallback(() => {
    setActionStates((prev) => {
      const newStates: { [key: number]: ActionState } = {}
      for (const key of Object.keys(prev)) {
        newStates[Number(key)] = 'idle'
      }
      console.log('[MultiSelectionBar] resetAllActionStates ke–', newStates)
      return newStates
    })
  }, [])

  /**
   * Get action state for a specific action index
   */
  const getActionState = useCallback(
    (index: number, action: ActionConfig): ActionState => {
      if (action.isLoading) return 'processing'
      if (action.isSuccess) return 'success'
      return actionStates[index] || 'idle'
    },
    [actionStates]
  )

  /**
   * Handle an action button click
   */
  const handleActionClick = useCallback(async (index: number, action: ActionConfig) => {
    if (!action.onAction) return

    try {
      setActionStates((prev) => ({ ...prev, [index]: 'processing' }))
      await action.onAction()

      // Set success state
      setActionStates((prev) => ({ ...prev, [index]: 'success' }))
    } catch (error) {
      console.error('Error performing action:', error)
      setActionStates((prev) => ({ ...prev, [index]: 'idle' }))
    }
  }, [])

  /**
   * Handle dropdown state changes for a specific action
   */
  const handleDropdownChange = useCallback((index: number, open: boolean) => {
    setDropdownStates((prev) => ({ ...prev, [index]: open }))
  }, [])

  /**
   * Effect to close dropdowns when actions are successful
   */
  useEffect(() => {
    for (const [indexStr, state] of Object.entries(actionStates)) {
      const index = Number.parseInt(indexStr, 10)
      if (state === 'success' && dropdownStates[index]) {
        setDropdownStates((prev) => ({ ...prev, [index]: false }))
      }
    }
  }, [actionStates, dropdownStates])

  /**
   * Effect to reset success states after and close multiselect
   */
  useEffect(() => {
    // Check if any action is in 'success' state
    const hasSuccess = Object.values(actionStates).some((state) => state === 'success')
    if (!hasSuccess) return

    const timeout = setTimeout(() => {
      resetAllActionStates()
      if (autoClearOnSuccess && onClearSelection) {
        onClearSelection()
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [actionStates, autoClearOnSuccess, onClearSelection, resetAllActionStates])

  /**
   * Compute container classes
   */
  const containerClasses = useMemo(
    () =>
      cn(
        'bg-background border rounded-lg shadow-lg p-3 flex items-center gap-3 z-50',
        position === 'fixed' ? 'fixed bottom-4 left-1/2 transform -translate-x-1/2' : 'relative w-full',
        className
      ),
    [position, className]
  )

  /**
   * Render an action button with or without dropdown
   */
  const renderActionButton = useCallback(
    (action: ActionConfig, index: number) => {
      const currentState = getActionState(index, action)

      if (action.dropdownContent) {
        const dropdownContent =
          typeof action.dropdownContent === 'function'
            ? action.dropdownContent({
                onSuccess: () => setActionStates((prev) => ({ ...prev, [index]: 'success' })),
              })
            : action.dropdownContent
        return (
          <ActionButtonWithDropdown
            key={`action-${index}`}
            text={action.text}
            state={currentState}
            dropdownContent={dropdownContent}
            successText={action.successText}
            variant={action.variant}
            onOpenChange={(open) => handleDropdownChange(index, open)}
          />
        )
      }

      return (
        <ActionButton
          key={`action-${index}`}
          state={currentState}
          text={action.text}
          onClick={() => handleActionClick(index, action)}
          isDisabled={!action.onAction}
          successText={action.successText}
          variant={action.variant}
        />
      )
    },
    [getActionState, handleActionClick, handleDropdownChange]
  )

  // Don't show the bar when there are no selected items
  if (selectedItems.length === 0) {
    return null
  }

  return (
    <div className={containerClasses}>
      {/* Selection counter and clear button */}
      <SelectionCounter
        count={selectedItems.length}
        itemType={itemType}
        onClear={onClearSelection}
        disabled={Object.values(actionStates).some((state) => state !== 'idle')}
      />

      {/* Render all action buttons */}
      <div className="flex items-center gap-2">{actions.map((action, index) => renderActionButton(action, index))}</div>
    </div>
  )
}
