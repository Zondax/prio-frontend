'use client'

import { ChevronDown, Search, Sparkles, X } from 'lucide-react'
import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { FilterTag } from '@prio-state/stores/event'

import type { SearchMode } from './filter-bar'

// Interface for UI helper elements
export interface SearchUIHelpers {
  placeholder: string
  tooltip: {
    title: string
    description: string
  }
  badge: string
  statusText: string
  icon: React.ReactNode
}

export interface SearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit?: (value: string) => void
  onSearchReset?: () => void
  focusing: boolean
  setFocusing: (value: boolean) => void
  typing: boolean
  searchMode: SearchMode
  toggleSearchMode: () => void
  filterTags: FilterTag[]
  uiHelpers: SearchUIHelpers
  showExamples: boolean
  setShowExamples: (value: boolean | ((prev: boolean) => boolean)) => void
  searchInputRef: React.RefObject<HTMLInputElement>
  isLoading?: boolean
}

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSearchReset,
  focusing,
  setFocusing,
  typing,
  searchMode,
  toggleSearchMode,
  filterTags, // filterTags is unused, consider removing if not needed for future plans
  uiHelpers,
  showExamples, // showExamples is unused, consider removing if not needed for future plans
  setShowExamples, // setShowExamples is unused, consider removing if not needed for future plans
  searchInputRef,
  isLoading,
}: SearchBarProps) => {
  // Function to handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // If onSearchSubmit exists, use that function (for smart search)
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery)
      } else {
        // Fallback to debounce
        onSearchChange(searchQuery)
      }
    }
  }

  // Handler for keydown in the input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  // Determine whether to show the loading effect (typing or isLoading)
  const showLoadingEffect = typing || isLoading

  return (
    <div className="relative mb-3.5">
      <div
        className={cn(
          'relative rounded-full border transition-all duration-300 backdrop-blur-xs flex items-center max-w-4xl mx-auto overflow-hidden',
          focusing ? (searchMode === 'smart' ? 'border-primary' : 'border-foreground') : 'border-border'
        )}
      >
        {/* Search mode toggle - styled as a visually attractive chip/button */}
        <div className="flex items-center text-muted-foreground transition-all duration-200 z-10">
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'rounded-full relative transition-all duration-300 flex items-center gap-2',
                    searchMode === 'smart'
                      ? 'bg-primary/15 text-primary hover:bg-primary/70'
                      : 'bg-muted text-foreground hover:bg-muted/80 hover:text-foreground/70'
                  )}
                  onClick={toggleSearchMode}
                >
                  {searchMode === 'smart' ? (
                    <>
                      <div className="relative flex items-center justify-center">
                        <Sparkles className={cn('h-3.5 w-3.5 transition-all', showLoadingEffect && 'animate-pulse')} />
                        {showLoadingEffect && (
                          <>
                            <span className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-50" />
                            <span className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
                          </>
                        )}
                      </div>
                      <span className={cn('font-medium', showLoadingEffect && 'animate-pulse')}>AI Search</span>
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 duration-300" />
                    </>
                  ) : (
                    <>
                      <Search className={cn('h-3.5 w-3.5 transition-all duration-300', showLoadingEffect && 'animate-pulse')} />
                      <span className={cn('font-medium', showLoadingEffect && 'animate-pulse')}>Text Search</span>
                      <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 duration-300" />
                    </>
                  )}

                  {/* Subtle hover effect */}
                  <span className="absolute inset-0 rounded-full bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="flex flex-col rounded-sm p-4 bg-background border-border shadow-lg" sideOffset={5}>
                <div className="flex items-center gap-2 mb-1">
                  {searchMode === 'smart' ? <Sparkles className="h-4 w-4 text-primary" /> : <Search className="h-4 w-4" />}
                  <p className="font-medium">{searchMode === 'smart' ? 'AI-Powered Search' : 'Text Search'}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {searchMode === 'smart' ? 'Find events using natural language queries' : 'Find events using titles'}
                </p>

                {/* Modes switcher */}
                <ToggleGroup
                  type="single"
                  value={searchMode}
                  onValueChange={(val) => {
                    if (val && val !== searchMode) {
                      toggleSearchMode()
                    }
                  }}
                  className="flex items-center gap-2 border border-border rounded-full"
                  aria-label="Search mode"
                >
                  <ToggleGroupItem
                    value="smart"
                    aria-label="AI Search"
                    className="flex items-center gap-1.5 py-1 px-2 rounded-md transition-all text-xs duration-200 flex-1 text-center justify-center data-[state=on]:bg-primary/10 data-[state=on]:text-primary hover:bg-muted"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>AI</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="text"
                    aria-label="Text Search"
                    className="flex items-center gap-1.5 py-1 px-2 rounded-md transition-all text-xs duration-200 flex-1 text-center justify-center data-[state=on]:bg-muted data-[state=on]:text-foreground hover:bg-muted"
                  >
                    <Search className="h-3 w-3" />
                    <span>Text</span>
                  </ToggleGroupItem>
                </ToggleGroup>

                {searchMode === 'smart' && (
                  <div className="text-xs mt-2 p-2">
                    <p className="text-muted-foreground mb-1">Example</p>
                    <p className="text-primary italic">{'Events in Madrid next weekend'}</p>
                  </div>
                )}
                {searchMode === 'text' && (
                  <div className="text-xs mt-2 p-2">
                    <p className="text-muted-foreground mb-1">Examples</p>
                    <p className="italic">{'ETHCC | Blockchain | Wine tasting'}</p>
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Search input */}
        <Input
          ref={searchInputRef}
          placeholder={uiHelpers.placeholder}
          className={cn(
            'border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-4 h-full bg-transparent rounded-full flex-1 z-10',
            showLoadingEffect && 'animate-pulse'
          )}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => {
            setFocusing(true)
            // Conditional setShowExamples based on searchQuery to avoid TS error if not always present
            if (setShowExamples && !searchQuery) {
              setShowExamples(true)
            }
          }}
          onBlur={() => {
            setFocusing(false)
            // Conditional setShowExamples to avoid TS error if not always present
            if (setShowExamples) {
              setTimeout(() => setShowExamples(false), 200)
            }
          }}
          onKeyDown={handleKeyDown}
        />

        {/* Right side - search button or clear button */}
        <div className="flex items-center gap-2 z-10">
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground/70 hover:text-foreground transition-all duration-200"
              onClick={() => {
                if (onSearchReset) {
                  onSearchReset()
                }
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}

          {searchMode === 'smart' && searchQuery && (
            <Button
              type="submit"
              variant="ghost"
              onClick={handleSearch}
              className={cn(
                'w-fit sm:w-28 flex items-center gap-2 rounded-full transition-all duration-200',
                showLoadingEffect ? 'bg-primary text-primary-foreground' : 'text-primary-foreground bg-primary hover:bg-primary/70'
              )}
            >
              {showLoadingEffect ? (
                <>
                  <div className="flex items-center gap-1">
                    <span className="animate-pulse h-1 w-1 rounded-full bg-primary-foreground/80" />
                    <span className="animate-pulse delay-100 h-1 w-1 rounded-full bg-primary-foreground/80" />
                    <span className="animate-pulse delay-200 h-1 w-1 rounded-full bg-primary-foreground/80" />
                  </div>
                </>
              ) : (
                <>
                  <Search className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium hidden sm:block">Search</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
