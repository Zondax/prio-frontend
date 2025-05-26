'use client'

import { SEARCH_EXAMPLES } from '@prio-state/feature/events/filter-management'
import type { Option } from '@prio-state/stores'
import type { FilterTag } from '@prio-state/stores/event'
import { ChevronDown, Grid3X3, Map as MapIcon, Pin, PinOff, Search, Sparkles, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { ViewMode } from '@/components/multi-view/multi-view'
import { getFilterTagColor, getFilterTagIcon } from './filter-tags'
import { type SearchBarProps as ImportedSearchBarProps, SearchBar, type SearchUIHelpers } from './search-bar'
import { SortSelector } from './sort-selector'
import { TagSelector } from './tag-selector'

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
  onTagRemove?: (index: number) => void

  selectedCategory: string
  onCategoryChange: (category: string) => void
  gridSize: string
  onGridSizeChange: (size: string) => void

  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void

  selectedTags: string[]
  onTagsChange: (tags: string[]) => void

  showPinnedOnly: boolean
  onShowPinnedOnlyChange: (showPinnedOnly: boolean) => void

  isLoading?: boolean
}

// Centralize all texts in configuration objects
const UI_CONFIG = {
  search: {
    smart: {
      placeholder: 'Find events with natural language...',
      tooltip: {
        title: 'AI-Powered Search',
        description: 'Find events using natural language',
      },
      badge: 'AI Search',
      statusText: 'Understanding query',
    },
    text: {
      placeholder: 'Find events by name or keyword...',
      tooltip: {
        title: 'Text Search',
        description: 'Find events containing these keywords',
      },
      badge: 'Text Search',
      statusText: 'Searching events',
    },
  },
}

// Helper to get all UI texts and elements based on search mode
const getSearchUiHelpers = (mode: SearchMode, isFocusing: boolean): SearchUIHelpers => {
  const config = mode === 'smart' ? UI_CONFIG.search.smart : UI_CONFIG.search.text
  const icon =
    mode === 'smart' ? (
      <Sparkles className={cn('h-4 w-4 transition-all duration-300', isFocusing ? 'text-primary' : '')} />
    ) : (
      <Search className={cn('h-4 w-4 transition-all duration-300', isFocusing ? 'text-primary' : '')} />
    )

  return {
    placeholder: config.placeholder,
    tooltip: config.tooltip,
    badge: config.badge,
    statusText: config.statusText,
    icon,
  }
}

interface FilterTagsDisplayProps {
  filterTags: FilterTag[]
  searchMode: SearchMode
  onTagRemove?: (index: number) => void
}

const FilterTagsDisplay = ({ filterTags, searchMode, onTagRemove }: FilterTagsDisplayProps) => {
  // Don't show anything in text search mode
  if (searchMode === 'text') {
    return null
  }

  // Early return if nothing to show
  if (!filterTags || filterTags.length === 0) {
    return null
  }

  // Show actual filter tags with transition
  return (
    <div className="flex flex-wrap items-center gap-1.5 mb-3.5 max-w-4xl mx-auto px-3">
      {filterTags.map((tag, i) => (
        <Badge
          key={`filter-tag-${tag.getType()}-${tag.getValue()}-${i}`}
          variant="outline"
          className={cn(
            'flex items-center gap-1.5 py-1 h-7 border shadow-sm',
            getFilterTagColor(tag.getType()),
            onTagRemove && 'group relative overflow-hidden hover:pl-7 cursor-pointer'
          )}
          onClick={() => onTagRemove?.(i)}
        >
          {onTagRemove && <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity" />}
          {onTagRemove && (
            <div className="absolute left-2 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all z-10">
              <X className="h-3.5 w-3.5 text-foreground/70" />
            </div>
          )}
          {getFilterTagIcon(tag.getType())}
          <span className="text-xs font-medium relative z-10">{tag.getValue()}</span>
        </Badge>
      ))}
    </div>
  )
}

interface ViewControlsProps<TSortOption> {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  gridSize: string
  onGridSizeChange: (size: string) => void
  showPinnedOnly: boolean
  onShowPinnedOnlyChange: (value: boolean) => void
}

const ViewControls = <TSortOption,>({
  viewMode,
  onViewModeChange,
  gridSize,
  onGridSizeChange,
  showPinnedOnly,
  onShowPinnedOnlyChange,
}: ViewControlsProps<TSortOption>) => {
  return (
    <div className="flex items-center gap-2.5">
      {/* View mode toggle - only shown on desktop */}
      <div className="hidden sm:block">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(val) => {
            if (val) onViewModeChange(val as ViewMode)
          }}
          className="rounded-full bg-background border border-border"
        >
          <ToggleGroupItem
            value={ViewMode.GRID}
            aria-label="Grid view"
            className="data-[state=on]:bg-secondary font-normal data-[state=on]:font-medium"
          >
            <Grid3X3 className="h-3.5 w-3.5 mr-1.5" />
            Grid
          </ToggleGroupItem>
          <ToggleGroupItem
            value={ViewMode.MAP}
            aria-label="Map view"
            className="data-[state=on]:bg-secondary font-normal data-[state=on]:font-medium"
          >
            <MapIcon className="h-3.5 w-3.5 mr-1.5" />
            Map
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Only show grid size toggle when in grid view and on desktop */}
      {/* {viewMode === ViewMode.EXPLORE && (
        <div className="hidden sm:block">
          <Card className="flex items-center gap-px p-0.5 shadow-sm border-border/80 bg-background rounded-full h-9">
            <Button
              variant={gridSize === '3' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onGridSizeChange('3')}
              className="h-8 rounded-full px-3"
            >
              <Grid3X3 className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs font-medium">Large</span>
            </Button>
            <Button
              variant={gridSize === '4' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onGridSizeChange('4')}
              className="h-8 rounded-full px-3"
            >
              <Grid2X2 className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs font-medium">Compact</span>
            </Button>
          </Card>
        </div>
      )} */}

      {/* Pinned toggle */}
      <PinnedToggle showPinnedOnly={showPinnedOnly} onShowPinnedOnlyChange={onShowPinnedOnlyChange} />
    </div>
  )
}

interface PinnedToggleProps {
  showPinnedOnly: boolean
  onShowPinnedOnlyChange: (value: boolean) => void
}

const PinnedToggle = ({ showPinnedOnly, onShowPinnedOnlyChange }: PinnedToggleProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={showPinnedOnly}
            onPressedChange={onShowPinnedOnlyChange}
            aria-label="Show only pinned events"
            className="flex items-center gap-2 rounded-full border border-border/80 aria-pressed:bg-secondary aria-pressed:text-secondary-foreground aria-pressed:border-transparent"
          >
            {showPinnedOnly ? <Pin className="h-3.5 w-3.5" /> : <PinOff className="h-3.5 w-3.5" />}
            <span className="whitespace-nowrap max-sm:hidden">{showPinnedOnly ? 'Pinned' : 'All'}</span>
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">Show only pinned events</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface FilterControlsProps<TSortOption> {
  viewMode: ViewMode
  sortValue?: Option<TSortOption>
  onSortChange: (value: Option<TSortOption>) => void
  sortOptions: Option<TSortOption>[]
  showFullFilters: boolean
  setShowFullFilters: (value: boolean) => void
}

const FilterControls = <TSortOption,>({
  viewMode,
  sortValue,
  onSortChange,
  sortOptions,
  showFullFilters,
  setShowFullFilters,
}: FilterControlsProps<TSortOption>) => {
  return (
    <div className="flex items-center gap-2.5">
      {/* Sort dropdown - only show in grid view */}
      {viewMode === ViewMode.GRID && <SortSelector value={sortValue} onValueChange={onSortChange} options={sortOptions} />}

      {/* Filters button - hidden as requested */}
      {/* <Button
        variant={showFullFilters ? 'default' : 'outline'}
        onClick={() => setShowFullFilters(!showFullFilters)}
        className="gap-1.5 h-9 px-3 sm:px-3.5 rounded-full"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span className="text-xs font-medium max-sm:hidden">Filters</span>
        <ChevronDown className={cn('h-3 w-3 transition-transform', showFullFilters ? 'rotate-180' : '')} />
      </Button> */}
    </div>
  )
}

interface SearchExamplesProps {
  showExamples: boolean
  searchQuery: string
  typing: boolean
  applyExample: (example: string) => void
}

const SearchExamples = ({ showExamples, searchQuery, typing, applyExample }: SearchExamplesProps) => {
  if (!showExamples || searchQuery || typing) return null

  return (
    <Card className="absolute top-16 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-xl bg-background/95 backdrop-blur-xs rounded-xl border shadow-lg z-10 animate-in fade-in slide-in-from-top-5 duration-300">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3 border-b pb-3">
          <div className="bg-primary/10 rounded-full p-2">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Natural Language Search</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Type as you naturally speak to find events. Our AI understands locations, dates, and categories.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {SEARCH_EXAMPLES.map((example, i) => (
            <Button
              key={`search-example-${example.text.substring(0, 20)}-${i}`}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left h-auto py-2 px-3 hover:bg-primary/5 group"
              onClick={() => applyExample(example.text)}
            >
              <div>
                <p className="text-sm font-normal mb-1 group-hover:text-primary transition-colors">{example.text}</p>
                <div className="flex flex-wrap gap-1.5">
                  {example.filterTags.map((tag, j) => (
                    <Badge
                      key={`example-tag-${tag.type}-${tag.value}-${j}`}
                      variant="outline"
                      className={cn('text-xs py-0.5 px-1.5', getFilterTagColor(tag.type))}
                    >
                      {getFilterTagIcon(tag.type)}
                      <span className="ml-1">{tag.value}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}

interface AdvancedFiltersProps {
  showFullFilters: boolean
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

const AdvancedFilters = ({ showFullFilters, selectedTags, onTagsChange }: AdvancedFiltersProps) => {
  if (!showFullFilters) return null

  return (
    <div className="py-3 animate-in slide-in-from-top-2 duration-200">
      <Separator className="mb-3" />
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <div className="font-medium text-sm mr-1">Filter by tags:</div>
        <TagSelector selectedTags={selectedTags} onTagsChange={onTagsChange} />
      </div>
    </div>
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
  viewMode,
  onViewModeChange,
  sortOptions,
  selectedTags,
  onTagsChange,
  showPinnedOnly,
  onShowPinnedOnlyChange,
  isLoading,
  searchMode: propSearchMode,
  onSearchModeChange,
  onTagRemove,
}: FilterBarProps<TSortOption>) {
  const [focusing, setFocusing] = useState(false)
  const [typing, setTyping] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [showFullFilters, setShowFullFilters] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

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

  const uiHelpers = getSearchUiHelpers(searchMode, focusing)

  // Apply a search example
  const applyExample = (example: string) => {
    onSearchChange(example)
    setShowExamples(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }

    // Automatically trigger search when an example is selected
    if (onSearchSubmit) {
      onSearchSubmit(example)
    }
  }

  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3.5">
        {/* Main search area - row 1 */}
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
          filterTags={filterTags}
          uiHelpers={uiHelpers}
          showExamples={showExamples}
          setShowExamples={setShowExamples}
          searchInputRef={searchInputRef}
          isLoading={isLoading}
        />

        {/* Smart search indicator - only visible in smart mode with filter tags */}
        <FilterTagsDisplay filterTags={filterTags} searchMode={searchMode} onTagRemove={onTagRemove} />

        {/* Filter controls - row 2 */}
        <div className="flex flex-wrap items-center justify-between gap-y-3">
          {/* Left side - view controls */}
          <ViewControls
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            gridSize={gridSize}
            onGridSizeChange={onGridSizeChange}
            showPinnedOnly={showPinnedOnly}
            onShowPinnedOnlyChange={onShowPinnedOnlyChange}
          />

          {/* Right side - sort and filter */}
          <FilterControls
            viewMode={viewMode}
            sortValue={sortValue}
            onSortChange={onSortChange}
            sortOptions={sortOptions}
            showFullFilters={showFullFilters}
            setShowFullFilters={setShowFullFilters}
          />
        </div>

        {/* Examples popup - enhanced with suggested queries */}
        {searchMode === 'smart' && (
          <SearchExamples showExamples={showExamples} searchQuery={searchQuery} typing={typing} applyExample={applyExample} />
        )}

        {/* Advanced filters area - visible when expanded */}
        <AdvancedFilters showFullFilters={showFullFilters} selectedTags={selectedTags} onTagsChange={onTagsChange} />
      </div>
    </div>
  )
}
