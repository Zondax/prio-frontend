import { SEARCH_EXAMPLES } from '@mono-state/feature/events/filter-management'
import type { Option } from '@mono-state/stores'
import type { FilterTag } from '@mono-state/stores/event'
import { ChevronDown, Pin, SlidersHorizontal, Sparkles } from 'lucide-react-native'
import React, { useCallback, useRef, useState } from 'react'
import { Modal, Pressable, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { Text } from '../ui/text'
import { getFilterTagColor, getFilterTagIcon } from './filter-tags'
import { SearchBar } from './search-bar'
import { SortSelector } from './sort-selector'

// Export ViewMode for other components
export enum ViewMode {
  EXPLORE = 'explore',
  MAP = 'map',
}

// Define the SearchMode type to be used throughout the component
export type SearchMode = 'smart' | 'text'

interface FilterBarProps<TSortOption> {
  filterTags: FilterTag[]
  sortValue?: Option<TSortOption>
  onSortChange: (value: Option<TSortOption>) => void
  sortOptions: Option<TSortOption>[]

  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit?: (value: string) => void
  onSearchReset?: () => void
  searchMode?: SearchMode
  onSearchModeChange?: (mode: SearchMode) => void

  selectedCategory: string
  onCategoryChange: (category: string) => void
  gridSize: string
  onGridSizeChange: (size: string) => void

  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void

  selectedTags: string[]
  onTagsChange: (tags: string[]) => void

  showPinnedOnly: boolean
  onShowPinnedOnlyChange: (value: boolean) => void

  isLoading?: boolean
}

// Interface for UI helper elements
interface SearchUIHelpers {
  placeholder: string
  badge: string
  statusText: string
}

// Centralize all texts in configuration objects
const UI_CONFIG = {
  search: {
    smart: {
      placeholder: 'Find events with natural language...',
      badge: 'AI Search',
      statusText: 'Understanding query',
    },
    text: {
      placeholder: 'Find events by name or keyword...',
      badge: 'Text Search',
      statusText: 'Searching events',
    },
  },
}

// Helper to get all UI texts and elements based on search mode
const getSearchUiHelpers = (mode: SearchMode): SearchUIHelpers => {
  const config = mode === 'smart' ? UI_CONFIG.search.smart : UI_CONFIG.search.text

  return {
    placeholder: config.placeholder,
    badge: config.badge,
    statusText: config.statusText,
  }
}

interface FilterTagsDisplayProps {
  filterTags: FilterTag[]
  searchMode: SearchMode
}

const FilterTagsDisplay = ({ filterTags, searchMode }: FilterTagsDisplayProps) => {
  // Don't show anything in text search mode
  if (searchMode === 'text') {
    return null
  }

  // Early return if nothing to show
  if (filterTags.length === 0) {
    return null
  }

  // Show actual filter tags with transition
  return (
    <View className="flex-row flex-wrap items-center gap-1.5 mb-3">
      {/* Filter tag badges - read-only mode */}
      {filterTags.map((tag, i) => (
        <Badge
          key={`${tag.getType()}-${tag.getValue()}-${i}`}
          variant="outline"
          className={cn('flex-row items-center gap-1.5 px-2 py-1', getFilterTagColor(tag.getType()))}
        >
          {getFilterTagIcon(tag.getType())}
          <Text className="text-xs font-medium font-body">{tag.getValue()}</Text>
        </Badge>
      ))}
    </View>
  )
}

// SearchExamples component
interface SearchExamplesProps {
  showExamples: boolean
  searchQuery: string
  typing: boolean
  applyExample: (example: string) => void
  onClose: () => void
}

const SearchExamples = ({ showExamples, searchQuery, typing, applyExample, onClose }: SearchExamplesProps) => {
  if (!showExamples || searchQuery || typing) return null

  return (
    <Modal visible={showExamples} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
        <View className="flex-1 justify-start">
          <View className="mx-4 mt-36 bg-background/95 border border-border rounded-xl shadow-lg">
            <TouchableWithoutFeedback>
              <View className="p-4">
                <View className="flex-row items-center gap-3 mb-3 border-b pb-3">
                  <View className="bg-primary/10 rounded-full p-2">
                    <Sparkles size={20} className="text-primary" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium font-body">Natural Language Search</Text>
                    <Text className="text-xs text-muted-foreground mt-0.5 pr-1 font-body">
                      Type as you naturally speak to find events. Our AI understands locations, dates, and categories.
                    </Text>
                  </View>
                </View>
                <View className="space-y-2">
                  {SEARCH_EXAMPLES.map((example, i) => (
                    <Pressable
                      key={`${example.text}-${i}`}
                      className="w-full py-2 px-3 active:bg-primary/10 rounded-md"
                      onPress={() => applyExample(example.text)}
                    >
                      <View>
                        <Text className="text-sm font-normal mb-1">{example.text}</Text>
                        <View className="flex-row flex-wrap gap-1.5">
                          {example.filterTags.map((tag, j) => (
                            <Badge
                              key={`${tag.type}-${tag.value}-${j}`}
                              variant="outline"
                              className={cn('text-xs py-0.5 px-1.5', getFilterTagColor(tag.type))}
                            >
                              <View className="flex-row items-center gap-1">
                                {getFilterTagIcon(tag.type)}
                                <Text className="text-xs">{tag.value}</Text>
                              </View>
                            </Badge>
                          ))}
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  )
}

export function FilterBar<TSortOption>({
  filterTags,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSearchReset,
  sortValue,
  onSortChange,
  selectedCategory,
  onCategoryChange,
  gridSize,
  onGridSizeChange,
  sortOptions,
  selectedTags,
  onTagsChange,
  showPinnedOnly,
  onShowPinnedOnlyChange,
  isLoading,
  searchMode: propSearchMode,
  onSearchModeChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps<TSortOption>) {
  const [typing, setTyping] = useState(false)
  const [focusing, setFocusing] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const searchInputRef = useRef<any>(null)

  // Use controlled or internal search mode state
  const [internalSearchMode, setInternalSearchMode] = useState<SearchMode>('smart')
  const searchMode = propSearchMode !== undefined ? propSearchMode : internalSearchMode

  const toggleSearchMode = useCallback(() => {
    const newMode = searchMode === 'smart' ? 'text' : 'smart'
    if (onSearchModeChange) {
      onSearchModeChange(newMode)
    } else {
      setInternalSearchMode(newMode)
    }
  }, [searchMode, onSearchModeChange])

  const uiHelpers = getSearchUiHelpers(searchMode)

  // Apply a search example
  const applyExample = (example: string) => {
    onSearchChange(example)
    setShowExamples(false)

    // Automatically trigger search when an example is selected
    if (onSearchSubmit) {
      onSearchSubmit(example)
    }
  }

  // Handle showing examples
  const handleShowExamples = (show: boolean) => {
    setShowExamples(show)
  }

  // Handle close on SearchExamples
  const handleCloseExamples = () => {
    setShowExamples(false)
  }

  return (
    <View className="flex-none w-full px-6 mt-3 pb-4 border-b border-border bg-background/95">
      {/* Search bar component */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
        onSearchReset={onSearchReset}
        focusing={focusing}
        setFocusing={setFocusing}
        typing={typing}
        searchMode={searchMode}
        toggleSearchMode={toggleSearchMode}
        setShowExamples={handleShowExamples}
        showExamples={showExamples}
        searchInputRef={searchInputRef}
        isLoading={isLoading}
        uiHelpers={uiHelpers}
      />

      {/* Filter tags display */}
      <FilterTagsDisplay filterTags={filterTags} searchMode={searchMode} />

      {/* Search examples panel */}
      {searchMode === 'smart' && (
        <SearchExamples
          showExamples={showExamples}
          searchQuery={searchQuery}
          typing={typing}
          applyExample={applyExample}
          onClose={handleCloseExamples}
        />
      )}

      {/* Second row - Filters, sort and view controls */}
      <View className="flex-row justify-between items-center">
        {/* Pinned filter */}
        <Button
          variant="outline"
          size="sm"
          className={cn(showPinnedOnly ? 'bg-primary/10 border-primary/30' : 'border-border/80 bg-background')}
          onPress={() => onShowPinnedOnlyChange(!showPinnedOnly)}
        >
          <Pin size={14} className={showPinnedOnly ? 'text-primary' : 'text-foreground'} />
          <Text className={cn('text-xs font-medium', showPinnedOnly ? 'text-primary' : 'text-foreground')}>Pinned only</Text>
        </Button>

        {/* Sort selector and filters button */}
        <View className="flex-row items-center gap-2">
          <View className="flex-shrink-0">
            <SortSelector value={sortValue} onValueChange={onSortChange} options={sortOptions} />
          </View>

          <Button variant="outline" size="sm" className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full">
            <SlidersHorizontal size={14} className="text-foreground" />
            <ChevronDown size={12} className="text-muted-foreground" />
          </Button>
        </View>
      </View>
    </View>
  )
}
