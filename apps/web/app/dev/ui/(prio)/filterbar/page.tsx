'use client'

import { DebugScenarioWrapper } from '@/components/debug/debug-scenario-wrapper'
import { FilterBar } from '@/components/filterbar/filter-bar'
import type { SearchMode } from '@/components/filterbar/filter-bar'
import { ViewMode } from '@/components/multi-view/multi-view'
import { useState } from 'react'
import { type MockFilterTag, mockFilterTags } from '../../mocks/filterbar'
import type { MockOption } from '../../mocks/types'

export default function FilterbarPage() {
  const [filterTags, setFilterTags] = useState<MockFilterTag[]>([...mockFilterTags])

  const [sortValue, setSortValue] = useState<MockOption<string> | undefined>({ id: 'relevance', label: 'Relevance', value: 'relevance' })

  const [sortOptions, setSortOptions] = useState<MockOption<string>[]>([
    { id: 'relevance', label: 'Relevance', value: 'relevance' },
    { id: 'date', label: 'Date', value: 'date' },
    { id: 'popularity', label: 'Popularity', value: 'popularity' },
  ])
  const [searchQuery, setSearchQuery] = useState<string>('Sample search query')
  const [searchMode, setSearchMode] = useState<SearchMode>('smart')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [gridSize, setGridSize] = useState<string>('medium')
  const [selectedTags, setSelectedTags] = useState<string[]>(['concert', 'festival'])
  const [showPinnedOnly, setShowPinnedOnly] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [currentViewMode, setCurrentViewMode] = useState<ViewMode>(ViewMode.GRID)

  const handleSortChange = (value: MockOption<string>) => setSortValue(value)
  const handleSearchChange = (value: string) => setSearchQuery(value)
  const handleSearchSubmit = (value: string) => console.log('Search submitted:', value)
  const handleSearchReset = () => setSearchQuery('')
  const handleSearchModeChange = (mode: SearchMode) => setSearchMode(mode)
  const handleTagRemove = (index: number) => setFilterTags((prev) => prev.filter((_, i) => i !== index))
  const handleCategoryChange = (category: string) => setSelectedCategory(category)
  const handleGridSizeChange = (size: string) => setGridSize(size)
  const handleTagsChange = (tags: string[]) => setSelectedTags(tags)
  const handleShowPinnedOnlyChange = (value: boolean) => setShowPinnedOnly(value)
  const handleViewModeChange = (mode: ViewMode) => setCurrentViewMode(mode)

  return (
    <div>
      <DebugScenarioWrapper>
        <FilterBar
          viewMode={currentViewMode}
          onViewModeChange={handleViewModeChange}
          filterTags={filterTags}
          sortValue={sortValue}
          onSortChange={handleSortChange}
          sortOptions={sortOptions}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onSearchReset={handleSearchReset}
          searchMode={searchMode}
          onSearchModeChange={handleSearchModeChange}
          onTagRemove={handleTagRemove}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          gridSize={gridSize}
          onGridSizeChange={handleGridSizeChange}
          selectedTags={selectedTags}
          onTagsChange={handleTagsChange}
          showPinnedOnly={showPinnedOnly}
          onShowPinnedOnlyChange={handleShowPinnedOnlyChange}
          isLoading={isLoading}
        />
      </DebugScenarioWrapper>
    </div>
  )
}
