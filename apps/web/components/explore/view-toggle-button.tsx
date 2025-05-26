'use client'

import { Grid3X3, Map as MapIcon } from 'lucide-react'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import { ViewMode } from '../multi-view/multi-view'

interface ViewToggleButtonProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  className?: string
}

// FIXME: this should be relocatable. The location should not be hardcoded in the small component
export function ViewToggleButton({ viewMode, onViewModeChange, className }: ViewToggleButtonProps) {
  return (
    <div className={cn('fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex h-14 items-center justify-center shadow-lg', className)}>
      <ToggleGroup
        type="single"
        value={viewMode}
        onValueChange={(val) => {
          if (val) onViewModeChange(val as ViewMode)
        }}
        className="rounded-full bg-background border border-border/80"
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
  )
}
