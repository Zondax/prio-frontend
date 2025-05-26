'use client'

import type { EventCollection } from '@prio-state'
import { CheckCircle, Folder, Pin, Plus } from 'lucide-react'
import type { KeyboardEvent } from 'react'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export interface PinDropdownContentProps {
  isPinned: boolean
  handlePinToggle: (e: React.MouseEvent) => void
  collections: EventCollection[]
  searchQuery: string
  handleSearchChange: (value: string) => void
  isInCollection: (id: string) => boolean
  toggleEventInCollection: (id: string) => void
  setIsCreateCollectionDialogOpen: (value: boolean) => void
  setSearchQuery: (value: string) => void
  hidePin?: boolean
  actionText?: string
  isLoading?: boolean
  uiText?: {
    searchPlaceholder?: string
    noCollections?: string
    noResults?: string
    createNew?: string
    pin?: string
    unpin?: string
  }
}

export function PinDropdownContent({
  isPinned,
  handlePinToggle,
  collections,
  searchQuery,
  handleSearchChange,
  isInCollection,
  toggleEventInCollection,
  setIsCreateCollectionDialogOpen,
  setSearchQuery,
  hidePin = false,
  actionText = 'Add to Collection',
  isLoading = false,
  uiText = {},
}: PinDropdownContentProps) {
  const text = {
    searchPlaceholder: uiText.searchPlaceholder ?? 'Search collections...',
    noCollections: uiText.noCollections ?? 'Create your first collection',
    noResults: uiText.noResults ?? 'No collections found',
    createNew: uiText.createNew ?? 'Create New Collection',
    pin: uiText.pin ?? 'Pin Event',
    unpin: uiText.unpin ?? 'Unpin Event',
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearchQuery('')
      e.stopPropagation()
    }
  }

  const renderLoadingSkeleton = () => (
    <div className="space-y-2 p-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 flex-1 rounded" />
        </div>
      ))}
    </div>
  )

  const renderCollectionsList = () => {
    if (isLoading) return renderLoadingSkeleton()
    if (collections.length === 0) return <div className="px-2 py-3 text-sm text-center text-muted-foreground">{text.noCollections}</div>
    return collections.map((collection, idx) => (
      <CommandItem
        key={collection.getId()}
        onSelect={() => toggleEventInCollection(collection.getId() || '')}
        className={cn('flex items-center justify-between cursor-pointer px-2 py-2 rounded-md', idx === collections.length - 1 && 'mb-0')}
        aria-label={`Toggle collection ${collection.getName()}`}
      >
        <div className="flex items-center gap-2">
          <Folder className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <span className="truncate">{collection.getName()}</span>
        </div>
        {isInCollection(collection.getId() || '') && <CheckCircle className="h-4 w-4 ml-2 text-primary" aria-hidden="true" />}
      </CommandItem>
    ))
  }

  return (
    <div className="min-w-[18rem] w-72 px-2 pt-2 pb-1">
      {!hidePin && (
        <>
          <DropdownMenuItem onClick={handlePinToggle} className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-2">
            <Pin className={cn('h-4 w-4', isPinned && 'fill-current')} aria-hidden="true" />
            <span>{isPinned ? text.unpin : text.pin}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      )}

      <Command className="rounded-xl border shadow-lg bg-background">
        <CommandInput
          placeholder={text.searchPlaceholder}
          value={searchQuery}
          onValueChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="h-9 text-sm px-3"
        />

        <CommandList className="max-h-[220px] py-0">
          <CommandEmpty className="py-3 text-sm text-center">{text.noCollections}</CommandEmpty>
          <CommandGroup className="py-0">{renderCollectionsList()}</CommandGroup>
        </CommandList>

        <CommandSeparator className="my-1" />

        <CommandItem
          onSelect={() => setIsCreateCollectionDialogOpen(true)}
          className="flex items-center justify-between cursor-pointer rounded-md px-2 py-2 hover:bg-accent border-t border-border"
        >
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span>{text.createNew}</span>
          </div>
        </CommandItem>
      </Command>
    </div>
  )
}
