'use client'

import { Command } from 'cmdk'
import { Check, ChevronsUpDown, Hash, Tags, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { commonTagBundles, tagCategories } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const allTags = Object.entries(tagCategories).flatMap(([category, tags]) => tags.map((tag) => `${category}/${tag}`))

  const filteredTags = allTags.filter((tag) => tag.toLowerCase().includes(searchValue.toLowerCase()))

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    onTagsChange(newTags)
  }

  const addTagBundle = (bundleName: string) => {
    const bundleTags = commonTagBundles[bundleName as keyof typeof commonTagBundles]
    const newTags = Array.from(new Set([...selectedTags, ...bundleTags]))
    onTagsChange(newTags)
  }

  const clearTags = () => {
    onTagsChange([])
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <Custom combobox with Popover and Command for rich tag selection, ARIA attributes enhanced> */}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="tag-selector-listbox"
          className="w-full md:w-[200px] justify-between relative"
        >
          <Tags className="mr-2 h-4 w-4" />
          {selectedTags.length === 0 ? (
            <span>Select tags...</span>
          ) : (
            <div className="flex items-center gap-2">
              <span>{selectedTags.length} selected</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  clearTags()
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear tags</span>
              </Button>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="start">
        <Command id="tag-selector-listbox">
          <div className="flex items-center border-b px-3">
            <Hash className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search tags..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <ScrollArea className="h-[300px]">
            {searchValue === '' && (
              <>
                <div className="p-4 pb-2">
                  <div className="text-sm font-medium">Common Tag Bundles</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(commonTagBundles).map(([name]) => (
                      <Button key={name} variant="secondary" size="sm" onClick={() => addTagBundle(name)} className="h-auto py-1.5">
                        {name.replace(/-/g, ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator className="my-2" />
              </>
            )}
            <div className="flex flex-col p-2">
              {Object.entries(tagCategories).map(([category, tags]) => {
                const categoryTags = tags.map((tag) => `${category}/${tag}`)
                const hasMatchingTags = categoryTags.some((tag) => tag.toLowerCase().includes(searchValue.toLowerCase()))

                if (!hasMatchingTags) return null

                return (
                  <div key={category} className="p-2">
                    <div className="text-sm font-medium text-muted-foreground mb-2">{category}</div>
                    <div className="flex flex-wrap gap-2">
                      {categoryTags.map((tag) => {
                        if (!tag.toLowerCase().includes(searchValue.toLowerCase())) return null
                        const isSelected = selectedTags.includes(tag)
                        return (
                          <Button
                            key={tag}
                            type="button"
                            variant={isSelected ? 'default' : 'outline'}
                            className="h-auto rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            onClick={() => toggleTag(tag)}
                            aria-pressed={isSelected}
                          >
                            {tag.split('/')[1]}
                            {isSelected && <Check className="ml-1 h-3 w-3" />}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
