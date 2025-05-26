'use client'

import type { Activity, Event } from '@prio-state'

import { useTimelineLayout } from './timeline-layout-context'

interface ActivityDetailsProps {
  selectedActivity: Activity
  renderActivityDetails?: (event: Event) => React.ReactNode
  onClose: () => void
}

export function ActivityDetails({ selectedActivity, renderActivityDetails, onClose }: ActivityDetailsProps) {
  const { headerHeight: top, timeColumnWidth: left } = useTimelineLayout()

  if (!selectedActivity) return null

  return (
    <>
      <div className="fixed inset-0 bg-background/80 z-40" onClick={onClose} />

      <div
        className="absolute z-50 text-sm bg-background rounded-md p-4 space-y-2 border border-muted max-w-88"
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: `calc(100% - ${left}px)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {renderActivityDetails ? (
          renderActivityDetails(selectedActivity.getEvent() as Event)
        ) : (
          <>
            <div className="font-medium mb-1 line-clamp-2">{selectedActivity.getEvent()?.getTitle()}</div>
            <div className="text-sm text-muted-foreground">{selectedActivity.getEvent()?.getDescription()}</div>
          </>
        )}
      </div>
    </>
  )
}
