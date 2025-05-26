import type { Filter } from '@prio-grpc/entities/proto/api/v1/common_pb'
import type { FilterTag, NLFilterState } from '@prio-grpc/entities/proto/api/v1/event_pb'
import type { Option } from '@prio-grpc/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { EventSortItem } from '../../../api/event'
import { useDebounce } from '../../../hooks'
import { createPinnedFilter } from '../pin-management'
import { createUnifiedSearchFilter } from './search-filters'
import { useDisambiguation } from './useDisambiguation'

interface UseEventFiltersProps {
  metadata: {
    filterState?: NLFilterState
    filterTags?: FilterTag[]
    sortOptions?: Option<EventSortItem>[]
  }
  dateRangeFilter?: Filter
}

/**
 * Hook that handles event filtering logic
 *
 * Provides functionality for:
 * - Text search (automatic update)
 * - Smart search (only with explicit submission)
 * - Pinned event filters
 * - Date range filters
 * - Smart query disambiguation
 * - Sorting options management
 */
export function useEventFilters({ metadata, dateRangeFilter }: UseEventFiltersProps) {
  // Search states
  const [userInputText, setUserInputText] = useState('')
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('')
  const [searchMode, setSearchMode] = useState<'smart' | 'text'>('smart')
  const [pendingSmartQuery, setPendingSmartQuery] = useState('')
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)

  // Session state and sorting
  const [nlSessionId, setNlSessionId] = useState<string | undefined>(undefined)
  const [sortValue, setSortValue] = useState<Option<EventSortItem>>()
  const [sortOptions, setSortOptions] = useState<Option<EventSortItem>[]>([])
  const [currentSort, setCurrentSort] = useState<EventSortItem | undefined>()

  // References for tracking state without triggering re-renders
  const processedFilterStateIdRef = useRef<string | undefined>(undefined)
  const disambiguationInitializedRef = useRef(false)

  // Apply debounce to user input text
  const debouncedUserInput = useDebounce(userInputText, 350)

  // Disambiguation data - memoized to prevent unnecessary recreations
  const disambiguationData = useMemo(
    () => ({
      ambiguousFilters: metadata?.filterState?.getAmbiguousFiltersList?.() || [],
      sessionId: nlSessionId,
    }),
    [metadata?.filterState, nlSessionId]
  )

  // Disambiguation hook
  const disambiguation = useDisambiguation(disambiguationData)

  // Update the sessionId when it changes in metadata
  useEffect(() => {
    const newSessionId = metadata?.filterState?.getSessionId?.()
    if (newSessionId) {
      setNlSessionId(newSessionId)
    }
  }, [metadata?.filterState])

  // Initialize and manage sort options
  useEffect(() => {
    const availableSortOptions = metadata?.sortOptions || []
    setSortOptions(availableSortOptions)

    if (!sortValue && availableSortOptions.length > 0) {
      setSortValue(availableSortOptions[0])
      setCurrentSort(availableSortOptions[0].value)
    }
  }, [metadata?.sortOptions, sortValue])

  // Process ambiguous filters when metadata changes
  useEffect(() => {
    const filterState = metadata?.filterState

    if (!filterState || searchMode !== 'smart' || !pendingSmartQuery) {
      return
    }

    const currentFilterStateId =
      filterState.getSessionId?.() || (filterState.getAmbiguousFiltersList ? String(filterState.getAmbiguousFiltersList().length) : '0')

    if (processedFilterStateIdRef.current === currentFilterStateId && disambiguationInitializedRef.current) {
      return
    }

    processedFilterStateIdRef.current = currentFilterStateId

    const ambiguousFilters = filterState.getAmbiguousFiltersList?.()
    const hasAmbiguousFilters = ambiguousFilters && ambiguousFilters.length > 0

    if (hasAmbiguousFilters && !disambiguationInitializedRef.current) {
      disambiguation.initializeDisambiguation()
      disambiguationInitializedRef.current = true
    }
  }, [metadata?.filterState, searchMode, pendingSmartQuery, disambiguation])

  // Reset processing flags when query changes
  useEffect(() => {
    disambiguationInitializedRef.current = false
  }, [pendingSmartQuery])

  // Apply search query with debounce in text mode
  useEffect(() => {
    if (searchMode === 'text') {
      setAppliedSearchQuery(debouncedUserInput)
    }
  }, [debouncedUserInput, searchMode])

  // Extract filter tags from filterState
  const filterTags = useMemo(() => {
    if (metadata?.filterState?.getExtractedTagsList) {
      const stateTags = metadata.filterState.getExtractedTagsList()
      if (stateTags && stateTags.length > 0) {
        return stateTags
      }
    }
    return metadata?.filterTags || []
  }, [metadata?.filterState, metadata?.filterTags])

  // Reset nlSessionId and related state
  const resetNlSessionId = useCallback(() => {
    setNlSessionId(undefined)
    disambiguationInitializedRef.current = false
    processedFilterStateIdRef.current = undefined
    disambiguation.resetDisambiguationState()
  }, [disambiguation])

  // Execute smart search when user explicitly submits
  const executeSmartSearch = useCallback(
    (query: string) => {
      if (searchMode !== 'smart') return

      setAppliedSearchQuery(query)
      setPendingSmartQuery(query)
      disambiguation.resetDisambiguationState()
      disambiguationInitializedRef.current = false
    },
    [searchMode, disambiguation]
  )

  // Handle search mode change
  const handleSearchModeChange = useCallback(
    (mode: 'smart' | 'text') => {
      setSearchMode(mode)
      if (mode === 'text') {
        setAppliedSearchQuery(debouncedUserInput)
      }
    },
    [debouncedUserInput]
  )

  // Handle sort change
  const handleSortChange = useCallback((value: Option<EventSortItem>) => {
    setSortValue(value)
    setCurrentSort(value.value)
  }, [])

  // Reset search state
  const resetSearch = useCallback(() => {
    setUserInputText('')
    setAppliedSearchQuery('')
    setPendingSmartQuery('')
    resetNlSessionId()
  }, [resetNlSessionId])

  // Calculate filters based on current state
  const filters = useMemo(() => {
    const result: Filter[] = []

    // Add disambiguation filters or unified search filter
    if (searchMode === 'smart' && disambiguation.selectedFilters.length > 0) {
      for (const filter of disambiguation.selectedFilters) {
        if (filter) result.push(filter)
      }
    } else {
      const queryToUse = searchMode === 'smart' ? pendingSmartQuery : appliedSearchQuery
      if (queryToUse) {
        const filter = createUnifiedSearchFilter(queryToUse, searchMode === 'smart')
        if (filter) result.push(filter)
      }
    }

    // Add pinned items filter if enabled
    if (showPinnedOnly) {
      const filter = createPinnedFilter(true)
      if (filter) result.push(filter)
    }

    // Add date range filter if available
    if (dateRangeFilter) {
      result.push(dateRangeFilter)
    }

    return result
  }, [searchMode, appliedSearchQuery, pendingSmartQuery, showPinnedOnly, dateRangeFilter, disambiguation.selectedFilters])

  // Public API of the hook
  return useMemo(
    () => ({
      // Filter related values
      filters,
      filterTags,
      showPinnedOnly,
      setShowPinnedOnly,

      nlSessionId,
      resetNlSessionId,

      // Search related values
      search: {
        query: userInputText,
        setQuery: setUserInputText,
        executeSearch: executeSmartSearch,
        mode: searchMode,
        setMode: setSearchMode,
        handleModeChange: handleSearchModeChange,
        reset: resetSearch,
      },

      // Sorting related values
      sort: {
        value: sortValue,
        options: sortOptions,
        current: currentSort,
        handleChange: handleSortChange,
      },

      // Disambiguation related values
      disambiguation,
    }),
    [
      filters,
      filterTags,
      showPinnedOnly,
      nlSessionId,
      userInputText,
      searchMode,
      sortValue,
      sortOptions,
      currentSort,
      executeSmartSearch,
      handleSearchModeChange,
      resetSearch,
      handleSortChange,
      resetNlSessionId,
      disambiguation,
    ]
  )
}
