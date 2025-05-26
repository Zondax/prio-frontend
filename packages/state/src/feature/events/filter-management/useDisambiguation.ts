import type { Filter } from '@prio-grpc/entities/proto/api/v1/common_pb'
import type { AmbiguousFilterGroup } from '@prio-grpc/entities/proto/api/v1/event_pb'
import { useCallback, useEffect, useRef, useState } from 'react'

import { type AmbiguousEntity, convertToAmbiguousEntity, findNextUnprocessedFilterGroup } from './disambiguation'

interface UseDisambiguationProps {
  ambiguousFilters?: AmbiguousFilterGroup[]
  sessionId?: string
}

// TODO: I'm not entirely happy with how we handle ambiguities.
// The flow is: User sends NL filter -> We return resolved_filters + ambiguous_filters + nl_session_id
// Then the user sends the filter they want to resolve + the nl_session_id, and the backend internally resolves the ambiguity.
// If the user send another filter like pinnedOnly, the backend resolve the merge internally. The backend logic is fine,
// but is not so intuitive to understand.
// The proto interface is not very explicit and you need to read the code to understand it. We need to improve this

/**
 * Hook to handle disambiguation of ambiguous filters
 * This simplified version focuses on collecting user-selected filters and sessionId
 * to send to the backend, letting the backend handle merge logic
 */
export function useDisambiguation({ ambiguousFilters, sessionId }: UseDisambiguationProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [currentEntity, setCurrentEntity] = useState<AmbiguousEntity | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>([])
  const [pendingInitialization, setPendingInitialization] = useState(false)
  const [pendingCheckNextFilter, setPendingCheckNextFilter] = useState(false)

  // Add a ref to track processed filters and prevent infinite loops
  const processedFiltersRef = useRef<Set<string>>(new Set())

  // Get valid ambiguous filters
  const getAmbiguousFilters = useCallback((): AmbiguousFilterGroup[] => {
    return ambiguousFilters && ambiguousFilters.length > 0 ? ambiguousFilters : []
  }, [ambiguousFilters])

  // Show next disambiguation if available - with loop protection
  const showNextDisambiguation = useCallback(() => {
    // Don't try to show anything if a dialog is already showing
    if (showDialog || currentEntity !== null) return false

    const filters = getAmbiguousFilters()
    if (filters.length > 0) {
      // Find the first one we haven't shown yet using our ref to track processed filters
      const nextGroup = findNextUnprocessedFilterGroup(filters, processedFiltersRef.current)

      if (nextGroup) {
        setCurrentEntity(convertToAmbiguousEntity(nextGroup))
        setShowDialog(true)
        return true
      }
    }

    return false
  }, [getAmbiguousFilters, showDialog, currentEntity])

  // Effect to process pending initialization
  useEffect(() => {
    if (pendingInitialization) {
      setPendingInitialization(false)
      showNextDisambiguation()
    }
  }, [pendingInitialization, showNextDisambiguation])

  // Effect to check for next filter
  useEffect(() => {
    if (pendingCheckNextFilter) {
      setPendingCheckNextFilter(false)
      showNextDisambiguation()
    }
  }, [pendingCheckNextFilter, showNextDisambiguation])

  // Reset state for new searches
  const resetState = useCallback(() => {
    setSelectedFilters([])
    setCurrentEntity(null)
    setShowDialog(false)
    setPendingInitialization(false)
    setPendingCheckNextFilter(false)
    processedFiltersRef.current = new Set() // Reset the processed filters tracking
  }, [])

  // Handle option selection
  const handleOptionSelect = useCallback(
    (_entityType: string, optionId: string) => {
      if (!currentEntity) return

      const selectedOption = currentEntity.options.find((option) => option.id === optionId)
      if (!selectedOption?.originalFilter) return

      const filter = selectedOption.originalFilter as Filter

      // Add the selected filter to our collection
      setSelectedFilters((prev) => [...prev, filter])

      // Track this filter as processed to avoid infinite loops
      if (filter.getKind() && filter.getName()) {
        processedFiltersRef.current.add(`${filter.getKind()}_${filter.getName()}`)
      }

      // Close dialog
      setShowDialog(false)
      setCurrentEntity(null)

      // Request checking for next filter through state
      setPendingCheckNextFilter(true)
    },
    [currentEntity]
  )

  // Handle dialog close (skip this disambiguation)
  const handleDialogClose = useCallback(() => {
    // Mark current entity as processed to avoid showing it again
    if (currentEntity) {
      for (const option of currentEntity.options) {
        const filter = option.originalFilter as Filter
        if (filter?.getKind && filter?.getName) {
          processedFiltersRef.current.add(`${filter.getKind()}_${filter.getName()}`)
        }
      }
    }

    setShowDialog(false)
    setCurrentEntity(null)

    // Request checking for next filter through state
    setPendingCheckNextFilter(true)
  }, [currentEntity])

  // Initialize disambiguation process
  const initializeDisambiguation = useCallback(() => {
    resetState()
    setPendingInitialization(true)
  }, [resetState])

  return {
    showDisambiguationDialog: showDialog,
    currentAmbiguousEntity: currentEntity,
    handleDisambiguationOptionSelect: handleOptionSelect,
    handleDisambiguationDialogClose: handleDialogClose,
    resetDisambiguationState: resetState,
    initializeDisambiguation,
    selectedFilters,
    sessionId,
  }
}
