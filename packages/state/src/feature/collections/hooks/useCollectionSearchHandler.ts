import { useCallback, useState } from 'react'

interface FiltersHook {
  search: {
    setText: (value: string) => void
  }
}

interface UseCollectionSearchHandlerResult {
  searchQuery: string
  handleSearchChange: (value: string) => void
}

/**
 * useCollectionSearchHandler
 * Handler hook for managing the search query state and change logic for collections.
 */
export function useCollectionSearchHandler(filtersHook: FiltersHook): UseCollectionSearchHandlerResult {
  const [searchQuery, setSearchQuery] = useState('')

  // Handler for search input change
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value)
      filtersHook.search.setText(value)
    },
    [filtersHook.search]
  )

  return {
    searchQuery,
    handleSearchChange,
  }
}
