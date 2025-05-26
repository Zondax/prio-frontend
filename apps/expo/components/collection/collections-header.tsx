import { LayoutGrid, Plus, User2, Users } from 'lucide-react-native'
import type React from 'react'
import { useRef, useState } from 'react'
import { Text, View } from 'react-native'
import { cn } from '~/lib/utils'

import { SearchBar } from '../explore/search-bar'
import { Button } from '../ui/button'

export type CollectionsViewFilter = 'all' | 'shared' | 'mine'

interface CollectionsHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  filterMode: CollectionsViewFilter
  onFilterModeChange: (value: CollectionsViewFilter) => void
  onCreateClick: () => void
}

interface CollectionsFilterSwitchProps {
  filterMode: CollectionsViewFilter
  onFilterModeChange: (value: CollectionsViewFilter) => void
}

const CollectionsFilterSwitch: React.FC<CollectionsFilterSwitchProps> = ({ filterMode, onFilterModeChange }) => {
  const selectedButtonStyle = 'bg-primary/10 border-primary/30'
  return (
    <View className="flex-row bg-muted/30 rounded-full border border-border">
      <Button
        variant={filterMode === 'all' ? 'outline' : 'ghost'}
        size="sm"
        className={cn(filterMode === 'all' ? selectedButtonStyle : '')}
        onPress={() => onFilterModeChange('all')}
      >
        <LayoutGrid size={14} className="mr-1" />
        <Text className="text-xs">All</Text>
      </Button>
      <Button
        variant={filterMode === 'shared' ? 'default' : 'ghost'}
        size="sm"
        className={cn(filterMode === 'shared' ? selectedButtonStyle : '')}
        onPress={() => onFilterModeChange('shared')}
      >
        <Users size={14} className="mr-1" />
        <Text className="text-xs">Shared</Text>
      </Button>
      <Button
        variant={filterMode === 'mine' ? 'default' : 'ghost'}
        size="sm"
        className={cn(filterMode === 'mine' ? selectedButtonStyle : '')}
        onPress={() => onFilterModeChange('mine')}
      >
        <User2 size={14} className="mr-1" />
        <Text className="text-xs">Mine</Text>
      </Button>
    </View>
  )
}

/**
 * CollectionsHeader - Header for collections list (Expo)
 * Includes search bar, filter toggles, and create button
 */
export function CollectionsHeader({ searchQuery, onSearchChange, filterMode, onFilterModeChange, onCreateClick }: CollectionsHeaderProps) {
  const searchInputRef = useRef<any>(null)
  const [focusing, setFocusing] = useState(false)

  return (
    <View className="px-6 pt-3 pb-4 bg-background border-b border-border/30">
      {/* Search bar */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        focusing={focusing}
        setFocusing={setFocusing}
        showExamples={false}
        setShowExamples={() => {}}
        searchInputRef={searchInputRef}
        isLoading={false}
        uiHelpers={{
          placeholder: 'Search collections...',
          badge: '',
          statusText: '',
        }}
      />
      {/* Row: Filters and Create */}
      <View className="flex-row items-center justify-between">
        {/* Filter toggle group */}
        <CollectionsFilterSwitch filterMode={filterMode} onFilterModeChange={onFilterModeChange} />
        {/* Create button */}
        <Button size="icon" variant="outline" onPress={onCreateClick}>
          <Plus size={20} />
        </Button>
      </View>
    </View>
  )
}
