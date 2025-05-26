'use client'

import { LayoutGrid, List } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { LIST_VIEW, TIMELINE_VIEW, useViewType } from './view-type-context'

const VIEW_LABELS = {
  [TIMELINE_VIEW]: 'List View',
  [LIST_VIEW]: 'Timeline',
}

export function ViewToggleButton() {
  const { viewType, toggleViewType } = useViewType()
  const [isHovered, setIsHovered] = useState(false)

  const label = VIEW_LABELS[viewType]

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
      {/* Label above the button */}
      {isHovered && (
        <div className="mb-2 rounded-xl border border-border bg-background/80 px-2.5 py-1 backdrop-blur-xs dark:bg-background/90">
          <span className="text-xs font-medium text-foreground">{label}</span>
        </div>
      )}

      <Button
        className="h-14 w-14 rounded-full"
        variant="default"
        onClick={toggleViewType}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {viewType === TIMELINE_VIEW ? (
          <List size={24} className="text-primary-foreground" />
        ) : (
          <LayoutGrid size={24} className="text-primary-foreground" />
        )}
      </Button>
    </div>
  )
}
