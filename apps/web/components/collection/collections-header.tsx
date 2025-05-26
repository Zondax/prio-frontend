'use client'

import type { CollectionsViewFilter } from '@prio-state'
import { LayoutGrid, Plus, User2, Users } from 'lucide-react'

import { SearchInput } from '@/components/collection/search-input'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import type { ViewType } from './collections-config'

interface CollectionsHeaderProps {
  viewType: ViewType
  onViewTypeChange: (value: ViewType) => void
  onCreateClick: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
  filterMode: CollectionsViewFilter
  onFilterModeChange: (value: CollectionsViewFilter) => void
}

/**
 * CollectionsHeader - Header component for the collections overview page
 * Shows title, search, view toggle, filter toggle, and action buttons
 * Optimized for both mobile and desktop views
 */
export function CollectionsHeader({
  viewType,
  onViewTypeChange,
  onCreateClick,
  searchQuery,
  onSearchChange,
  filterMode,
  onFilterModeChange,
}: CollectionsHeaderProps) {
  return (
    <div className="py-3 md:py-4 bg-background border-b border-border/30">
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Collections title and controls row - always visible */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Filter toggle group to the left of the title */}
            <ToggleGroup
              type="single"
              value={filterMode}
              onValueChange={(val) => onFilterModeChange((val as CollectionsViewFilter) || 'all')}
              className="rounded-full bg-background border border-border"
            >
              <ToggleGroupItem
                value="all"
                className="flex gap-2 min-w-20 data-[state=on]:bg-secondary font-normal data-[state=on]:font-medium"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">All</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="shared"
                className="flex gap-2 min-w-20 data-[state=on]:bg-secondary font-normal data-[state=on]:font-medium"
              >
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Shared with me</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value="mine"
                className="flex gap-2 min-w-20 data-[state=on]:bg-secondary font-normal data-[state=on]:font-medium"
              >
                <User2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mine</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop search */}
            <div className="hidden md:block">
              <SearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search collections..."
                onClear={() => onSearchChange('')}
                className="w-64"
              />
            </div>

            {/* Gallery/Table view toggle group (right) */}
            {/* <ToggleGroup type="single" value={viewType} className="rounded-full bg-background border border-border">
              <ToggleGroupItem
                value={ViewType.GALLERY}
                className="flex gap-2 min-w-20 data-[state=on]:bg-secondary font-normal data-[state=on]:font-medium"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Gallery</span>
              </ToggleGroupItem>
              <ToggleGroupItem
                value={ViewType.TABLE}
                className="flex gap-2 min-w-20 data-[state=on]:bg-secondary font-normal data-[state=on]:font-medium"
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Table</span>
              </ToggleGroupItem>
            </ToggleGroup> */}

            {/* Desktop New Collection button with text */}
            <Button onClick={onCreateClick} variant="default" className="hidden md:flex gap-2 rounded-full items-center">
              <Plus className="h-3.5 w-3.5" />
              New Collection
            </Button>

            {/* Mobile New Collection icon button */}
            <Button onClick={onCreateClick} variant="outline" size="icon" className="md:hidden rounded-full">
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Mobile search - full width below title and controls */}
        <div className="md:hidden w-full">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search collections..."
            onClear={() => onSearchChange('')}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
