import { ChevronDown, Search, Sparkles, X } from 'lucide-react-native'
import type React from 'react'
import { Pressable, Text, View } from 'react-native'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

import type { SearchMode } from './filter-bar'

// Interface for UI helper elements
interface SearchUIHelpers {
  placeholder: string
  badge: string
  statusText: string
}

// Interface for SearchBar component
interface SearchBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit?: (value: string) => void
  onSearchReset?: () => void
  focusing: boolean
  setFocusing: (value: boolean) => void
  typing?: boolean
  searchMode?: SearchMode
  toggleSearchMode?: () => void
  filterTags?: any[]
  uiHelpers: SearchUIHelpers
  showExamples: boolean
  setShowExamples: (show: boolean) => void
  searchInputRef: React.RefObject<any>
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
  filterTags = [],
  uiHelpers,
  showExamples,
  setShowExamples,
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

  // Determine whether to show the loading effect (typing or isLoading)
  const showLoadingEffect = typing || isLoading

  return (
    <View className="flex-row gap-2 items-center mb-3">
      {/* Search container */}
      <View
        className={cn(
          'flex-row items-center rounded-full border flex-1 overflow-hidden pr-2 pl-2',
          focusing
            ? 'border-primary/40 shadow-[0_0_0_1px_rgba(var(--primary)/15%),0_2px_8px_rgba(0,0,0,0.08),0_0_0_6px_rgba(var(--primary)/1%)] bg-gradient-to-b from-background to-background/95'
            : 'border-border/80 bg-background shadow-sm'
        )}
      >
        {/* Search mode toggle - styled as a visually attractive chip/button */}
        {searchMode && (
          <Pressable
            className={cn(
              'flex-row items-center px-3 py-2 rounded-full',
              searchMode === 'smart' ? 'bg-primary/10 border border-primary/30' : 'bg-muted/50 border border-transparent'
            )}
            onPress={toggleSearchMode}
          >
            {searchMode === 'smart' ? (
              <View className="flex-row items-center gap-1.5">
                <View className="relative flex-row items-center justify-center opacity-70 w-4 h-4">
                  <Sparkles size={16} className={cn('text-primary', showLoadingEffect && 'opacity-70')} />
                  {showLoadingEffect && <View className="absolute inset-0 bg-primary/5 rounded-full opacity-70" />}
                </View>
                <Text className={'text-xs font-medium tracking-tigh text-primary font-body'}>AI</Text>
                <ChevronDown size={12} className="text-primary opacity-70 ml-0.5" />
              </View>
            ) : (
              <View className="flex-row items-center gap-1.5">
                <Search size={16} className="text-muted-foreground" />
                <Text className="text-xs font-medium tracking-tight text-muted-foreground font-body">Text</Text>
                <ChevronDown size={12} className="text-muted-foreground opacity-70 ml-0.5" />
              </View>
            )}
          </Pressable>
        )}

        {/* Search input */}
        <View className="flex-1 relative">
          {/* We use an Input when focused and a Pressable with Text when not focused
              because Input doesn't properly support ellipsis (ellipsizeMode) in React Native */}
          {focusing ? (
            <Input
              ref={searchInputRef}
              placeholder={uiHelpers.placeholder}
              className={cn('border-0 bg-transparent pl-2 pr-8 max-h-[40px] py-[2px]', showLoadingEffect && 'text-primary')}
              value={searchQuery}
              onChangeText={onSearchChange}
              onFocus={() => {
                setFocusing(true)
                if (!searchQuery && searchMode === 'smart') {
                  setShowExamples(true)
                }
              }}
              onBlur={() => {
                setFocusing(false)
              }}
              onSubmitEditing={handleSearch}
              numberOfLines={1}
              multiline={false}
            />
          ) : (
            <Pressable
              className="justify-center min-h-[40px] pl-2 pr-8 py-[2px]"
              onPress={() => {
                setFocusing(true)
                if (searchInputRef?.current?.focus) {
                  searchInputRef.current.focus()
                }
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className={cn('text-base text-foreground font-body', !searchQuery && 'text-muted-foreground')}
              >
                {searchQuery || uiHelpers.placeholder}
              </Text>
            </Pressable>
          )}

          {/* Right side actions */}
          <View className="absolute right-2 top-3.5 flex-row items-center gap-1">
            {/* Clear button */}
            {searchQuery ? (
              <Pressable
                className="opacity-70"
                onPress={() => {
                  if (onSearchReset) {
                    onSearchReset()
                  } else {
                    onSearchChange('')
                  }
                }}
              >
                <X size={16} className="text-muted-foreground" />
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Search button for AI search */}
        {searchMode === 'smart' && searchQuery && showLoadingEffect ? (
          <Pressable
            className={cn('py-2 px-3 mr-1 rounded-full', showLoadingEffect ? 'bg-primary/20' : 'bg-primary/10')}
            onPress={handleSearch}
          >
            <View className="flex-row items-center gap-1">
              <View className="h-1 w-1 bg-primary/80 opacity-70" />
              <View className="h-1 w-1 bg-primary/80 opacity-70" />
              <View className="h-1 w-1 bg-primary/80 opacity-70" />
            </View>
          </Pressable>
        ) : null}
      </View>
    </View>
  )
}
