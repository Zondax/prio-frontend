import type { EventCollectionFilter, EventCollectionVisibilityType } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import type { Option } from '@prio-grpc/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDebounce } from '../../../hooks/use-debounce'
import {
  type CollectionsViewFilter,
  createCanManageEventsFilter,
  createMyCollectionsFilter,
  createNameFilter,
  createOwnerFilter,
  createSharedWithMeFilter,
  createVisibilityFilter,
} from '../filter-management'

export interface CollectionSortItem {
  kind?: string
  orderAscending?: boolean
}

export interface UseCollectionFiltersProps {
  metadata?: {
    sortOptions?: Option<CollectionSortItem>[]
  }
  defaultVisibility?: EventCollectionVisibilityType
  defaultOwner?: string
  defaultFilterMode?: CollectionsViewFilter
}

export function useCollectionFilters({
  metadata,
  defaultVisibility,
  defaultOwner,
  defaultFilterMode = 'all',
}: UseCollectionFiltersProps = {}) {
  // Search state
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText, 350)

  // Filter mode state (all/shared/mine)
  const [filterMode, setFilterMode] = useState<CollectionsViewFilter>(defaultFilterMode)

  // Filter toggles
  const [showMyCollections, setShowMyCollections] = useState(false)
  const [sharedWithMe, setSharedWithMe] = useState(false)
  const [canManageEvents, setCanManageEvents] = useState(false)
  const [visibility, setVisibility] = useState<EventCollectionVisibilityType | undefined>(defaultVisibility)
  const [owner, setOwner] = useState<string | undefined>(defaultOwner)

  // When filterMode changes, update toggles accordingly
  useEffect(() => {
    setShowMyCollections(filterMode === 'mine')
    setSharedWithMe(filterMode === 'shared')
    // If 'all', both toggles are false
    if (filterMode === 'all') {
      setShowMyCollections(false)
      setSharedWithMe(false)
    }
  }, [filterMode])

  // Sorting
  const [sortValue, setSortValue] = useState<Option<CollectionSortItem> | undefined>(metadata?.sortOptions?.[0])
  const [sortOptions, setSortOptions] = useState<Option<CollectionSortItem>[]>(metadata?.sortOptions || [])

  // Compose filters
  const filters = useMemo(() => {
    const result: EventCollectionFilter[] = []
    if (debouncedSearchText) {
      result.push(createNameFilter(debouncedSearchText))
    }
    if (showMyCollections) {
      result.push(createMyCollectionsFilter())
    }
    if (sharedWithMe) {
      result.push(createSharedWithMeFilter())
    }
    if (canManageEvents) {
      result.push(createCanManageEventsFilter())
    }
    if (visibility !== undefined) {
      result.push(createVisibilityFilter(visibility))
    }
    if (owner) {
      result.push(createOwnerFilter(owner))
    }
    return result
  }, [debouncedSearchText, showMyCollections, sharedWithMe, canManageEvents, visibility, owner])

  // Sorting handler
  const handleSortChange = useCallback((value: Option<CollectionSortItem>) => {
    setSortValue(value)
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchText('')
    setShowMyCollections(false)
    setSharedWithMe(false)
    setCanManageEvents(false)
    setVisibility(defaultVisibility)
    setOwner(defaultOwner)
    setFilterMode('all')
  }, [defaultVisibility, defaultOwner])

  return {
    filters,
    filterMode,
    setFilterMode,
    search: {
      text: searchText,
      setText: setSearchText,
      reset: () => setSearchText(''),
    },
    toggles: {
      showMyCollections,
      setShowMyCollections,
      sharedWithMe,
      setSharedWithMe,
      canManageEvents,
      setCanManageEvents,
      visibility,
      setVisibility,
      owner,
      setOwner,
      reset: resetFilters,
    },
    sort: {
      value: sortValue,
      options: sortOptions,
      handleChange: handleSortChange,
    },
  }
}
